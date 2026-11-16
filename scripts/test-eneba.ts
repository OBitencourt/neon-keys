import { EnebaAdapter } from "@/src/lib/suppliers/adapters/eneba/enebaAdapter";

async function main() {
  const eneba = new EnebaAdapter();
  const { items, nextCursor } = await eneba.listProducts({ limit: 3 });

  console.dir(items, { depth: 4 });
  console.log("nextCursor:", nextCursor);
}

main().catch(console.error);