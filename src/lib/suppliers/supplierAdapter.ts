import type {
  NormalizedSupplierProduct,
  NormalizedSupplierOffer,
} from "@/src/types/suppliers";

// Produto normalizado com as suas ofertas
export interface SupplierCatalogEntry {
  product: NormalizedSupplierProduct;
  offers: NormalizedSupplierOffer[];
}

// Dados necessários para comprar um produto à fornecedora.
export interface SupplierPurchaseItem {
  supplierProductId: string;
  supplierOfferId?: string;
  quantity: number;
  unitCostPrice: number; // em cêntimos
  currency: string;
}

// Resultado da criação de uma encomenda à fornecedora.
export interface SupplierOrder {
  supplierOrderId: string;
  status: string;
}

// Chave digital devolvida pela fornecedora.
export interface SupplierDeliveredKey {
  key: string;
  supplierProductId?: string;
}

// Contrato comum que cada adaptador de fornecedor deve implementar.
export interface SupplierAdapter {
  readonly supplier: string;

  // Catálogo paginado, para o sync
  listProducts(params: {
    page: number;
    limit: number;
  }): Promise<{ items: SupplierCatalogEntry[]; hasMore: boolean }>;

  // Pesquisa pontual
  searchProducts(query: string): Promise<NormalizedSupplierProduct[]>;

  // Ofertas, preços e disponibilidade
  getOffers(supplierProductId: string): Promise<NormalizedSupplierOffer[]>;

  // Compra à fornecedora
  purchase(
    items: SupplierPurchaseItem[],
    externalOrderId: string,
  ): Promise<SupplierOrder>;

  // Recuperação das chaves compradas
  getKeys(supplierOrderId: string): Promise<SupplierDeliveredKey[]>;
}