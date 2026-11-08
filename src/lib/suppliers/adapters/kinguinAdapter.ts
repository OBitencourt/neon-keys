import type { GameGenre } from "@/src/types/product";
import type {
  NormalizedSupplierProduct,
  NormalizedSupplierOffer,
} from "@/src/types/suppliers";

import type {
  SupplierAdapter,
  SupplierCatalogEntry,
  SupplierPurchaseItem,
  SupplierOrder,
  SupplierDeliveredKey,
} from "../supplierAdapter";

const SUPPLIER = "kinguin";
const MAX_PAGE_SIZE = 100;

const BASE_URL = process.env.KINGUIN_API_BASE_URL;
const API_KEY = process.env.KINGUIN_API_KEY;

type KinguinImage = {
  url?: string;
  thumbnail?: string;
};

type KinguinOffer = {
  offerId?: string;
  price: number;
  qty?: number;
  availableQty?: number;
};

type KinguinProduct = {
  productId: string;
  kinguinId: number;
  name: string;
  description?: string;
  platform?: string;
  genres?: string[];
  regionalLimitations?: string;
  countryLimitation?: string[];
  tags?: string[];
  offers?: KinguinOffer[];
  images?: {
    cover?: KinguinImage;
    screenshots?: KinguinImage[];
  };
};

type KinguinProductSearchResponse = {
  results: KinguinProduct[];
  item_count: number;
};

type KinguinOrderResponse = {
  orderId: string;
  status: string;
};

type KinguinKey = {
  serial: string;
  productId?: string;
};

class KinguinError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

/* ---------- Mapeamentos para o nosso formato ---------- */

const GENRE_MAP: Record<string, GameGenre> = {
  action: "Action",
  shooter: "Action",
  fighting: "Action",
  adventure: "Adventure",
  rpg: "RPG",
  "role-playing": "RPG",
  racing: "Racing",
  simulation: "Simulation",
  sports: "Sports",
  strategy: "Strategy",
};

function mapGenre(genres: string[] = []): GameGenre {
  for (const genre of genres) {
    const mapped = GENRE_MAP[genre.toLowerCase()];
    if (mapped) return mapped;
  }
  return "Other";
}

// Os nomes têm de bater com as chaves do PLATFORM_ICONS do frontend
function mapPlatform(platform = ""): string {
  const p = platform.toLowerCase();
  if (p.includes("steam")) return "Steam";
  if (p.includes("xbox")) return "Xbox";
  if (p.includes("playstation") || p === "psn") return "PlayStation";
  if (p.includes("nintendo")) return "Nintendo";
  if (p.includes("epic")) return "Epic Games";
  return platform || "Unknown";
}

function mapRegion(region?: string): string {
  if (!region) return "Unknown";
  return /region free/i.test(region) ? "GLOBAL" : region;
}

/*
 * ATENÇÃO: no produto de exemplo todas as ofertas têm availableQty = 0
 * com qty > 0. Confirma na documentação qual dos dois campos é o stock
 * realmente comprável e ajusta só esta função.
 */
function offerQuantity(offer: KinguinOffer): number | undefined {
  return offer.availableQty ?? offer.qty;
}

export class KinguinAdapter implements SupplierAdapter {
  readonly supplier = SUPPLIER;

  /**
   * `filters` vai direto para a query da listagem, por exemplo
   * new KinguinAdapter({ platform: "Steam" }).
   * Confirma os nomes dos parâmetros na documentação.
   */
  constructor(private readonly filters: Record<string, string> = {}) {}

  private async request<T>(
    path: string,
    init: RequestInit = {},
  ): Promise<T> {
    if (!API_KEY || !BASE_URL) {
      throw new Error(
        "KINGUIN_API_KEY e KINGUIN_API_BASE_URL são obrigatórios.",
      );
    }

    const response = await fetch(
      `${BASE_URL.replace(/\/$/, "")}${path}`,
      {
        ...init,
        headers: {
          "X-Api-Key": API_KEY,
          "Content-Type": "application/json",
          ...init.headers,
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      const body = (await response.text()).slice(0, 300);
      throw new KinguinError(
        response.status,
        `Kinguin API error: ${response.status} ${response.statusText} ${body}`,
      );
    }

    return response.json() as Promise<T>;
  }

  private normalizeProduct(
    product: KinguinProduct,
  ): NormalizedSupplierProduct {
    // No exemplo, o cover só traz "thumbnail" (sem "url")
    const cover = product.images?.cover;

    const images = [
      cover?.url ?? cover?.thumbnail,
      ...(product.images?.screenshots ?? []).map(
        (image) => image.url ?? image.thumbnail,
      ),
    ].filter((url): url is string => Boolean(url));

    return {
      supplier: SUPPLIER,
      supplierProductId: product.productId,
      name: product.name,
      description: product.description ?? "",
      images,
      platform: mapPlatform(product.platform),
      genre: mapGenre(product.genres),
      region: mapRegion(product.regionalLimitations),
      excludedCountries: product.countryLimitation ?? [],
      type: product.tags?.includes("dlc") ? "DLC" : "Game",
    };
  }

  private normalizeOffers(
    product: KinguinProduct,
  ): NormalizedSupplierOffer[] {
    return (product.offers ?? []).map((offer) => {
      const quantity = offerQuantity(offer);

      return {
        supplier: SUPPLIER,
        supplierProductId: product.productId,
        supplierOfferId: offer.offerId,
        costPrice: Math.round(offer.price * 100), // cêntimos
        currency: "EUR",
        availableQuantity: quantity,
        status:
          quantity === undefined
            ? "unknown"
            : quantity > 0
              ? "available"
              : "unavailable",
      };
    });
  }

  async listProducts({
    page,
    limit,
  }: {
    page: number;
    limit: number;
  }): Promise<{ items: SupplierCatalogEntry[]; hasMore: boolean }> {
    const pageSize = Math.min(limit, MAX_PAGE_SIZE);

    const params = new URLSearchParams({
      ...this.filters,
      page: String(page),
      limit: String(pageSize),
    });

    const response =
      await this.request<KinguinProductSearchResponse>(
        `/v1/products?${params.toString()}`,
      );

    return {
      items: response.results.map((product) => ({
        product: this.normalizeProduct(product),
        offers: this.normalizeOffers(product),
      })),
      hasMore: page * pageSize < response.item_count,
    };
  }

  async searchProducts(
    query: string,
  ): Promise<NormalizedSupplierProduct[]> {
    const trimmedQuery = query.trim();

    if (trimmedQuery.length < 3) {
      throw new Error(
        "A pesquisa da Kinguin exige pelo menos 3 caracteres.",
      );
    }

    const params = new URLSearchParams({
      name: trimmedQuery,
      page: "1",
      limit: String(MAX_PAGE_SIZE),
    });

    const response =
      await this.request<KinguinProductSearchResponse>(
        `/v1/products?${params.toString()}`,
      );

    return response.results.map((product) =>
      this.normalizeProduct(product),
    );
  }

  async getOffers(
    supplierProductId: string,
  ): Promise<NormalizedSupplierOffer[]> {
    try {
      const product = await this.request<KinguinProduct>(
        `/v1/products/${encodeURIComponent(supplierProductId)}`,
      );
      return this.normalizeOffers(product);
    } catch (error) {
      // Produto removido da Kinguin: sem ofertas
      if (error instanceof KinguinError && error.status === 404) {
        return [];
      }
      throw error;
    }
  }

  async purchase(
    items: SupplierPurchaseItem[],
    externalOrderId: string,
  ): Promise<SupplierOrder> {
    const response = await this.request<KinguinOrderResponse>(
      "/v2/order",
      {
        method: "POST",
        body: JSON.stringify({
          orderExternalId: externalOrderId,
          products: items.map((item) => ({
            productId: item.supplierProductId,
            qty: item.quantity,
            price: item.unitCostPrice / 100, // preço máximo aceite, em EUR
            ...(item.supplierOfferId
              ? { offerId: item.supplierOfferId }
              : {}),
            keyType: "text",
          })),
        }),
      },
    );

    return {
      supplierOrderId: response.orderId,
      status: response.status,
    };
  }

  async getKeys(
    supplierOrderId: string,
  ): Promise<SupplierDeliveredKey[]> {
    const keys = await this.request<KinguinKey[]>(
      `/v2/order/${encodeURIComponent(supplierOrderId)}/keys`,
    );

    return keys.map((item) => ({
      key: item.serial,
      supplierProductId: item.productId,
    }));
  }
}