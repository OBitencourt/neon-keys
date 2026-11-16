let cached: { token: string; expiresAt: number } | null = null;

async function getToken(force = false) {
  if (!force && cached && Date.now() < cached.expiresAt - 60_000) {
    return cached.token;
  }

  const res = await fetch(process.env.ENEBA_AUTH_URL!, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "api_consumer",
      client_id: process.env.ENEBA_CLIENT_ID!,
      id: process.env.ENEBA_AUTH_ID!,
      secret: process.env.ENEBA_AUTH_SECRET!,
    }),
  });
  if (!res.ok) throw new Error(`Eneba auth falhou: ${res.status}`);

  const data = await res.json();
  cached = {
    token: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };
  return cached.token;
}

export async function enebaQuery<T>(
  query: string,
  variables?: Record<string, unknown>,
  retry = true,
): Promise<T> {
  const token = await getToken();

  const res = await fetch(process.env.ENEBA_GRAPHQL_URL!, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });

  // Token inválido: renova uma vez e repete
  if (res.status === 401 && retry) {
    await getToken(true);
    return enebaQuery<T>(query, variables, false);
  }
  if (!res.ok) throw new Error(`Eneba HTTP ${res.status}`);

  const json = await res.json();
  if (json.errors?.length) {
    throw new Error(`Eneba GraphQL: ${json.errors[0].message}`);
  }
  return json.data as T;
}