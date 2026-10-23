
import { MongoClient } from "mongodb";

const uri =
  process.env.MONGODB_URI ?? "mongodb://localhost:27017/neonkeys";

declare global {
  var mongoClient: MongoClient | undefined;
}

const client =
  global.mongoClient ?? new MongoClient(uri);

if (process.env.NODE_ENV !== "production") {
  global.mongoClient = client;
}

export const db = client.db();

export async function getDb() {
  await client.connect();
  return db;
}
