import type { GameGenre } from "@/src/types/product";

export interface NormalizedSupplierProduct {
  supplier: string;
  supplierProductId: string;

  name: string;
  description: string;
  images: string[];

  platform: string;
  genre: GameGenre;
  region: string;
  excludedCountries: string[];
  allowedCountries?: string[]; // quando o fornecedor dá uma lista de países permitidos
  type: string;
}

export interface NormalizedSupplierOffer {
  supplier: string;
  supplierProductId: string;
  supplierOfferId?: string;

  costPrice: number; // em cêntimos
  currency: string;

  availableQuantity?: number;
  status: "available" | "unavailable" | "unknown";
}