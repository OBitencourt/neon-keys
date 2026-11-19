
import { NextRequest, NextResponse } from "next/server";

import { getAdminAccess } from "@/src/lib/admin/acess";
import { searchEnebaCatalog } from "@/src/lib/eneba/searchCatalog";

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
    request.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (search.length < 2 || search.length > 100) {
    return NextResponse.json(
      { error: "Invalid search term" },
      { status: 400 },
    );
  }

  try {
    const products = await searchEnebaCatalog(search);

    return NextResponse.json(
      {
        products,
        count: products.length,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    console.error("Eneba catalog search failed", {
      message:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });

    return NextResponse.json(
      { error: "Failed to search Eneba catalog" },
      { status: 502 },
    );
  }
}
