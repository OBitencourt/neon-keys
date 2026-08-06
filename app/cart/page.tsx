"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import CartItemsList from "../../src/components/cartitemslist";
import { initialCartItems } from "../../src/utils/cartmock";
import type { CartItem } from "../../src/types/cart";

function formatPrice(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

const trustBadges = [
  { icon: "/icon-secure.svg", label: "100% SECURE" },
  { icon: "/icon-instant-delivery.svg", label: "INSTANT DELIVERY" },
  { icon: "/icon-support.svg", label: "24/7 SUPPORT" },
  { icon: "/icon-best-prices.svg", label: "BEST PRICES" },
];

// Troque pelos ícones reais das bandeiras/carteiras
const paymentIcons = [
  "/payment-visa.svg",
  "/payment-mastercard.svg",
  "/payment-paypal.svg",
  "/payment-gpay.svg",
  "/payment-pix.svg",
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

          <Link href="/shop" className="bg-neon-gradient self-start p-0.5 rounded-full">
            <span className="flex items-center gap-2 bg-black text-neon-pink text-sm font-semibold rounded-full px-6 py-2.5 hover:bg-neon-white/5 transition-colors">
              ← CONTINUE SHOPPING
            </span>
          </Link>

          {/* Selo de confiança */}
          <div className="bg-neon-gradient rounded-2xl p-[1.5px]">
            <div className="flex flex-wrap items-center justify-around gap-4 rounded-2xl bg-black px-6 py-4">
              {trustBadges.map((badge) => (
                <div key={badge.label} className="flex items-center gap-2">
                  <Image src={badge.icon} alt={badge.label} width={22} height={22} />
                  <span className="text-neon-white text-sm font-semibold tracking-wide">
                    {badge.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Coluna direita — resumo do pedido */}
        <div className="flex flex-col gap-4">
          <div className="bg-neon-gradient rounded-2xl p-[1.5px]">
            <div className="rounded-2xl bg-black p-6">
              <h2 className="text-neon-white text-sm font-bold tracking-wide mb-5">
                ORDER SUMMARY
              </h2>

              <div className="flex flex-col gap-4 mb-5">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-lg overflow-hidden border border-neon-gray/30 shrink-0 relative flex items-center justify-center text-neon-gray text-[9px]">
                      {product.image ? (
                        <Image src={product.image} alt={product.name} fill className="object-cover" />
                      ) : (
                        "Capa"
                      )}
                    </div>
                    <span className="flex-1 text-neon-white text-sm truncate">{product.name}</span>
                    <span className="text-neon-white text-sm font-semibold whitespace-nowrap">
                      {formatPrice(product.price * quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-neon-white/10 pt-4 flex flex-col gap-2 text-sm">
                <div className="flex justify-between text-neon-white">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-neon-green">
                  <span>Discount</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              </div>

              <div className="border-t border-neon-white/10 mt-4 pt-4 flex items-center justify-between">
                <span className="text-neon-white text-lg font-bold">Total</span>
                <span className="text-neon-green text-2xl font-extrabold">
                  {formatPrice(total)}
                </span>
              </div>

              <button
                type="button"
                className="w-full bg-neon-gradient text-neon-white font-bold text-sm tracking-wide rounded-full py-3.5 mt-6 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                PROCEED TO CHECKOUT →
              </button>
            </div>
          </div>

          {/* Pagamentos aceitos */}
          <div className="bg-neon-gradient rounded-2xl p-[1.5px]">
            <div className="rounded-2xl bg-black py-4 flex flex-col items-center gap-3">
              <p className="text-neon-gray text-xs">We accept secure payments</p>
              <div className="flex items-center gap-4">
                {paymentIcons.map((icon) => (
                  <Image key={icon} src={icon} alt="Payment method" width={32} height={20} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}