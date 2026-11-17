
import { NextRequest, NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "node:crypto";
import { z } from "zod";

import { connectDB } from "@/src/lib/mongodb";
import { ProductModel } from "@/src/models/product";
import { InventoryReservationModel } from "@/src/models/inventoryReservation";

import {
  reserveKeys,
  deliverKeys,
  releaseKeys,
} from "@/src/lib/inventory/reservations";

export const runtime = "nodejs";

const baseSchema = z.object({
  orderId: z.string().uuid(),
  originalOrderId: z.string().uuid().nullable().optional(),
});

const callbackSchema = z.discriminatedUnion("action", [
  baseSchema.extend({
    action: z.literal("RESERVE"),
    auctions: z.array(
      z.object({
        auctionId: z.string().uuid(),
        keyCount: z.number().int().positive(),
        price: z.object({
          amount: z.number(),
          currency: z.string(),
        }),
      }),
    ).length(1),
  }),

  baseSchema.extend({
    action: z.literal("PROVIDE"),
  }),

  baseSchema.extend({
    action: z.literal("CANCEL"),
  }),
]);

function isAuthorized(request: NextRequest): boolean {
  const expected = process.env.ENEBA_CALLBACK_TOKEN;

  if (!expected) return false;

  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return false;
  }

  const received = authorization.slice(7);

  const expectedHash = createHash("sha256")
    .update(expected)
    .digest();

  const receivedHash = createHash("sha256")
    .update(received)
    .digest();

  return timingSafeEqual(expectedHash, receivedHash);
}

export async function POST(request: NextRequest) {
  // 1. Autenticação do callback
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  // 2. Validação do payload
  const parsed = callbackSchema.safeParse(
    await request.json().catch(() => null),
  );

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid callback payload" },
      { status: 400 },
    );
  }

  const body = parsed.data;

  // Mantém a identidade original quando a Eneba informa
  // que esta chamada é uma repetição.
  const referenceId = body.originalOrderId ?? body.orderId;

  try {
    await connectDB();

    // 3. RESERVE: reservar chaves no MongoDB
    if (body.action === "RESERVE") {
      const auction = body.auctions[0];

      const product = await ProductModel.findOne({
        "eneba.auctionId": auction.auctionId,
        "eneba.syncEnabled": true,
        source: "manual",
        status: "active",
      }).select("_id");

      if (!product) {
        return NextResponse.json({
          action: "RESERVE",
          orderId: body.orderId,
          success: false,
        });
      }

      const reservation = await reserveKeys({
        productId: product._id.toString(),
        source: "eneba",
        referenceId,
        quantity: auction.keyCount,

        // Prazo conservador temporário para testes.
        // Será substituído pela política definitiva.
        expiresAt: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000,
        ),
      });

      return NextResponse.json({
        action: "RESERVE",
        orderId: body.orderId,
        success: reservation.status === "reserved" ||
                 reservation.status === "delivered",
      });
    }

    // 4. PROVIDE: entregar as chaves reservadas
    if (body.action === "PROVIDE") {
      const reservation =
        await InventoryReservationModel.findOne({
          source: "eneba",
          referenceId,
        });

      if (!reservation) {
        throw new Error("Reservation not found");
      }

      const product = await ProductModel.findById(
        reservation.productId,
      ).select("eneba.auctionId");

      const auctionId = product?.eneba?.auctionId;

      if (!auctionId) {
        throw new Error("Auction mapping not found");
      }

      const delivery = await deliverKeys({
        source: "eneba",
        referenceId,
      });

      return NextResponse.json({
        action: "PROVIDE",
        orderId: body.orderId,
        success: true,
        auctions: [
          {
            auctionId,
            keys: delivery.keys.map((key) => ({
              type: "TEXT",
              value: key,
            })),
          },
        ],
      });
    }

    // 5. CANCEL: devolver reservas ainda não entregues
    const reservation =
      await InventoryReservationModel.findOne({
        source: "eneba",
        referenceId,
      });

    if (!reservation) {
      // Confirmar cancelamento sem reserva local.
      // Precisaremos de reconciliação em produção.
      return new NextResponse(null, { status: 200 });
    }

    if (reservation.status === "reserved") {
      await releaseKeys({
        source: "eneba",
        referenceId,
      });
    }

    // Chaves entregues não voltam automaticamente
    // para o estoque.
    return new NextResponse(null, { status: 200 });

  } catch (error) {
    if (
      body.action === "RESERVE" &&
      error instanceof Error &&
      error.message === "Out of stock"
    ) {
      return NextResponse.json({
        action: "RESERVE",
        orderId: body.orderId,
        success: false,
      });
    }

    // Nunca registrar chaves descriptografadas.
    console.error("Eneba callback failed", {
      action: body.action,
      orderId: body.orderId,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });

    return NextResponse.json(
      { error: "Callback processing failed" },
      { status: 503 },
    );
  }
}
