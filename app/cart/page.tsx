"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import CartItemsList from "../../src/components/cartitemslist";
import { initialCartItems } from "../../src/utils/cartmock";
import type { CartItem } from "../../src/types/cart";
import { formatPrice } from "@/src/utils/priceFunctions";

const trustBadges = [
  { icon: "/why-icon1.png", label: "100% SECURE" },
  { icon: "/why-icon2.png", label: "INSTANT DELIVERY" },
  { icon: "/why-icon3.png", label: "24/7 SUPPORT" },
  { icon: "/why-icon4.png", label: "BEST PRICES" },
];

// Troque pelos ícones reais das bandeiras/carteiras
const paymentIcons = [
  "/visa-checkout.svg",
  "/mastercards-checkout.svg",
  "/paypal-checkout.svg",
  "/googlepay-checkout.svg",
  "/pix-checkout.svg",
];

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>(initialCartItems);

  function handleQuantityChange(productId: string, quantity: number) {
    setItems((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  }

  function handleRemove(productId: string) {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  }

  // Subtotal = soma pelo preço "cheio" (originalPrice, quando existir)
  // Total = soma pelo preço final cobrado
  // Discount = a diferença entre os dois
  const subtotal = items.reduce(
    (sum, { product, quantity }) => sum + (product.originalPrice ?? product.price) * quantity,
    0
  );
  const total = items.reduce((sum, { product, quantity }) => sum + product.price * quantity, 0);
  const discount = subtotal - total;

  return (
    <div className="bg-black min-h-screen px-8 py-10">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto text-sm text-neon-white/70 mb-4">
        <Link href="/" className="hover:text-neon-white transition-colors">
          Home
        </Link>{" "}
        <span className="mx-1">›</span> <span className="text-neon-pink">Cart</span>
      </div>

      {/* Cabeçalho */}
      <div className="max-w-7xl mx-auto flex items-center gap-4 mb-8">
        <h1 className="text-4xl font-bold text-neon-white">YOUR CART</h1>
        <div className="bg-neon-gradient rounded-full p-[1.5px]">
          <div className="block bg-black text-neon-white text-sm font-semibold px-4 py-1.5 rounded-full">
            <span className="bg-neon-gradient bg-clip-text text-transparent">
                {items.length} {items.length === 1 ? "ITEM" : "ITEMS"}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
        {/* Coluna esquerda */}
        <div className="flex flex-col gap-6">
          {items.length > 0 ? (
            <CartItemsList
              items={items}
              onQuantityChange={handleQuantityChange}
              onRemove={handleRemove}
            />
          ) : (
            <p className="text-neon-gray">Seu carrinho está vazio.</p>
          )}

          <Link href="/shop" className="bg-neon-gradient self-start p-0.5 rounded-lg">
            <span className="flex items-center gap-2 bg-black text-neon-pink text-sm font-semibold rounded-lg px-6 py-2.5 hover:bg-neon-white/5 transition-colors">
              <Image src="/gradient-arrow-left.svg" alt="Continue Shopping" width={16} height={16} />
              CONTINUE SHOPPING
            </span>
          </Link>

          {/* Selo de confiança */}
          <div className="bg-neon-gradient rounded-2xl p-[1.5px]">
            <div className="flex flex-wrap items-center justify-around gap-4 rounded-2xl bg-black px-6 py-4">
              {trustBadges.map((badge) => (
                <div key={badge.label} className="flex items-center gap-3">
                  <Image src={badge.icon} alt={badge.label} width={35} height={35} />
                  <span className="text-neon-white text-md font-bold tracking-wide">
                    {badge.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Coluna direita — resumo do pedido */}
        <div className="flex flex-col gap-4">
          <div className="bg-neon-gradient rounded-2xl p-px">
            <div className="rounded-2xl bg-black p-6">
              <h2 className="text-neon-white text-2xl font-bold tracking-wide mb-5">
                ORDER SUMMARY
              </h2>

              <div className="flex flex-col gap-4 mb-5">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex items-center gap-3">
                    <div className="w-20 h-20 rounded-lg overflow-hidden border border-neon-gray/30 shrink-0 relative flex items-center justify-center text-neon-gray text-[9px]">
                      {product.image ? (
                        <Image src={product.image} alt={product.name} fill className="object-cover" />
                      ) : (
                        "Capa"
                      )}
                    </div>

                    <span className="flex-1 text-neon-white text-md truncate">{product.name}</span>

                    <span className="text-neon-white text-lg font-semibold whitespace-nowrap">
                      {formatPrice(product.price * quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-neon-white/10 pt-4 flex flex-col gap-2 text-lg font-gabarito font-medium">
                <div className="flex justify-between text-neon-white">
                  <span>Subtotal</span>
                  <span className="font-inter">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-neon-green">
                  <span>Discount</span>
                  <span className="font-inter">-{formatPrice(discount)}</span>
                </div>
              </div>

              <div className="border-t border-neon-white/10 mt-4 pt-4 flex items-center font-gabarito justify-between">
                <span className="text-neon-white text-2xl font-medium">Total</span>
                <span className="text-neon-green text-2xl font-bold font-inter">
                  {formatPrice(total)}
                </span>
              </div>

              <button
                type="button"
                className="w-full bg-neon-gradient cursor-pointer text-neon-white font-bold text-lg tracking-wide rounded-lg py-3.5 mt-6 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                PROCEED TO CHECKOUT 
                <Image src="/white-arrow-right.svg" alt="Proceed to Checkout" width={16} height={16} />
              </button>
            </div>
          </div>

          {/* Pagamentos aceitos */}
          <div className="bg-neon-gradient rounded-2xl p-[1.5px]">
            <div className="rounded-2xl bg-black py-4 flex flex-col items-center gap-3">
              <p className="text-neon-gray text-xs">We accept secure payments</p>
              <div className="flex items-center gap-4">
                {paymentIcons.map((icon) => (
                  <Image key={icon} src={icon} alt="Payment method" width={50} height={50} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}