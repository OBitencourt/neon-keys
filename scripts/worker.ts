import { client, connectDB } from "@/src/lib/mongodb";
import { runWorker } from "@/src/worker/fulfillment";

async function main() {
  await connectDB();

  const controller = new AbortController();
  process.on("SIGINT", () => controller.abort());
  process.on("SIGTERM", () => controller.abort());

  await runWorker(controller.signal);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => client.close());