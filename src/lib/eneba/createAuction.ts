
import "server-only";

import { enebaGraphQL } from "@/src/lib/eneba/client";

const CREATE_AUCTION = `
  mutation CreateAuction($input: S_API_CreateAuctionInput!) {
    S_createAuction(input: $input) {
      success
      actionId
      auctionId
      price {
        amount
        currency
      }
    }
  }
`;

type CreateAuctionResponse = {
  S_createAuction: {
    success: boolean;
    actionId: string | null;
    auctionId: string | null;
    price: {
      amount: number;
      currency: string;
    } | null;
  };
};

type CreateAuctionInput = {
  enebaProductId: string;
  price: number; // Preço em euros
  stock: number;
};

export async function createEnebaAuction({
  enebaProductId,
  price,
  stock,
}: CreateAuctionInput) {
  if (process.env.ENEBA_ENV !== "sandbox") {
    throw new Error("Eneba sandbox only");
  }

  if (
    !Number.isFinite(price) ||
    price <= 0 ||
    !Number.isSafeInteger(stock) ||
    stock <= 0
  ) {
    throw new Error("Invalid price or stock");
  }

  const priceInCents = Math.round(price * 100);

  const response = await enebaGraphQL<CreateAuctionResponse>(
    CREATE_AUCTION,
    {
      input: {
        productId: enebaProductId,
        enabled: false,
        declaredStock: stock,
        price: {
          amount: priceInCents,
          currency: "EUR",
        },
      },
    },
  );

  const result = response.S_createAuction;

  if (!result?.success || !result.auctionId) {
    throw new Error("Eneba auction creation failed");
  }

  return result;
}
