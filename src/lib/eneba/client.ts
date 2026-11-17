import "server-only";

const ENEBA_CLIENT_ID =
  "917611c2-70a5-11e9-00c4-ee691bb8bfaa";

const BASE_URLS = {
  sandbox: "https://api-sandbox.eneba.com",
  production: "https://api.eneba.com",
} as const;

interface TokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

interface GraphQLError {
  message: string;
  extensions?: {
    code?: string;
  };
}

interface GraphQLResponse<T> {
  data?: T;
  errors?: GraphQLError[];
}

let cachedToken: {
  value: string;
  expiresAt: number;
} | null = null;

let pendingToken: Promise<string> | null = null;

function getConfig() {
  const env = process.env.ENEBA_ENV ?? "sandbox";

  if (env !== "sandbox" && env !== "production") {
    throw new Error("Invalid ENEBA_ENV");
  }

  const authId = process.env.ENEBA_AUTH_ID;
  const authSecret = process.env.ENEBA_AUTH_SECRET;

  if (!authId || !authSecret) {
    throw new Error("Eneba credentials are not configured");
  }

  return {
    baseUrl: BASE_URLS[env],
    authId,
    authSecret,
  };
}

async function requestToken(): Promise<string> {
  const { baseUrl, authId, authSecret } = getConfig();

  const body = new URLSearchParams({
    client_id: ENEBA_CLIENT_ID,
    grant_type: "api_consumer",
    id: authId,
    secret: authSecret,
  });

  const response = await fetch(`${baseUrl}/oauth/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    throw new Error(
      `Eneba authentication failed (HTTP ${response.status})`,
    );
  }

  const data = (await response.json()) as TokenResponse;

  if (!data.access_token || !data.expires_in) {
    throw new Error("Invalid Eneba token response");
  }

  cachedToken = {
    value: data.access_token,
    expiresAt:
      Date.now() +
      Math.max(0, data.expires_in - 60) * 1000,
  };

  return data.access_token;
}

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.value;
  }

  if (!pendingToken) {
    pendingToken = requestToken().finally(() => {
      pendingToken = null;
    });
  }

  return pendingToken;
}

async function executeGraphQL<T>(
  query: string,
  variables: Record<string, unknown>,
  retryAuth: boolean,
): Promise<T> {
  const { baseUrl } = getConfig();
  const token = await getAccessToken();

  const response = await fetch(`${baseUrl}/graphql/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(20000),
  });

  if (response.status === 401 && retryAuth) {
    cachedToken = null;
    return executeGraphQL<T>(query, variables, false);
  }

  if (!response.ok) {
    throw new Error(
      `Eneba GraphQL request failed (HTTP ${response.status})`,
    );
  }

  const result =
    (await response.json()) as GraphQLResponse<T>;

  if (result.errors?.length) {
    throw new Error(
      result.errors.map((error) => error.message).join("; "),
    );
  }

  if (!result.data) {
    throw new Error("Eneba returned an empty response");
  }

  return result.data;
}

export async function enebaGraphQL<T>(
  query: string,
  variables: Record<string, unknown> = {},
): Promise<T> {
  return executeGraphQL<T>(query, variables, true);
}