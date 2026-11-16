import type { GameGenre } from "@/src/types/product";
import type {
  NormalizedSupplierOffer,
  NormalizedSupplierProduct,
} from "@/src/types/suppliers";
import type {
  FulfillmentStatus,
  SupplierAdapter,
  SupplierCatalogEntry,
  SupplierPurchaseItem,
  SupplierPurchaseResult,
} from "../../supplierAdapter";
import { enebaQuery } from "./client";
import { extractKeysFromZipUrl } from "./keysArchive";

const SUPPLIER = "eneba";
const MAX_PAGE_SIZE = 50;

/* ---------- GraphQL ---------- */

// Se a referência da API tiver mais campos de produto (imagem, descrição,
// plataforma, géneros), acrescenta-os aqui e em normalizeProduct().
const PRODUCT_FIELDS = `
  id name slug productType regions regionWhitelist regionBlacklist
  countriesWhitelist countriesHardBlacklist noActivationCountries`;

const AUCTION_FIELDS = `
  id wholesalePrice { amount currency } wholesaleStock merchant { displayName }`;

const PRODUCTS_QUERY = `
query products($first: Int, $after: String, $search: String) {
  P_wholesaleAuctionProducts(first: $first, after: $after, search: $search) {
    totalCount
    edges { node { ${PRODUCT_FIELDS} } }
    pageInfo { hasNextPage endCursor }
  }
}`;

// Um alias por produto: evita que o resultado de um produto corte o de outro
function buildOffersQuery(count: number) {
  const vars = Array.from({ length: count }, (_, i) => `$p${i}: [P_Uuid!]`).join(", ");
  const fields = Array.from(
    { length: count },
    (_, i) =>
      `a${i}: P_wholesaleAuctions(productIds: $p${i}) { edges { node { ${AUCTION_FIELDS} } } }`,
  ).join("\n");
  return `query offers(${vars}) { ${fields} }`;
}

const PURCHASE_MUTATION = `
mutation purchase($input: S_API_PurchaseWholesaleAuctionsInput!) {
  S_purchaseWholesaleAuctions(input: $input) { success orderId actionId }
}`;

const ACTION_QUERY = `
query getAction($actionId: A_Uuid!) {
  A_action(actionId: $actionId) { id state }
}`;

const ORDER_QUERY = `
query getOrder($orderIds: [O_Uuid!]) {
  O_orders(orderIds: $orderIds) {
    edges { node { id orderNumber entryToken orderState paymentState } }
  }
}`;

const EXPORT_MUTATION = `
mutation exportOrderKeys($input: O_API_ExportOrderKeysInput!) {
  O_exportOrderKeys(input: $input) { success }
}`;

const EXPORT_QUERY = `
query getOrderExport($entryToken: String!) {
  O_orderExport(entryToken: $entryToken) { id status downloadUrl expired }
}`;

/* ---------- Tipos das respostas ---------- */

type EnebaProductNode = {
  id: string;
  name: string;
  slug?: string;
  productType?: string;
  regions?: unknown;
  regionWhitelist?: unknown;
  regionBlacklist?: unknown;
  countriesWhitelist?: unknown;
  countriesHardBlacklist?: unknown;
  noActivationCountries?: unknown;
};

type EnebaAuction = {
  id: string;
  wholesalePrice: { amount: number | string; currency: string };
  wholesaleStock?: number | null;
  merchant?: { displayName?: string };
};

type EnebaRef = {
  stage: "action" | "export";
  orderId: string;
  actionId: string;
  entryToken?: string;
  orderNumber?: string;
  externalOrderId?: string;
};

/* ---------- Mapeamentos ---------- */

function toList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((v) =>
    typeof v === "string"
      ? v
      : typeof v === "object" && v !== null && "code" in v
        ? String((v as { code: unknown }).code)
        : String(v),
  );
}

function mapType(productType = ""): string {
  const t = productType.toUpperCase();
  if (t.includes("DLC") || t.includes("ADDON") || t.includes("EXPANSION")) return "DLC";
  if (t.includes("GAME")) return "Game";
  return "Other";
}

// Sem campo de plataforma confirmado, deduz-a do nome do produto
function platformFromName(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("steam")) return "Steam";
  if (n.includes("xbox")) return "Xbox";
  if (/playstation|\bpsn\b|\bps[45]\b/.test(n)) return "PlayStation";
  if (n.includes("nintendo") || n.includes("switch")) return "Nintendo";
  if (n.includes("epic")) return "Epic Games";
  if (n.includes("ea app") || n.includes("origin")) return "EA App";
  if (n.includes("ubisoft") || n.includes("uplay")) return "Ubisoft";
  return "Other";
}

function normalizeProduct(node: EnebaProductNode): NormalizedSupplierProduct {
  const regions = toList(node.regions);
  const genre: GameGenre = "Other";

  return {
    supplier: SUPPLIER,
    supplierProductId: node.id,
    name: node.name,
    description: "",
    images: [],
    platform: platformFromName(node.name),
    genre,
    region: regions[0] ?? "GLOBAL",
    excludedCountries: [
      ...new Set([
        ...toList(node.countriesHardBlacklist),
        ...toList(node.noActivationCountries),
      ]),
    ],
    allowedCountries: toList(node.countriesWhitelist),
    type: mapType(node.productType),
  };
}

function normalizeOffer(productId: string, auction: EnebaAuction): NormalizedSupplierOffer {
  const stock = Number(auction.wholesaleStock ?? 0);

  return {
    supplier: SUPPLIER,
    supplierProductId: productId,
    supplierOfferId: auction.id,
    costPrice: Math.round(Number(auction.wholesalePrice.amount)), // já vem em cêntimos
    currency: auction.wholesalePrice.currency.toUpperCase(),
    availableQuantity: stock,
    status: stock > 0 ? "available" : "unavailable",
  };
}

export class EnebaAdapter implements SupplierAdapter {
  readonly supplier = SUPPLIER;

  private async fetchOffers(productIds: string[]) {
    const result = new Map<string, NormalizedSupplierOffer[]>();
    if (productIds.length === 0) return result;

    const variables = Object.fromEntries(productIds.map((id, i) => [`p${i}`, [id]]));
    const data = await enebaQuery<
      Record<string, { edges: { node: EnebaAuction }[] } | null>
    >(buildOffersQuery(productIds.length), variables);

    productIds.forEach((id, i) => {
      const edges = data[`a${i}`]?.edges ?? [];
      result.set(id, edges.map((e) => normalizeOffer(id, e.node)));
    });

    return result;
  }

  async listProducts({ cursor, limit }: { cursor?: string; limit: number }) {
    const data = await enebaQuery<{
      P_wholesaleAuctionProducts: {
        edges: { node: EnebaProductNode }[];
        pageInfo: { hasNextPage: boolean; endCursor: string | null };
      };
    }>(PRODUCTS_QUERY, {
      first: Math.min(limit, MAX_PAGE_SIZE),
      after: cursor ?? null,
    });

    const conn = data.P_wholesaleAuctionProducts;
    const nodes = conn.edges.map((e) => e.node);
    const offers = await this.fetchOffers(nodes.map((n) => n.id));

    const items: SupplierCatalogEntry[] = nodes.map((node) => ({
      product: normalizeProduct(node),
      offers: offers.get(node.id) ?? [],
    }));

    return {
      items,
      nextCursor: conn.pageInfo.hasNextPage ? conn.pageInfo.endCursor : null,
    };
  }

  async searchProducts(query: string): Promise<NormalizedSupplierProduct[]> {
    const data = await enebaQuery<{
      P_wholesaleAuctionProducts: { edges: { node: EnebaProductNode }[] };
    }>(PRODUCTS_QUERY, { first: 20, search: query.trim() });

    return data.P_wholesaleAuctionProducts.edges.map((e) => normalizeProduct(e.node));
  }

  async getOffers(supplierProductId: string): Promise<NormalizedSupplierOffer[]> {
    const offers = await this.fetchOffers([supplierProductId]);
    return offers.get(supplierProductId) ?? [];
  }

  async purchase(
    items: SupplierPurchaseItem[],
    externalOrderId: string,
  ): Promise<SupplierPurchaseResult> {
    if (items.length === 0 || items.length > 10) {
      throw new Error("A Eneba aceita entre 1 e 10 leilões por compra.");
    }

    const auctions = items.map((item) => {
      if (!item.supplierOfferId) {
        throw new Error("A compra na Eneba precisa do id do leilão (supplierOfferId).");
      }
      return { auctionId: item.supplierOfferId, quantity: item.quantity };
    });

    const data = await enebaQuery<{
      S_purchaseWholesaleAuctions: {
        success: boolean;
        orderId: string | null;
        actionId: string | null;
      };
    }>(PURCHASE_MUTATION, { input: { items: auctions } });

    const result = data.S_purchaseWholesaleAuctions;
    if (!result.success || !result.orderId || !result.actionId) {
      throw new Error("A Eneba não aceitou a compra.");
    }

    const ref: EnebaRef = {
      stage: "action",
      orderId: result.orderId,
      actionId: result.actionId,
      externalOrderId, // a Eneba não guarda a nossa referência: fica aqui para reconciliação
    };

    return {
      supplierOrderId: result.orderId,
      status: "queued",
      supplierRef: ref,
    };
  }

  async checkFulfillment(supplierRef: Record<string, unknown>): Promise<FulfillmentStatus> {
    const ref = supplierRef as unknown as EnebaRef;

    if (ref.stage === "action") {
      const { A_action: action } = await enebaQuery<{
        A_action: { id: string; state: string } | null;
      }>(ACTION_QUERY, { actionId: ref.actionId });

      if (!action || action.state === "NEW") return { state: "processing" };
      if (action.state === "FAILED") {
        return { state: "failed", reason: "Compra recusada pela Eneba (ação FAILED)." };
      }

      // COMPLETED: vai buscar a encomenda para obter o entryToken
      const orders = await enebaQuery<{
        O_orders: {
          edges: {
            node: {
              orderNumber: string;
              entryToken: string;
              orderState: string;
              paymentState: string;
            };
          }[];
        };
      }>(ORDER_QUERY, { orderIds: [ref.orderId] });

      const order = orders.O_orders.edges[0]?.node;
      if (!order || order.orderState !== "FULFILLED" || order.paymentState !== "PAID") {
        return { state: "processing" }; // o worker aplica um tempo limite
      }

      await enebaQuery(EXPORT_MUTATION, { input: { entryToken: order.entryToken } });

      return {
        state: "processing",
        supplierRef: {
          ...ref,
          stage: "export",
          entryToken: order.entryToken,
          orderNumber: order.orderNumber,
        },
      };
    }

    // stage === "export"
    const { O_orderExport: exp } = await enebaQuery<{
      O_orderExport: {
        status: string;
        downloadUrl: string | null;
        expired: boolean;
      } | null;
    }>(EXPORT_QUERY, { entryToken: ref.entryToken });

    if (!exp || exp.status === "PENDING") return { state: "processing" };

    if (exp.status === "COMPLETED" && exp.downloadUrl && !exp.expired) {
      const email = process.env.ENEBA_ACCOUNT_EMAIL;
      if (!email) throw new Error("ENEBA_ACCOUNT_EMAIL não está definido.");

      const keys = await extractKeysFromZipUrl(exp.downloadUrl, email);
      return { state: "completed", keys: keys.map((key) => ({ key })) };
    }

    // FAILED ou link expirado: pede um novo export
    await enebaQuery(EXPORT_MUTATION, { input: { entryToken: ref.entryToken } });
    return { state: "processing" };
  }
}