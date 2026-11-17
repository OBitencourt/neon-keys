import dotenv from "dotenv";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

async function main() {
  const productId = process.env.TEST_PRODUCT_ID;

  if (!productId) {
    throw new Error("TEST_PRODUCT_ID is required");
  }

  // Importações após carregar as variáveis de ambiente
  const { connectDB } = await import("@/src/lib/mongodb");
  const { ProductKeyModel } = await import(
    "@/src/models/productKey"
  );
  const { reserveKeys, deliverKeys, releaseKeys } =
    await import("@/src/lib/inventory/reservations");
  const mongoose = await import("mongoose");

  await connectDB();

  const runId = randomUUID();

  const reference = (name: string) => `${runId}:${name}`;

  async function available() {
    return ProductKeyModel.countDocuments({
      productId,
      status: "available",
    });
  }

  async function expectStock(expected: number) {
    const current = await available();

    assert.equal(
      current,
      expected,
      `Expected ${expected} available keys, found ${current}`,
    );

    console.log(`✓ Available stock: ${current}`);
  }

  try {
    const total = await ProductKeyModel.countDocuments({
      productId,
    });

    const initialAvailable = await available();

    assert.equal(
      total,
      5,
      "Test product must have exactly 5 keys",
    );

    assert.equal(
      initialAvailable,
      5,
      "All 5 test keys must initially be available",
    );

    const expiresAt = () =>
      new Date(Date.now() + 60 * 60 * 1000);

    console.log("\n1. Neon Keys reservation");

    const neon = await reserveKeys({
      productId,
      source: "neonkeys",
      referenceId: reference("neon-order"),
      quantity: 1,
      expiresAt: expiresAt(),
    });

    assert.equal(neon.status, "reserved");
    await expectStock(4);

    console.log("\n2. Eneba reservation");

    const eneba = await reserveKeys({
      productId,
      source: "eneba",
      referenceId: reference("eneba-order"),
      quantity: 1,
      expiresAt: expiresAt(),
    });

    assert.equal(eneba.status, "reserved");
    assert.notEqual(neon.keyIds[0], eneba.keyIds[0]);

    await expectStock(3);

    console.log("\n3. Duplicate reservation");

    const repeated = await reserveKeys({
      productId,
      source: "eneba",
      referenceId: reference("eneba-order"),
      quantity: 1,
      expiresAt: expiresAt(),
    });

    assert.deepEqual(repeated.keyIds, eneba.keyIds);
    await expectStock(3);

    console.log("\n4. Release Neon Keys reservation");

    await releaseKeys({
      source: "neonkeys",
      referenceId: reference("neon-order"),
    });

    await expectStock(4);

    console.log("\n5. Replay released reservation");

    const releasedReplay = await reserveKeys({
      productId,
      source: "neonkeys",
      referenceId: reference("neon-order"),
      quantity: 1,
      expiresAt: expiresAt(),
    });

    assert.equal(releasedReplay.status, "released");
    await expectStock(4);

    console.log("\n6. Deliver Eneba key");

    const delivery = await deliverKeys({
      source: "eneba",
      referenceId: reference("eneba-order"),
    });

    assert.equal(delivery.keys.length, 1);

    const repeatedDelivery = await deliverKeys({
      source: "eneba",
      referenceId: reference("eneba-order"),
    });

    assert.deepEqual(repeatedDelivery.keys, delivery.keys);

    await expectStock(4);

    console.log("\n7. Released delivery must be rejected");

    await assert.rejects(
      releaseKeys({
        source: "eneba",
        referenceId: reference("eneba-order"),
      }),
    );

    console.log("✓ Delivered key cannot be released");

    console.log("\n8. Insufficient stock");

    await assert.rejects(
      reserveKeys({
        productId,
        source: "neonkeys",
        referenceId: reference("too-many"),
        quantity: 5,
        expiresAt: expiresAt(),
      }),
    );

    await expectStock(4);

    console.log("\n9. Reserve three more keys");

    await reserveKeys({
      productId,
      source: "neonkeys",
      referenceId: reference("three-keys"),
      quantity: 3,
      expiresAt: expiresAt(),
    });

    await expectStock(1);

    console.log("\n10. Concurrent reservations");

    const concurrent = await Promise.allSettled([
      reserveKeys({
        productId,
        source: "neonkeys",
        referenceId: reference("concurrent-a"),
        quantity: 1,
        expiresAt: expiresAt(),
      }),
      reserveKeys({
        productId,
        source: "eneba",
        referenceId: reference("concurrent-b"),
        quantity: 1,
        expiresAt: expiresAt(),
      }),
    ]);

    const successful = concurrent.filter(
      (result) => result.status === "fulfilled",
    );

    assert.equal(
      successful.length,
      1,
      "Exactly one concurrent reservation must succeed",
    );

    await expectStock(0);

    console.log("\n✅ ALL INVENTORY TESTS PASSED!");
  } finally {
    await mongoose.disconnect();
  }
}

main().catch((error) => {
  console.error("\n❌ INVENTORY TEST FAILED:", error);
  process.exitCode = 1;
});