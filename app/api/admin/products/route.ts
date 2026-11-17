import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";

import { getAdminAccess } from "@/src/lib/admin/acess";
import { connectDB } from "@/src/lib/mongodb";

import { ProductModel } from "@/src/models/product";
import { ProductKeyModel } from "@/src/models/productKey";

import { createProductSchema } from "@/src/schemas/adminProducts";
import {
  regionLabel,
  storedAllowedCountries,
} from "@/src/config/regions";

import { getKeyFingerprint } from "@/src/lib/inventory/encryption";
import { addKey } from "@/src/lib/inventory/addKey";

function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function POST(request: NextRequest) {
  const { isAdmin } = await getAdminAccess();

  if (!isAdmin) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = createProductSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Dados inválidos",
        details: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const region = regionLabel(data)

  await connectDB();

  try {
    // Verifica previamente se alguma chave já está cadastrada.
    const fingerprints = data.keys.map(getKeyFingerprint);

    if (fingerprints.length > 0) {
      const duplicate = await ProductKeyModel.exists({
        fingerprint: { $in: fingerprints },
      });

      if (duplicate) {
        return NextResponse.json(
          { error: "Uma das chaves já está cadastrada" },
          { status: 409 },
        );
      }
    }

    const baseSlug = slugify(
      `${data.name}-${data.platform}-${region}`,
    );

    const product = await ProductModel.create({
      name: data.name,
      slug: `${baseSlug || "game"}-${randomUUID().slice(0, 8)}`,

      description: data.description,
      platform: data.platform,
      genre: data.genre,
      region,
      regionPreset: data.regionPreset,
      includedCountries: data.includedCountries,

      image: data.image,
      gallery: data.gallery,

      salePrice: data.salePrice,
      originalPrice: data.originalPrice ?? undefined,

      steamAppId: data.steamAppId ?? undefined,
      excludedCountries: data.excludedCountries,
      allowedCountries: storedAllowedCountries(data),

      source: "manual",
      type: "Game",

      // Nunca publicar antes de terminar o cadastro.
      status: "inactive",

      eneba: {
        syncEnabled: false,
        status: "unpublished",
      },
    });

    let keysSaved = 0;

    try {
      for (const key of data.keys) {
        await addKey({
          productId: product._id.toString(),
          key,
        });

        keysSaved++;
      }

      // Produtos sem chaves permanecem inativos.
      if (keysSaved > 0) {
        await ProductModel.updateOne(
          { _id: product._id },
          { $set: { status: "active" } },
        );
      }

      return NextResponse.json(
        {
          id: product._id.toString(),
          keysSaved,
          status: keysSaved > 0 ? "active" : "inactive",
        },
        { status: 201 },
      );
    } catch {
      // Em caso de falha, mantém o produto inativo.
      // Algumas chaves podem ter sido cadastradas.
      return NextResponse.json(
        {
          error:
            "Produto criado como inativo. O cadastro das chaves não foi concluído.",
          productId: product._id.toString(),
          keysSaved,
        },
        { status: 500 },
      );
    }
  } catch {
    return NextResponse.json(
      { error: "Não foi possível criar o produto" },
      { status: 500 },
    );
  }
}