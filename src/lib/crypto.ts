import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

function getKey() {
  const key = Buffer.from(process.env.KEYS_ENCRYPTION_SECRET ?? "", "base64");
  if (key.length !== 32) {
    throw new Error("KEYS_ENCRYPTION_SECRET tem de ter 32 bytes em base64.");
  }
  return key;
}

// Formato: iv.tag.dados (tudo em base64)
export function encryptKey(plain: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", getKey(), iv);
  const data = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  return [iv, cipher.getAuthTag(), data].map((b) => b.toString("base64")).join(".");
}

export function decryptKey(payload: string): string {
  const [iv, tag, data] = payload.split(".").map((p) => Buffer.from(p, "base64"));
  const decipher = createDecipheriv("aes-256-gcm", getKey(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(data), decipher.final()]).toString("utf8");
}