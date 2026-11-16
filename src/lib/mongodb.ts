import mongoose from "mongoose";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI ?? "mongodb://localhost:27017/neonkeys";

declare global {
  var mongoClient: MongoClient | undefined;
}

export const client = global.mongoClient ?? new MongoClient(uri);

if (process.env.NODE_ENV !== "production") {
  global.mongoClient = client;
}

export const db = client.db();

// Para o Better Auth e queries diretas
export async function getDb() {
  await client.connect();
  return db;
}

// Para os modelos Mongoose: liga o Mongoose a este mesmo cliente
export async function connectDB() {
  await client.connect();

  if (mongoose.connection.readyState === 0) {
    mongoose.connection.setClient(client);
  }

  return db;
}