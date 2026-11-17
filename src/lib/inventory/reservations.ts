import "server-only";

import { Types } from "mongoose";

import { connectDB } from "@/src/lib/mongodb";
import { ProductKeyModel } from "@/src/models/productKey";
import { InventoryReservationModel } from "@/src/models/inventoryReservation";
import { decryptKey } from "./encryption";
import { ProductModel } from "@/src/models/product";

export type ReservationSource = "neonkeys" | "eneba";

export type ReservationStatus = "reserved" | "delivered" | "released";

interface ReservationIdentity {
  source: ReservationSource;
  referenceId: string;
}

interface ReserveKeysInput extends ReservationIdentity {
  productId: string;
  quantity: number;
  expiresAt: Date;
}

interface ReservationResult {
  reservationId: string;
  keyIds: string[];
  status: ReservationStatus;
}

interface ReservationDocument {
  _id: Types.ObjectId;
  productId: Types.ObjectId;
  quantity: number;
  keyIds: Types.ObjectId[];
  status: ReservationStatus;
}

function toResult(reservation: ReservationDocument): ReservationResult {
  return {
    reservationId: reservation._id.toString(),
    keyIds: reservation.keyIds.map((id) => id.toString()),
    status: reservation.status,
  };
}

function isDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 11000
  );
}

export async function reserveKeys({
  productId,
  quantity,
  source,
  referenceId,
  expiresAt,
}: ReserveKeysInput): Promise<ReservationResult> {
  await connectDB();

  if (!Types.ObjectId.isValid(productId)) {
    throw new Error("Invalid product ID");
  }

  if (!referenceId.trim() || referenceId.length > 256) {
    throw new Error("Invalid reservation reference");
  }

  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new Error("Invalid quantity");
  }

  if (!(expiresAt instanceof Date) || !Number.isFinite(expiresAt.getTime())) {
    throw new Error("Invalid expiration date");
  }

  const normalizedReference = referenceId.trim();
  const productObjectId = new Types.ObjectId(productId);

  const filter = {
    source,
    referenceId: normalizedReference,
  };

  function verifyExisting(reservation: ReservationDocument) {
    if (
      !reservation.productId.equals(productObjectId) ||
      reservation.quantity !== quantity
    ) {
      throw new Error("Reservation reference conflict");
    }

    return toResult(reservation);
  }

  const session = await ProductKeyModel.startSession();

  let result: ReservationResult | null = null;

  try {
    await session.withTransaction(
      async () => {
        const existing =
          await InventoryReservationModel.findOne(filter).session(session);

        const product = await ProductModel.exists({
          _id: productObjectId,
          source: "manual",
          status: "active",
        }).session(session);

        if (!product) {
          throw new Error("Product is not available");
        }

        if (existing) {
          result = verifyExisting(existing);
          return;
        }

        if (expiresAt.getTime() <= Date.now()) {
          throw new Error("Reservation expiration is in the past");
        }

        const [reservation] = await InventoryReservationModel.create(
          [
            {
              ...filter,
              productId: productObjectId,
              quantity,
              keyIds: [],
              status: "reserved",
              expiresAt,
            },
          ],
          { session },
        );

        const keyIds: Types.ObjectId[] = [];

        for (let index = 0; index < quantity; index++) {
          const key = await ProductKeyModel.findOneAndUpdate(
            {
              productId: productObjectId,
              status: "available",
            },
            {
              $set: {
                status: "reserved",
                reservationItemId: `${reservation._id.toString()}:${index}`,
                reservationSource: source,
                reservedAt: new Date(),
                reservationExpiresAt: expiresAt,
              },
            },
            {
              returnDocument: "after",
              sort: { createdAt: 1 },
              session,
            },
          );

          if (!key) {
            throw new Error("Out of stock");
          }

          keyIds.push(key._id);
        }

        reservation.keyIds = keyIds;
        await reservation.save({ session });

        result = toResult(reservation);
      },
      {
        readConcern: { level: "snapshot" },
        writeConcern: { w: "majority" },
      },
    );

    if (!result) {
      throw new Error("Reservation was not completed");
    }

    return result;
  } catch (error) {
    // Se outra requisição criou esta reserva enquanto
    // a transação decorria, devolvemos a reserva existente.
    if (isDuplicateKeyError(error)) {
      const existing = await InventoryReservationModel.findOne(filter);

      if (existing) {
        return verifyExisting(existing);
      }
    }

    throw error;
  } finally {
    await session.endSession();
  }
}

export async function deliverKeys({
  source,
  referenceId,
}: ReservationIdentity) {
  await connectDB();

  const session = await ProductKeyModel.startSession();
  let keyIds: string[] = [];

  try {
    await session.withTransaction(async () => {
      const reservation = await InventoryReservationModel.findOne({
        source,
        referenceId: referenceId.trim(),
      }).session(session);

      if (!reservation) {
        throw new Error("Reservation not found");
      }

      if (reservation.status === "released") {
        throw new Error("Reservation already released");
      }

      if (reservation.status === "reserved") {
        if (reservation.expiresAt.getTime() <= Date.now()) {
          throw new Error("Reservation expired");
        }

        const updated = await ProductKeyModel.updateMany(
          {
            _id: { $in: reservation.keyIds },
            status: "reserved",
            reservationSource: source,
          },
          {
            $set: {
              status: "delivered",
              deliveredAt: new Date(),
            },
          },
          { session },
        );

        if (updated.matchedCount !== reservation.quantity) {
          throw new Error("Reservation inventory mismatch");
        }

        reservation.status = "delivered";
        reservation.deliveredAt = new Date();

        await reservation.save({ session });
      }

      // Uma entrega repetida utiliza os mesmos IDs.
      keyIds = reservation.keyIds.map((id: Types.ObjectId) => id.toString());
    });
  } finally {
    await session.endSession();
  }

  // Só acedemos às chaves após confirmar a transação.
  const keys = await ProductKeyModel.find({
    _id: { $in: keyIds },
    status: "delivered",
  }).select("+encryptedKey");

  if (keys.length !== keyIds.length) {
    throw new Error("Delivered keys not found");
  }

  const encryptedById = new Map(
    keys.map((key) => [key._id.toString(), key.encryptedKey as string]),
  );

  return {
    status: "delivered" as const,
    keys: keyIds.map((id) => {
      const encrypted = encryptedById.get(id);

      if (!encrypted) {
        throw new Error("Delivered key not found");
      }

      return decryptKey(encrypted);
    }),
  };
}

export async function releaseKeys({
  source,
  referenceId,
}: ReservationIdentity) {
  await connectDB();

  const session = await ProductKeyModel.startSession();

  try {
    let result: ReservationStatus | null = null;

    await session.withTransaction(async () => {
      const reservation = await InventoryReservationModel.findOne({
        source,
        referenceId: referenceId.trim(),
      }).session(session);

      if (!reservation) {
        throw new Error("Reservation not found");
      }

      if (reservation.status === "delivered") {
        throw new Error("Delivered keys cannot be released");
      }

      if (reservation.status === "released") {
        result = "released";
        return;
      }

      const updated = await ProductKeyModel.updateMany(
        {
          _id: { $in: reservation.keyIds },
          status: "reserved",
          reservationSource: source,
        },
        {
          $set: {
            status: "available",
            reservedAt: null,
            reservationExpiresAt: null,
          },
          $unset: {
            reservationItemId: "",
            reservationSource: "",
          },
        },
        { session },
      );

      if (updated.matchedCount !== reservation.quantity) {
        throw new Error("Reservation inventory mismatch");
      }

      reservation.status = "released";
      reservation.releasedAt = new Date();

      await reservation.save({ session });

      result = "released";
    });

    return { status: result };
  } finally {
    await session.endSession();
  }
}
