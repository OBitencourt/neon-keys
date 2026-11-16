import { TextWriter, Uint8ArrayReader, ZipReader } from "@zip.js/zip.js";

// Descarrega o ZIP do export e devolve as keys em texto.
// O ZIP está cifrado com o email da conta Eneba que fez a compra.
export async function extractKeysFromZipUrl(
  url: string,
  password: string,
): Promise<string[]> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download do export falhou: ${res.status}`);

  const bytes = new Uint8Array(await res.arrayBuffer());
  const reader = new ZipReader(new Uint8ArrayReader(bytes), { password });
  const keys: string[] = [];

  try {
    for (const entry of await reader.getEntries()) {
      if (entry.directory) continue;

      const name = entry.filename.toLowerCase();

      if (/\.(png|jpe?g)$/.test(name)) {
        throw new Error("Keys em imagem ainda não são suportadas.");
      }
      if (!name.endsWith(".txt")) continue;

      const text = await entry.getData(new TextWriter());

      if (name.endsWith("keys.txt")) {
        // uma key por linha
        keys.push(...text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean));
      } else {
        // {keyId}.txt: imagem que não descodificou, o conteúdo é a key
        keys.push(text.trim());
      }
    }
  } finally {
    await reader.close();
  }

  return keys;
}