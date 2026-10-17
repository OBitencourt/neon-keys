"use client";

import Image from "next/image";
import { useCart } from "@/src/context/cartContext";
import type { Product } from "@/src/types/product";

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <button
      type="button"
      onClick={() => addItem(product)}
      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-neon-gradient py-3 text-base font-medium text-white transition-all hover:brightness-110 sm:py-3.5 sm:text-lg"
    >
      <Image
        src="/shopping-cart-white.svg"
        alt=""
        width={20}
        height={20}
        className="sm:h-6 sm:w-6"
      />
      <span>Add to Cart</span>
    </button>
  );
}