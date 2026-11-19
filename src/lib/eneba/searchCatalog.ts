
import "server-only";

import { enebaGraphQL } from "@/src/lib/eneba/client";

export type EnebaCatalogProduct = {
  id: string;
  name: string;
  slug: string;
  drm: {
    slug: string;
  } | null;
  regions: {
    code: string;
  }[];
  type: {
    value: string;
  } | null;
};

type SearchResponse = {
  S_products: {
    edges: {
      node: EnebaCatalogProduct;
    }[];
  };
};

const SEARCH_PRODUCTS = `
  query SearchProducts($search: String!, $first: Int!) {
  S_products(search: $search, first: $first) {
    edges {
      node {
        id
        name
        slug
        drm {
          slug
        }
        regions {
          code
        }
        type {
          value
        }
      }
    }
  }
}
`;

export async function searchEnebaCatalog(
  name: string,
): Promise<EnebaCatalogProduct[]> {
  const search = name.trim();

  if (search.length < 2 || search.length > 100) {
    return [];
  }

  const response = await enebaGraphQL<SearchResponse>(
    SEARCH_PRODUCTS,
    {
      search,
      first: 20,
    },
  );

  return response.S_products.edges
    .map((edge) => edge.node)
}
