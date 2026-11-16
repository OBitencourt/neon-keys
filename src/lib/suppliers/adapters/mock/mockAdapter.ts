
import { randomUUID } from "node:crypto";

import type {
  SupplierAdapter,
  SupplierPurchaseItem,
  SupplierPurchaseResult,
  FulfillmentStatus,
} from "../../supplierAdapter";

import { mockCatalog } from "./mockProducts";

export class MockAdapter implements SupplierAdapter {
  readonly supplier = "mock";

  async listProducts({
    cursor,
    limit,
  }: {
    cursor?: string;
    limit: number;
  }) {
    const start = cursor === undefined ? 0 : Number(cursor);

    if (
      !Number.isSafeInteger(start) ||
      start < 0 ||
      !Number.isSafeInteger(limit) ||
      limit <= 0
    ) {
      throw new Error("Paginação inválida.");
    }

    const items = mockCatalog.slice(start, start + limit);
    const next = start + items.length;

    return {
      items,
      nextCursor:
        next < mockCatalog.length ? String(next) : null,
    };
  }

  async searchProducts(query: string) {
    const search = query.trim().toLowerCase();

    return mockCatalog
      .filter(({ product }) =>
        product.name.toLowerCase().includes(search)
      )
      .map(({ product }) => product);
  }

  async getOffers(supplierProductId: string) {
    const entry = mockCatalog.find(
      ({ product }) =>
        product.supplierProductId === supplierProductId
    );

    return entry?.offers ?? [];
  }

  async purchase(
    items: SupplierPurchaseItem[],
    externalOrderId: string,
  ): Promise<SupplierPurchaseResult> {
    if (items.length === 0) {
      throw new Error("A compra precisa de pelo menos um item.");
    }

    for (const item of items) {
      if (!Number.isSafeInteger(item.quantity) || item.quantity <= 0) {
        throw new Error("Quantidade inválida.");
      }

      const offers = await this.getOffers(item.supplierProductId);
      const offer = offers.find(
        (o) => o.supplierOfferId === item.supplierOfferId
      );

      if (
        !offer ||
        offer.status !== "available" ||
        (offer.availableQuantity ?? 0) < item.quantity
      ) {
        throw new Error(
          `Oferta indisponível: ${item.supplierProductId}`
        );
      }
    }

    const orderId = `mock-${randomUUID()}`;

    return {
      supplierOrderId: orderId,
      status: "queued",
      supplierRef: {
        mock: true,
        orderId,
        externalOrderId,
        items: items.map((item) => ({
          supplierProductId: item.supplierProductId,
          quantity: item.quantity,
        })),
      },
    };
  }

  async checkFulfillment(
    supplierRef: Record<string, unknown>,
  ): Promise<FulfillmentStatus> {
    if (
      supplierRef.mock !== true ||
      typeof supplierRef.orderId !== "string" ||
      !Array.isArray(supplierRef.items)
    ) {
      return {
        state: "failed",
        reason: "Referência de compra mock inválida.",
      };
    }

    const items = supplierRef.items as Array<{
      supplierProductId: string;
      quantity: number;
    }>;

    const keys = items.flatMap((item) =>
      Array.from({ length: item.quantity }, (_, index) => ({
        supplierProductId: item.supplierProductId,
        key: `MOCK-NOT-VALID-${supplierRef.orderId}-${index + 1}`,
      }))
    );

    return {
      state: "completed",
      keys,
    };
  }
}
