import slugify from "slugify";
import type { Product } from "../types/product";

/*
  Gera uma slug amigável a partir do nome do jogo.
  Ex: "Ori and the Blind Forest (Definitive Edition)" -> "ori-and-the-blind-forest-definitive-edition"
*/
export function getProductSlug(name: string): string {
  return slugify(name, { lower: true, strict: true, trim: true });
}

/*
  Monta a URL da página do produto: /product/nome-do-jogo/id-do-jogo
*/
export function getProductUrl(product: Pick<Product, "id" | "name">): string {
  return `/product/${getProductSlug(product.name)}/${product.id}`;
}