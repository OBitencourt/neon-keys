import { NextResponse } from "next/server";

import { getAdminAccess } from "@/src/lib/admin/acess";
import { enebaGraphQL } from "@/src/lib/eneba/client";

export const runtime = "nodejs";

type ProductConnection = {
  totalCount: number;
  edges: {
    node: {
      id: string;
      name: string;
    };
  }[];
};

type DiagnosticResponse = {
  all: ProductConnection;
  elden: ProductConnection;
  steam: ProductConnection;
};

const DIAGNOSTIC_QUERY = `
  query DiagnoseEnebaCatalog {
    all: S_products(first: 5) {
      totalCount
      edges {
        node {
          id
          name
        }
      }
    }

    elden: S_products(first: 5, search: "elden ring") {
      totalCount
      edges {
        node {
          id
          name
        }
      }
    }

    steam: S_products(first: 5, search: "steam") {
      totalCount
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;

export async function GET() {
  const { isAdmin } = await getAdminAccess();

  if (!isAdmin) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 },
    );
  }

  try {
    const result = await enebaGraphQL<DiagnosticResponse>(
      DIAGNOSTIC_QUERY,
    );

    return NextResponse.json({
      success: true,
      environment: process.env.ENEBA_ENV ?? "sandbox",

      catalog: {
        total: result.all.totalCount,
        sample: result.all.edges.map(({ node }) => node),
      },

      searches: {
        eldenRing: {
          total: result.elden.totalCount,
          products: result.elden.edges.map(({ node }) => node),
        },

        steam: {
          total: result.steam.totalCount,
          products: result.steam.edges.map(({ node }) => node),
        },
      },
    });
  } catch (error) {
    console.error("Eneba diagnostic failed:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unexpected error",
      },
      { status: 502 },
    );
  }
}