import "server-only";

import { Types } from "mongoose";
import { connectDB } from "@/src/lib/mongodb";

import { ProductModel } from "@/src/models/product";
import { ProductKeyModel } from "@/src/models/productKey";

import {
  encryptKey,
  getKeyFingerprint,
} from "./encryption";

interface AddKeyInput {
  productId: string;
  key: string;
}

export async function addKey({
  productId,
  key,
}: AddKeyInput) {
  await connectDB();

  if (!Types.ObjectId.isValid(productId)) {
    throw new Error("Invalid product ID");
  }

  const normalizedKey = key.trim();

  if (!normalizedKey) {
    throw new Error("Key cannot be empty");
  }

  const product = await ProductModel.exists({
    _id: productId,
    source: "manual",
  });

  if (!product) {
    throw new Error("Manual product not found");
  }

  const fingerprint = getKeyFingerprint(normalizedKey);

  try {
    const created = await ProductKeyModel.create({
      productId,
      encryptedKey: encryptKey(normalizedKey),
      fingerprint,
      status: "available",
    });

    return {
      id: created._id.toString(),
      productId,
      status: created.status,
    };
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      throw new Error("This key is already registered");
    }

    throw error;
  }
}