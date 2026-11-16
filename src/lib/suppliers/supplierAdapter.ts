import type {
  NormalizedSupplierProduct,
  NormalizedSupplierOffer,
} from "@/src/types/suppliers";

export interface SupplierCatalogEntry {
  product: NormalizedSupplierProduct;
  offers: NormalizedSupplierOffer[];
}

export interface SupplierPurchaseItem {
  supplierProductId: string;
  supplierOfferId?: string;
  quantity: number;
  unitCostPrice: number; // cêntimos
  currency: string;
}

export interface SupplierPurchaseResult {
  supplierOrderId: string;
  status: string;
  // Dados opacos que o adaptador precisa para continuar mais tarde
  supplierRef: Record<string, unknown>;
}

export interface SupplierDeliveredKey {
  key: string;
  supplierProductId?: string;
}

export type FulfillmentStatus =
  | { state: "processing"; supplierRef?: Record<string, unknown> }
  | { state: "failed"; reason?: string }
  | { state: "completed"; keys: SupplierDeliveredKey[] };

export interface SupplierAdapter {
  readonly supplier: string;

  // Catálogo paginado por cursor
  listProducts(params: {
    cursor?: string;
    limit: number;
  }): Promise<{ items: SupplierCatalogEntry[]; nextCursor: string | null }>;

  searchProducts(query: string): Promise<NormalizedSupplierProduct[]>;
  getOffers(supplierProductId: string): Promise<NormalizedSupplierOffer[]>;

  purchase(
    items: SupplierPurchaseItem[],
    externalOrderId: string,
  ): Promise<SupplierPurchaseResult>;

  // Chamado repetidamente até devolver "completed" ou "failed"
  checkFulfillment(supplierRef: Record<string, unknown>): Promise<FulfillmentStatus>;
}