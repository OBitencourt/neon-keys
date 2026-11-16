import "server-only";

import {
  createCipheriv,
  createDecipheriv,
  createHmac,
  randomBytes,
} from "node:crypto";

function getSecret(name: string): Buffer {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  const secret = Buffer.from(value, "base64");

  if (secret.length !== 32) {
    throw new Error(`${name} must contain 32 bytes`);
  }

  return secret;
}

export function encryptKey(value: string): string {
  const secret = getSecret("KEYS_ENCRYPTION_SECRET");

  const iv = randomBytes(12);

  const cipher = createCipheriv(
    "aes-256-gcm",
    secret,
    iv,
  );

  const encrypted = Buffer.concat([
    cipher.update(value, "utf8"),
    cipher.final(),
  ]);

  const tag = cipher.getAuthTag();

  return [
    "v1",
    iv.toString("base64"),
    tag.toString("base64"),
    encrypted.toString("base64"),
  ].join(":");
}

export function decryptKey(value: string): string {
  const [version, iv, tag, encrypted] = value.split(":");

  if (
    version !== "v1" ||
    !iv ||
    !tag ||
    !encrypted
  ) {
    throw new Error("Invalid encrypted key format");
  }

  const secret = getSecret("KEYS_ENCRYPTION_SECRET");

  const decipher = createDecipheriv(
    "aes-256-gcm",
    secret,
    Buffer.from(iv, "base64"),
  );

  decipher.setAuthTag(Buffer.from(tag, "base64"));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encrypted, "base64")),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}

export function getKeyFingerprint(value: string): string {
  const secret = getSecret("KEYS_FINGERPRINT_SECRET");

  return createHmac("sha256", secret)
    .update(value)
    .digest("hex");
}