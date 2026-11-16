import type { NormalizedSupplierOffer } from "@/src/types/suppliers";
import type { SupplierAdapter, SupplierCatalogEntry } from "./supplierAdapter";
import { ProductModel } from "@/src/models/product";
import { SupplierOfferModel } from "@/src/models/supplierOffer";
import { computeSalePrice } from "@/src/config/pricing";

type SyncResult = "created" | "updated" | "skipped";

// "Anno 2070 Ubisoft CD Key" + id -> "anno-2070-ubisoft-cd-key-2143e"
function makeSlug(name: string, supplierProductId: string) {
  const text = name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // tira acentos
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  // o fim do id do fornecedor garante que o slug é único
  return `${text}-${supplierProductId.slice(-6)}`;
}

// Escolhe a oferta mais barata entre as disponíveis.
// Se nenhuma estiver disponível, usa a mais barata de todas (o produto fica inativo).
function pickCheapest(offers: NormalizedSupplierOffer[]) {
  const available = offers.filter((o) => o.status === "available");
  const pool = available.length > 0 ? available : offers;

  return {
    costPrice: Math.min(...pool.map((o) => o.costPrice)),
    isAvailable: available.length > 0,
  };
}

// Já guardámos este produto antes? As ofertas dizem-nos a que Product pertence.
async function findExistingProductId(supplier: string, supplierProductId: string) {
  const offer = await SupplierOfferModel.findOne({ supplier, supplierProductId })
    .select("productId")
    .lean();

  return offer?.productId ?? null;
}

// Cria ou atualiza as ofertas e marca como indisponíveis as que desapareceram
async function saveOffers(
  productId: unknown,
  supplier: string,
  offers: NormalizedSupplierOffer[],
) {
  await SupplierOfferModel.bulkWrite(
    offers.map((offer) => ({
      updateOne: {
        filter: {
          supplier: offer.supplier,
          supplierProductId: offer.supplierProductId,
          supplierOfferId: offer.supplierOfferId ?? null,
        },
        update: {
          $set: {
            productId,
            costPrice: offer.costPrice,
            currency: offer.currency,
            status: offer.status,
            availableQuantity: offer.availableQuantity ?? null,
            lastSyncedAt: new Date(),
          },
        },
        upsert: true,
      },
    })),
  );

  const currentIds = offers
    .map((o) => o.supplierOfferId)
    .filter((id): id is string => Boolean(id));

  await SupplierOfferModel.updateMany(
    { productId, supplier, supplierOfferId: { $nin: currentIds } },
    { $set: { status: "unavailable" } },
  );
}

// Guarda UM produto (e as suas ofertas) na base de dados
async function syncEntry({ product, offers: allOffers }: SupplierCatalogEntry): Promise<SyncResult> {
  // O preço de venda assume custos em EUR; DLCs e outros tipos não se vendem
  const offers = allOffers.filter((o) => o.currency === "EUR");
  if (product.type !== "Game" || offers.length === 0) return "skipped";

  const { costPrice, isAvailable } = pickCheapest(offers);
  const [image = "", ...gallery] = product.images;

  const data = {
    name: product.name,
    description: product.description,
    image,
    gallery: gallery.slice(0, 8),
    platform: product.platform,
    genre: product.genre,
    region: product.region,
    excludedCountries: product.excludedCountries,
    allowedCountries: product.allowedCountries ?? [],
    type: product.type,
    salePrice: computeSalePrice(costPrice),
    status: isAvailable ? "active" : "inactive",
  };

  let productId = await findExistingProductId(product.supplier, product.supplierProductId);
  let result: SyncResult = "updated";

  if (productId) {
    await ProductModel.updateOne({ _id: productId }, { $set: data });
  } else {
    const created = await ProductModel.create({
      ...data,
      slug: makeSlug(product.name, product.supplierProductId),
    });
    productId = created._id;
    result = "created";
  }

  await saveOffers(productId, product.supplier, offers);
  return result;
}

// Percorre o catálogo (por cursor) até ao limite pedido
export async function syncCatalog(
  adapter: SupplierAdapter,
  { maxProducts, pageSize = 50 }: { maxProducts: number; pageSize?: number },
) {
  const summary = { created: 0, updated: 0, skipped: 0 };
  let processed = 0;
  let cursor: string | undefined;

  while (processed < maxProducts) {
    const { items, nextCursor } = await adapter.listProducts({ cursor, limit: pageSize });

    for (const entry of items) {
      if (processed >= maxProducts) break;
      summary[await syncEntry(entry)]++;
      processed++;
    }

    if (!nextCursor || items.length === 0) break;
    cursor = nextCursor;
  }

  return summary;
}