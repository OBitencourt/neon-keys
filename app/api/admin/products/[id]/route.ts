import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";

import { getAdminAccess } from "@/src/lib/admin/acess";
import { connectDB } from "@/src/lib/mongodb";
import { ProductModel } from "@/src/models/product";
import { ProductKeyModel } from "@/src/models/productKey";
import { createProductSchema } from "@/src/schemas/adminProducts";

import {
  regionLabel,
  storedAllowedCountries,
} from "@/src/config/regions";
import { updateProductSchema } from "@/src/schemas/adminProducts";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteContext,
) {
  const { isAdmin } = await getAdminAccess();

  if (!isAdmin) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 },
    );
  }

  const { id } = await params;

  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { error: "Invalid product ID" },
      { status: 400 },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = updateProductSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid product data", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  await connectDB();

  const product = await ProductModel.findOne({
    _id: id,
    source: "manual",
  });

  if (!product) {
    return NextResponse.json(
      { error: "Product not found" },
      { status: 404 },
    );
  }

  if (product.eneba?.status === "published") {
    return NextResponse.json(
      {
        error: "Editing published Eneba products is not supported yet.",
      },
      { status: 409 },
    );
  }

  const { originalPrice, status, ...fields } = parsed.data;

  if (status === "active") {
    const availableKeys = await ProductKeyModel.countDocuments({
      productId: product._id,
      status: "available",
    });

    if (availableKeys === 0) {
      return NextResponse.json(
        { error: "Add at least one available key before activating." },
        { status: 409 },
      );
    }
  }

  try {
    await ProductModel.updateOne(
      { _id: product._id, source: "manual" },
      {
        $set: {
          ...fields,
          region: regionLabel(fields),
          allowedCountries: storedAllowedCountries(fields),
          status,
          ...(originalPrice !== null ? { originalPrice } : {}),
        },
        ...(originalPrice === null
          ? { $unset: { originalPrice: "" } }
          : {}),
      },
      { runValidators: true },
    );

    return NextResponse.json({
      success: true,
      productId: id,
    });
  } catch (error) {
    console.error("Product update failed:", error);

    return NextResponse.json(
      { error: "Could not update product" },
      { status: 500 },
    );
  }
}