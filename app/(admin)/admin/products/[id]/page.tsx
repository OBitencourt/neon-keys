import { notFound } from "next/navigation";
import { Types } from "mongoose";

import { connectDB } from "@/src/lib/mongodb";
import { ProductModel } from "@/src/models/product";
import EditProductForm from "@/src/components/admin/editProductForm";
import { REGION_KEYS, type RegionKey } from "@/src/config/regions";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;

  if (!Types.ObjectId.isValid(id)) {
    notFound();
  }

  await connectDB();

  const product = await ProductModel.findOne({
    _id: id,
    source: "manual",
  }).lean();

  if (!product) {
    notFound();
  }

  return (
    <EditProductForm
      product={{
        id: product._id.toString(),
        name: product.name,
        description: product.description ?? "",
        platform: product.platform,
        genre: product.genre,
        regionPreset: REGION_KEYS.includes(product.regionPreset as RegionKey)
          ? (product.regionPreset as RegionKey)
          : "GLOBAL",
        includedCountries: product.includedCountries ?? [],
        salePrice: product.salePrice,
        originalPrice: product.originalPrice ?? null,
        image: product.image ?? "",
        gallery: product.gallery ?? [],
        steamAppId: product.steamAppId ?? null,
        excludedCountries: product.excludedCountries ?? [],
        status: product.status,
        publishedOnEneba: product.eneba?.status === "published",
      }}
    />
  );
}
