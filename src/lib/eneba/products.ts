import "server-only";

import { enebaGraphQL } from "./client";

export interface EnebaProduct {
  id: string;
  name: string;
}

interface SearchProductsResponse {
  S_products: {
    edges: {
      node: EnebaProduct;
    }[];
  };
}

const SEARCH_PRODUCTS = `
  query SearchEnebaProducts($search: String!, $first: Int!) {
    S_products(search: $search, first: $first) {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;

export async function searchEnebaProducts(
  search: string,
): Promise<EnebaProduct[]> {
  const term = search.trim();

  if (term.length < 2 || term.length > 100) {
    throw new Error("Search must contain 2 to 100 characters");
  }

  const result = await enebaGraphQL<SearchProductsResponse>(
    SEARCH_PRODUCTS,
    {
      search: term,
      first: 20,
    },
  );

  return result.S_products.edges.map(
    (edge) => edge.node,
  );
}