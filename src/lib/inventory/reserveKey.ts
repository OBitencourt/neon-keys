import "server-only";

import {
  reserveKeys,
  type ReservationSource,
} from "./reservations";

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
  const reservation = await reserveKeys({
    productId,
    referenceId: reservationItemId,
    source,
    quantity: 1,
    expiresAt,
  });

  if (reservation.status === "released") {
    throw new Error("Reservation already released");
  }

  const keyId = reservation.keyIds[0];

  if (!keyId) {
    throw new Error("Reserved key not found");
  }

  return {
    keyId,
    status: reservation.status,
  };
}