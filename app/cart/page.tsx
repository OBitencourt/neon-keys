"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import CartItemsList from "../../src/components/cartitemslist";
import { initialCartItems } from "../../src/mocks/cartmock";
import type { CartItem } from "../../src/types/cart";
import { formatPrice } from "@/src/utils/priceFunctions";
import { useRouter } from "next/navigation";

const trustBadges = [
  { icon: "/why-icon1.png", label: "100% SECURE" },
  { icon: "/why-icon2.png", label: "INSTANT DELIVERY" },
  { icon: "/why-icon3.png", label: "24/7 SUPPORT" },
  { icon: "/why-icon4.png", label: "BEST PRICES" },
];

const paymentIcons = [
  "/visa-checkout.svg",
  "/mastercards-checkout.svg",
  "/paypal-checkout.svg",
  "/googlepay-checkout.svg",
  "/pix-checkout.svg",
];

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>(initialCartItems);

  const router = useRouter();

  function handleQuantityChange(productId: string, quantity: number) {
    setItems((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  }

  function handleRemove(productId: string) {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  }

  const subtotal = items.reduce(
    (sum, { product, quantity }) => sum + (product.originalPrice ?? product.price) * quantity,
    0
  );
  const total = items.reduce((sum, { product, quantity }) => sum + product.price * quantity, 0);
  const discount = subtotal - total;

  return (
    <div className="bg-black min-h-screen px-4 py-6 md:px-8 md:py-10">
      {/* Breadcrumb */}
      <div className="mx-auto mb-4 max-w-7xl text-xs text-neon-white/70 md:text-sm">
        <Link href="/" className="hover:text-neon-white transition-colors">
          Home
        </Link>{" "}
        <span className="mx-1">›</span> <span className="text-neon-pink">Cart</span>
      </div>

      <div className="mx-auto mb-6 flex max-w-7xl items-center gap-2 md:mb-8 md:gap-4">
        <h1 className="text-3xl font-bold text-neon-white md:text-4xl">YOUR CART</h1>
        <div className="bg-neon-gradient rounded-full p-[1.5px]">
          <div className="block rounded-full bg-black px-3 py-1 text-xs font-semibold text-neon-white md:px-4 md:py-1.5 md:text-sm">
            <span className="bg-neon-gradient bg-clip-text text-transparent">
                {items.length} {items.length === 1 ? "ITEM" : "ITEMS"}
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-5 lg:grid-cols-[1fr_380px] lg:gap-8">
        <div className="flex flex-col gap-5 md:gap-6">
          {items.length > 0 ? (
            <CartItemsList
              items={items}
              onQuantityChange={handleQuantityChange}
              onRemove={handleRemove}
            />
          ) : (
            <p className="text-neon-gray">Seu carrinho está vazio.</p>
          )}

          <Link href="/shop" className="self-start rounded-lg bg-neon-gradient p-0.5">
            <span className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-xs font-semibold text-neon-pink transition-colors hover:bg-neon-white/30 md:px-6 md:py-2.5 md:text-sm">
              <Image src="/gradient-arrow-left.svg" alt="Continue Shopping" width={16} height={16} />
              CONTINUE SHOPPING
            </span>
          </Link>

          {/* Selo de confiança */}
          <div className="hidden rounded-2xl bg-neon-gradient p-[1.5px] md:block">
            <div className="flex flex-wrap items-center justify-around gap-3 rounded-2xl bg-black px-3 py-3 md:gap-4 md:px-6 md:py-4">
              {trustBadges.map((badge) => (
                <div key={badge.label} className="flex items-center gap-2 md:gap-3">
                  <Image src={badge.icon} alt={badge.label} width={28} height={28} className="md:h-[35px] md:w-[35px]" />
                  <span className="text-xs font-bold tracking-wide text-neon-white md:text-md">
                    {badge.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="bg-neon-gradient rounded-2xl p-px">
            <div className="rounded-2xl bg-black p-4 md:p-6">
              <h2 className="mb-4 text-xl font-bold tracking-wide text-neon-white md:mb-5 md:text-2xl">
                ORDER SUMMARY
              </h2>

              <div className="mb-4 flex flex-col gap-3 md:mb-5 md:gap-4">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex items-center gap-2 md:gap-3">
                    <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-neon-gray/30 text-[9px] text-neon-gray md:h-20 md:w-20">
                      {product.image ? (
                        <Image src={product.image} alt={product.name} fill className="object-cover" />
                      ) : (
                        "Capa"
                      )}
                    </div>

                    <span className="flex-1 truncate text-sm text-neon-white md:text-md">{product.name}</span>

                    <span className="whitespace-nowrap text-base font-semibold text-neon-white md:text-lg">
                      {formatPrice(product.price * quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-2 border-t border-neon-white/10 pt-3 text-base font-gabarito font-medium md:pt-4 md:text-lg">
                <div className="flex justify-between text-neon-white">
                  <span>Subtotal</span>
                  <span className="font-inter">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-neon-green">
                  <span>Discount</span>
                  <span className="font-inter">-{formatPrice(discount)}</span>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-neon-white/10 pt-3 font-gabarito md:mt-4 md:pt-4">
                <span className="text-xl font-medium text-neon-white md:text-2xl">Total</span>
                <span className="text-xl font-bold text-neon-green font-inter md:text-2xl">
                  {formatPrice(total)}
                </span>
              </div>

              <button
                type="button"
                onClick={() => router.push("/checkout")}
                className="mt-5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-neon-gradient py-3 text-base font-bold tracking-wide text-neon-white transition-opacity hover:opacity-90 md:mt-6 md:py-3.5 md:text-lg"
              >
                PROCEED TO CHECKOUT 
                <Image src="/white-arrow-right.svg" alt="Proceed to Checkout" width={16} height={16} />
              </button>
            </div>
          </div>

          <div className="bg-neon-gradient rounded-2xl p-[1.5px]">
            <div className="flex flex-col items-center gap-2 rounded-2xl bg-black py-3 md:gap-3 md:py-4">
              <p className="text-neon-gray text-xs">We accept secure payments</p>
              <div className="flex items-center gap-2 md:gap-4">
                {paymentIcons.map((icon) => (
                  <Image key={icon} src={icon} alt="Payment method" width={40} height={40} className="md:h-[50px] md:w-[50px]" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
