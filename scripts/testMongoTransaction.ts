import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

async function main() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI não configurada");
  }

  await mongoose.connect(uri);

  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      const result = await mongoose.connection.db!.admin().command({
        ping: 1,
      });

      console.log("MongoDB conectado:", result.ok);

      // Operação de escrita dentro da transação
      await mongoose.connection
        .collection("transaction_tests")
        .insertOne(
          {
            testedAt: new Date(),
            status: "success",
          },
          { session },
        );
    });

    console.log("✅ Transação concluída com sucesso!");
  } finally {
    await session.endSession();
    await mongoose.disconnect();
  }
}

main().catch((error) => {
  console.error("❌ Erro na transação:", error);
  process.exitCode = 1;
});