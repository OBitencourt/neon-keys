
import "server-only";

import { Types } from "mongoose";
import { connectDB } from "@/src/lib/mongodb";

import { ProductModel } from "@/src/models/product";
import { ProductKeyModel } from "@/src/models/productKey";
import { SupplierOfferModel } from "@/src/models/supplierOffer";

import type { Product, GameGenre } from "@/src/types/product";

type ProductRow = {
  _id: Types.ObjectId;
  source?: "manual" | "supplier";
  name: string;
  image?: string;
  gallery?: string[];
  platform: string;
  salePrice: number;
  originalPrice?: number;
  genre: GameGenre;
  region: string;
  rating?: number;
  reviewsCount?: number;
  description?: string;
  allowedCountries?: string[];
};

type OfferRow = {
  productId: Types.ObjectId;
  availableQuantity?: number | null;
};

type KeyStockRow = {
  _id: Types.ObjectId;
  quantity: number;
};

// Transforma o documento do MongoDB no Product do frontend.
function present(row: ProductRow, quantity: number): Product {
  return {
    id: row._id.toString(),
    name: row.name,
    image: row.image && row.image !== "/" ? row.image : "",
    gallery: row.gallery ?? [],
    platform: row.platform,
    price: row.salePrice,
    originalPrice: row.originalPrice,
    genre: row.genre,
    region: row.region,
    rating: row.rating ?? 0,
    reviewsCount: row.reviewsCount ?? 0,
    description: row.description ?? "",
    type: "Key",
    delivery: "Instant Delivery",
    allowedCountries: row.allowedCountries ?? [],
    stockStatus:
      quantity > 0 ? `${quantity} in stock` : "Out of stock",
  };
}

// Calcula o estoque conforme a origem de cada produto.
async function getStockQuantities(
  products: ProductRow[],
): Promise<Map<string, number>> {
  const quantities = new Map<string, number>();

  const manualIds = products
    .filter((product) => product.source === "manual")
    .map((product) => product._id);

  const supplierIds = products
    .filter((product) => product.source !== "manual")
    .map((product) => product._id);

  // Estoque próprio: conta as chaves disponíveis.
  const keyStock = (await ProductKeyModel.aggregate([
    {
      $match: {
        productId: { $in: manualIds },
        status: "available",
      },
    },
    {
      $group: {
        _id: "$productId",
        quantity: { $sum: 1 },
      },
    },
  ])) as KeyStockRow[];

  for (const item of keyStock) {
    quantities.set(item._id.toString(), item.quantity);
  }

  // Fornecedores externos: soma suas ofertas disponíveis.
  const offers = (await SupplierOfferModel.find({
    productId: { $in: supplierIds },
    status: "available",
    currency: "EUR",
  })
    .select("productId availableQuantity")
    .lean()) as unknown as OfferRow[];

  for (const offer of offers) {
    const id = offer.productId.toString();

    quantities.set(
      id,
      (quantities.get(id) ?? 0) + (offer.availableQuantity ?? 0),
    );
  }

  return quantities;
}

// Busca todos os produtos ativos.
export async function getProducts(): Promise<Product[]> {
  await connectDB();

  const products = (await ProductModel.find({
    type: "Game",
    status: "active",
  })
    .sort({ createdAt: -1 })
    .lean()) as unknown as ProductRow[];

  if (!products.length) return [];

  const quantities = await getStockQuantities(products);

  return products.map((row) =>
    present(row, quantities.get(row._id.toString()) ?? 0),
  );
}

// Busca um produto específico pelo ObjectId.
export async function getProductById(
  id: string,
): Promise<Product | null> {
  if (!Types.ObjectId.isValid(id)) return null;

  await connectDB();

  const product = (await ProductModel.findOne({
    _id: id,
    type: "Game",
    status: "active",
  }).lean()) as unknown as ProductRow | null;

  if (!product) return null;

  const quantities = await getStockQuantities([product]);

  return present(
    product,
    quantities.get(product._id.toString()) ?? 0,
  );
}
