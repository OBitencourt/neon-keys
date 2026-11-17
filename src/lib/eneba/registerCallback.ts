import "server-only";

import { enebaGraphQL } from "@/src/lib/eneba/client";

type CallbackType =
  | "DECLARED_STOCK_RESERVATION"
  | "DECLARED_STOCK_PROVISION"
  | "DECLARED_STOCK_CANCELLATION";

const REGISTER_CALLBACK = `
  mutation RegisterCallback($input: P_API_RegisterCallbackInput!) {
    P_registerCallback(input: $input) {
      success
    }
  }
`;

export async function registerEnebaCallback(
  type: CallbackType,
  url: string,
) {
  if (process.env.ENEBA_ENV !== "sandbox") {
    throw new Error("Sandbox only during development");
  }

  const authorization = process.env.ENEBA_CALLBACK_TOKEN;

  if (!authorization) {
    throw new Error("ENEBA_CALLBACK_TOKEN is missing");
  }

  const parsedUrl = new URL(url);

  if (
    parsedUrl.protocol !== "https:" ||
    parsedUrl.search ||
    parsedUrl.hash ||
    !parsedUrl.hostname
  ) {
    throw new Error("Invalid callback URL");
  }

  const response = await enebaGraphQL<{
    P_registerCallback: { success: boolean };
  }>(REGISTER_CALLBACK, {
    input: {
      type,
      url,
      authorization,
    },
  });

  if (!response.P_registerCallback.success) {
    throw new Error(`Failed to register ${type}`);
  }

  return { success: true, type };
}