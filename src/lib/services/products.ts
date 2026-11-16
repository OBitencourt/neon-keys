import "server-only";

import { Types } from "mongoose";
import { connectDB } from "@/src/lib/mongodb";
import { ProductModel } from "@/src/models/product";
import { SupplierOfferModel } from "@/src/models/supplierOffer";
import type { Product, GameGenre } from "@/src/types/product";

type ProductRow = {
  _id: Types.ObjectId;
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

export async function getProducts(): Promise<Product[]> {
  await connectDB();

  const products = (await ProductModel.find({
    type: "Game",
    status: "active",
  })
    .sort({ createdAt: -1 })
    .lean()) as unknown as ProductRow[];

  if (!products.length) return [];

  const offers = (await SupplierOfferModel.find({
    productId: { $in: products.map((p) => p._id) },
    status: "available",
    currency: "EUR",
  })
    .select("productId availableQuantity")
    .lean()) as unknown as OfferRow[];

  const quantities = new Map<string, number>();

  for (const offer of offers) {
    const key = offer.productId.toString();

    quantities.set(
      key,
      (quantities.get(key) ?? 0) + (offer.availableQuantity ?? 0),
    );
  }

  return products.map((row) =>
    present(row, quantities.get(row._id.toString()) ?? 0),
  );
}

export async function getProductById(
  id: string,
): Promise<Product | null> {
  if (!Types.ObjectId.isValid(id)) return null;

  await connectDB();

  const row = (await ProductModel.findOne({
    _id: id,
    type: "Game",
    status: "active",
  }).lean()) as ProductRow | null;

  if (!row) return null;

  const offers = (await SupplierOfferModel.find({
    productId: row._id,
    status: "available",
    currency: "EUR",
  })
    .select("availableQuantity")
    .lean()) as { availableQuantity?: number | null }[];

  const quantity = offers.reduce(
    (sum, offer) => sum + (offer.availableQuantity ?? 0),
    0,
  );

  return present(row, quantity);
}