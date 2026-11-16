
import { client, connectDB } from "@/src/lib/mongodb";
import { EnebaAdapter } from "@/src/lib/suppliers/adapters/eneba/enebaAdapter";
import { MockAdapter } from "@/src/lib/suppliers/adapters/mock/mockAdapter";
import { syncCatalog } from "@/src/lib/suppliers/sync";

async function main() {
  const supplier = process.argv[2] ?? "mock";
  const maxProducts = Number(process.argv[3] ?? 10);

  if (!Number.isSafeInteger(maxProducts) || maxProducts <= 0) {
    throw new Error("O número de produtos deve ser positivo.");
  }

  if (supplier !== "mock" && supplier !== "eneba") {
    throw new Error(`Fornecedor inválido: ${supplier}`);
  }

  const adapter =
    supplier === "mock"
      ? new MockAdapter()
      : new EnebaAdapter();

  await connectDB();

  console.log(`Sincronizando fornecedor: ${adapter.supplier}`);

  const summary = await syncCatalog(adapter, { maxProducts });

  console.table(summary);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => client.close());
