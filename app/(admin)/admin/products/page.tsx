import { Types } from "mongoose";

import { connectDB } from "@/src/lib/mongodb";
import { ProductModel } from "@/src/models/product";
import { ProductKeyModel } from "@/src/models/productKey";

import ProductsAdminClient from "@/src/components/admin/productsAdminClient";

export const dynamic = "force-dynamic";

type ProductRow = {
  _id: Types.ObjectId;
  name: string;
  image?: string;
  platform: string;
  salePrice: number;
  status: string;
};

type StockRow = {
  _id: Types.ObjectId;
  quantity: number;
};

export default async function AdminProductsPage() {
  await connectDB();

  const products = (await ProductModel.find({
    source: "manual",
  })
    .select("name image platform salePrice status")
    .sort({ createdAt: -1 })
    .lean()) as unknown as ProductRow[];

  const stock = (await ProductKeyModel.aggregate([
    {
      $match: {
        productId: { $in: products.map((p) => p._id) },
        status: "available",
      },
    },
    {
      $group: {
        _id: "$productId",
        quantity: { $sum: 1 },
      },
    },
  ])) as StockRow[];

  const quantities = new Map(
    stock.map((item) => [
      item._id.toString(),
      item.quantity,
    ]),
  );

  const summary = products.map((product) => ({
    id: product._id.toString(),
    name: product.name,
    image: product.image ?? "",
    platform: product.platform,
    price: product.salePrice,
    status: product.status,
    stock: quantities.get(product._id.toString()) ?? 0,
  }));

  return <ProductsAdminClient products={summary} />;
}