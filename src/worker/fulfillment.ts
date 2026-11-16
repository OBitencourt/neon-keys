import { OrderModel } from "@/src/models/order";
import { encryptKey } from "@/src/lib/crypto";
import type { SupplierAdapter } from "@/src/lib/suppliers/supplierAdapter";

const adapters: Record<string, SupplierAdapter> = {
  eneba: new EnebaAdapter(),
};

const LOCK_MS = 5 * 60 * 1000; // bloqueio enquanto um worker processa a encomenda
const POLL_MS = 5_000; // intervalo entre consultas à mesma encomenda
const TIMEOUT_MS = 30 * 60 * 1000; // depois disto a linha falha, para revisão manual
const MAX_COST_DRIFT = 0.15; // aceita custo até +15% face ao registado na encomenda

type OrderDoc = NonNullable<Awaited<ReturnType<typeof claimOrder>>>;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Reserva (atomicamente) uma encomenda paga por cumprir
async function claimOrder() {
  const now = new Date();

  return OrderModel.findOneAndUpdate(
    {
      paymentStatus: "paid",
      fulfillmentStatus: { $in: ["pending", "processing"] },
      $or: [{ lockedUntil: null }, { lockedUntil: { $lt: now } }],
    },
    {
      $set: {
        fulfillmentStatus: "processing",
        lockedUntil: new Date(now.getTime() + LOCK_MS),
      },
    },
    { sort: { updatedAt: 1 }, new: true },
  );
}

function fail(item: { fulfillment: { status: string; error: string | null } }, reason: string) {
  item.fulfillment.status = "failed";
  item.fulfillment.error = reason;
}

// Faz avançar UMA linha da encomenda
async function processItem(order: OrderDoc, index: number) {
  const item = order.items[index];
  item.fulfillment ??= { status: "pending", ref: null, purchaseAttemptedAt: null, error: null };
  const f = item.fulfillment;

  if (f.status === "completed" || f.status === "failed") return;

  const adapter = adapters[item.supplier];
  if (!adapter) return fail(item, `Sem adaptador para "${item.supplier}".`);

  // 1) Ainda não comprámos: escolhe uma oferta fresca e compra
  if (!f.ref) {
    if (f.purchaseAttemptedAt) {
      // Chamámos a compra mas não ficou referência: pode ter sido comprada
      return fail(item, "Compra possivelmente feita sem referência. Verificar manualmente na Eneba.");
    }

    const offers = await adapter.getOffers(item.supplierProductId);
    const maxCost = Math.round(item.unitCostPrice * (1 + MAX_COST_DRIFT));

    const offer = offers
      .filter(
        (o) =>
          o.status === "available" &&
          o.currency === "EUR" &&
          (o.availableQuantity ?? 0) >= item.quantity &&
          o.costPrice <= maxCost,
      )
      .sort((a, b) => a.costPrice - b.costPrice)[0];

    if (!offer) return fail(item, "Sem oferta disponível dentro do limite de preço.");

    // Grava a tentativa ANTES de comprar (proteção contra compra duplicada)
    f.status = "processing";
    f.purchaseAttemptedAt = new Date();
    order.markModified("items");
    await order.save();

    const result = await adapter.purchase(
      [
        {
          supplierProductId: item.supplierProductId,
          supplierOfferId: offer.supplierOfferId,
          quantity: item.quantity,
          unitCostPrice: offer.costPrice,
          currency: offer.currency,
        },
      ],
      String(order._id),
    );

    f.ref = result.supplierRef;
    return;
  }

  // 2) Já comprámos: vê em que ponto está
  const status = await adapter.checkFulfillment(f.ref);

  if (status.state === "processing") {
    if (status.supplierRef) f.ref = status.supplierRef;

    const started = f.purchaseAttemptedAt ? new Date(f.purchaseAttemptedAt).getTime() : Date.now();
    if (Date.now() - started > TIMEOUT_MS) {
      fail(item, "Tempo limite excedido à espera das keys. Verificar na Eneba.");
    }
    return;
  }

  if (status.state === "failed") return fail(item, status.reason ?? "Falhou no fornecedor.");

  // completed
  if (status.keys.length !== item.quantity) {
    return fail(
      item,
      `Número de keys inesperado: recebidas ${status.keys.length}, esperadas ${item.quantity}.`,
    );
  }

  item.keys = status.keys.map((k) => ({ value: encryptKey(k.key), revealedAt: null }));
  f.status = "completed";
  f.error = null;
}

async function processOrder(order: OrderDoc) {
  for (let i = 0; i < order.items.length; i++) {
    try {
      await processItem(order, i);
    } catch (error) {
      // Erro temporário (rede, etc.): fica registado e tenta-se de novo
      const message = error instanceof Error ? error.message : String(error);
      console.error(`[worker] ${order._id} linha ${i}:`, message);
      if (order.items[i].fulfillment) order.items[i].fulfillment.error = message;
    }
  }

  const statuses: string[] = order.items.map(
    (i: { fulfillment?: { status: string } }) => i.fulfillment?.status ?? "pending",
  );

  if (statuses.every((s) => s === "completed")) {
    order.fulfillmentStatus = "completed";
    order.lockedUntil = null;
    // TODO: enviar email ao cliente a avisar que as keys estão disponíveis
  } else if (statuses.some((s) => s === "failed")) {
    order.fulfillmentStatus = "failed";
    order.lockedUntil = null;
  } else {
    order.lockedUntil = new Date(Date.now() + POLL_MS);
  }

  order.markModified("items");
  await order.save();
}

export async function runWorker(signal: AbortSignal) {
  console.log("[worker] a correr");

  while (!signal.aborted) {
    const order = await claimOrder();

    if (!order) {
      await sleep(3_000);
      continue;
    }

    try {
      await processOrder(order);
    } catch (error) {
      console.error("[worker] erro na encomenda", order._id, error);
      order.lockedUntil = new Date(Date.now() + 30_000);
      await order.save();
    }
  }

  console.log("[worker] terminado");
}