import "server-only";

import { Types } from "mongoose";
import { connectDB } from "@/src/lib/mongodb";
import { ProductKeyModel } from "@/src/models/productKey";

type ReservationSource = "neonkeys" | "eneba";

interface ReserveKeyInput {
  productId: string;
  reservationItemId: string;
  source: ReservationSource;
  expiresAt: Date;
}

export async function reserveKey({
  productId,
  reservationItemId,
  source,
  expiresAt,
}: ReserveKeyInput) {
  await connectDB();

  if (!Types.ObjectId.isValid(productId)) {
    throw new Error("Invalid product ID");
  }

  if (!reservationItemId.trim()) {
    throw new Error("Invalid reservation ID");
  }

  if (expiresAt.getTime() <= Date.now()) {
    throw new Error("Invalid reservation expiration");
  }

  const existing = await ProductKeyModel.findOne({
    reservationItemId,
  });

  if (existing) {
    if (
      existing.productId.toString() !== productId ||
      existing.reservationSource !== source
    ) {
      throw new Error("Reservation ID conflict");
    }

    return {
      keyId: existing._id.toString(),
      status: existing.status,
    };
  }

  try {
    const reserved = await ProductKeyModel.findOneAndUpdate(
      {
        productId: new Types.ObjectId(productId),
        status: "available",
      },
      {
        $set: {
          status: "reserved",
          reservationItemId,
          reservationSource: source,
          reservedAt: new Date(),
          reservationExpiresAt: expiresAt,
        },
      },
      {
        new: true,
        sort: { createdAt: 1 },
      },
    );

    if (!reserved) {
      throw new Error("Out of stock");
    }

    return {
      keyId: reserved._id.toString(),
      status: reserved.status,
    };
  } catch (error) {
    // Duas requisições simultâneas podem tentar a mesma reserva.
    // O índice único impede a duplicação.
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      const existing = await ProductKeyModel.findOne({
        reservationItemId,
        productId: new Types.ObjectId(productId),
        reservationSource: source,
      });

      if (existing) {
        return {
          keyId: existing._id.toString(),
          status: existing.status,
        };
      }

      throw new Error("Reservation ID conflict");
    }

    throw error;
  }
}