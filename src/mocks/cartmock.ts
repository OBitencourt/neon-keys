import type { CartItem } from "../types/cart";
import { getProductById } from "./mockProducts";

export const initialCartItems: CartItem[] = [
  { product: getProductById("1")!, quantity: 1 },
  { product: getProductById("3")!, quantity: 1 }, 
];