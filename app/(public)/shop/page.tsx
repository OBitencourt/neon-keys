import { getProducts } from "@/src/lib/services/products";
import ShopClient from "./ShopClient";

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const products = await getProducts();

  return <ShopClient products={products} />;
}