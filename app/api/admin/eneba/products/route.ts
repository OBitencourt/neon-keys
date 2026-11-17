import { NextRequest, NextResponse } from "next/server";

import { getAdminAccess } from "@/src/lib/admin/acess";
import { searchEnebaProducts } from "@/src/lib/eneba/products";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const { isAdmin } = await getAdminAccess();

  if (!isAdmin) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 },
    );
  }

  const search =
    request.nextUrl.searchParams.get("search")?.trim() ?? "";

  if (search.length < 2 || search.length > 100) {
    return NextResponse.json(
      {
        error: "Search must contain 2 to 100 characters",
      },
      { status: 400 },
    );
  }

  try {
    const products = await searchEnebaProducts(search);

    return NextResponse.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error(
      "Eneba product search failed",
      error instanceof Error ? error.message : error,
    );

    return NextResponse.json(
      {
        error: "Could not search Eneba products",
      },
      { status: 502 },
    );
  }
}