import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";

import { getAdminAccess } from "@/src/lib/admin/acess";
import { connectDB } from "@/src/lib/mongodb";
import { ProductModel } from "@/src/models/product";
import { addKey } from "@/src/lib/inventory/addKey";
import { addKeysSchema } from "@/src/schemas/adminProducts";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(
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
      { error: "ID inválido" },
      { status: 400 },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = addKeysSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Chaves inválidas ou duplicadas no formulário",
        details: parsed.error.flatten(),
      },
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
      { error: "Produto não encontrado" },
      { status: 404 },
    );
  }

  let added = 0;

  try {
    for (const key of parsed.data.keys) {
      await addKey({
        productId: id,
        key,
      });

      added++;
    }

    await ProductModel.updateOne(
      { _id: id },
      { $set: { status: "active" } },
    );

    return NextResponse.json({
      success: true,
      added,
      message: `${added} chave(s) adicionada(s) com sucesso`,
    });
  } catch (error) {
    console.error("Error adding product keys:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erro ao adicionar chaves",
        added,
      },
      { status: 409 },
    );
  }
}