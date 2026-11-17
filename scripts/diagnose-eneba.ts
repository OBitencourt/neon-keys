
/* import { enebaQuery } from "../src/lib/suppliers/adapters/eneba/client";

async function main() {
  console.log("GraphQL URL:", process.env.ENEBA_GRAPHQL_URL);
  console.log("Auth URL:", process.env.ENEBA_AUTH_URL);

  // Teste 1: confirmar conexão GraphQL
  try {
    const response = await enebaQuery<{ __typename: string }>(
      `query { __typename }`
    );

    console.log("Conexão GraphQL OK:", response);
  } catch (error) {
    console.error("Erro de conexão:", error);
    return;
  }

  // Teste 2: consultar os campos disponíveis
  try {
    const response = await enebaQuery<{
      __schema: {
        queryType: {
          fields: { name: string }[];
        };
      };
    }>(`
      query InspectSchema {
        __schema {
          queryType {
            fields {
              name
            }
          }
        }
      }
    `);

    const fields = response.__schema.queryType.fields.map(
      (field) => field.name
    );

    console.log("Queries disponíveis:", fields);
    console.log(
      "Wholesale Products disponível:",
      fields.includes("P_wholesaleAuctionProducts")
    );
    console.log(
      "Wholesale Auctions disponível:",
      fields.includes("P_wholesaleAuctions")
    );
  } catch (error) {
    console.error("Erro na introspecção:", error);
  }

  // Teste 3: consultar uma operação wholesale alternativa
  try {
    const response = await enebaQuery<{
      P_wholesaleAuctions: {
        totalCount: number;
      };
    }>(`
      query {
        P_wholesaleAuctions(first: 1) {
          totalCount
        }
      }
    `);

    console.log("Wholesale Auctions:", response);
  } catch (error) {
    console.error("Erro no wholesale:", error);
  }
}

main().catch(console.error);

*/