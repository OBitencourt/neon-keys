"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { MAX_QUANTITY, useCart, useCartStore } from "@/src/context/cartContext";
import { formatPrice } from "@/src/utils/priceFunctions";

export default function MiniCart() {
  const {
    items,
    itemCount,
    subtotal,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
  } = useCart();

  // Carrega o carrinho do localStorage uma vez
  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);

  // Trava o scroll e fecha com Esc enquanto está aberto
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeCart();
    }
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, closeCart]);

  return (
    <div
      className={`fixed inset-0 z-60 ${isOpen ? "" : "pointer-events-none"}`}
      aria-hidden={!isOpen}
    >
      <div
        onClick={closeCart}
        className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
        className={`absolute right-0.5 top-0 h-full w-full max-w-md bg-neon-gradient p-[1.5px] transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col bg-black">
          <div className="flex items-center justify-between border-b border-neon-white/10 px-5 py-4">
            <h2 className="font-gabarito text-xl font-bold text-neon-white">
              YOUR BAG{" "}
              <span className="bg-neon-gradient bg-clip-text text-transparent">
                ({itemCount})
              </span>
            </h2>
            <button
              type="button"
              onClick={closeCart}
              aria-label="Fechar carrinho"
              className="flex h-9 w-9 items-center justify-center rounded-full text-2xl text-neon-white/70 transition-colors hover:bg-neon-white/10 hover:text-neon-white"
            >
              ×
            </button>
          </div>

          {items.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
              <p className="text-lg font-semibold text-neon-white">
                Your bag is empty
              </p>
              <p className="text-sm text-neon-gray">
                Add some games and they will show up here.
              </p>
              <button
                type="button"
                onClick={closeCart}
                className="rounded-lg bg-neon-gradient px-6 py-3 text-sm font-bold text-neon-white transition-opacity hover:opacity-90"
              >
                CONTINUE SHOPPING
              </button>
            </div>
          ) : (
            <>
              <ul className="flex-1 divide-y divide-neon-white/10 overflow-y-auto px-5">
                {items.map(({ product, quantity }) => (
                  <li key={product.id} className="flex gap-4 py-4">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-neon-gray/30 bg-neon-gray/10">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="72px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Image
                            src="/image-placeholder-icon.svg"
                            alt=""
                            width={24}
                            height={24}
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="line-clamp-2 text-sm truncate font-semibold text-neon-white">
                          {product.name}
                        </h3>
                        <button
                          type="button"
                          onClick={() => removeItem(product.id)}
                          aria-label={`Remover ${product.name}`}
                          className="shrink-0 text-xs text-neon-gray transition-colors hover:text-red-400"
                        >
                          Remove
                        </button>
                      </div>

                      <p className="mt-0.5 text-xs uppercase text-neon-gray">
                        {product.platform}
                      </p>

                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="flex items-center rounded-md border border-neon-gray/40">
                          <button
                            type="button"
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            aria-label="Diminuir quantidade"
                            className="px-2.5 py-1 text-neon-white/80 transition-colors hover:bg-neon-white/10"
                          >
                            −
                          </button>
                          <span className="min-w-6 text-center text-sm text-neon-white">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            disabled={quantity >= MAX_QUANTITY}
                            aria-label="Aumentar quantidade"
                            className="px-2.5 py-1 text-neon-white/80 transition-colors hover:bg-neon-white/10 disabled:opacity-30"
                          >
                            +
                          </button>
                        </div>

                        <span className="text-base font-bold text-neon-green">
                          {formatPrice(product.price * quantity)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="border-t border-neon-white/10 px-5 py-5">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm text-neon-gray">Subtotal</span>
                  <span className="text-2xl font-bold text-neon-white">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/cart"
                    onClick={closeCart}
                    className="rounded-lg bg-neon-gradient p-[1.5px]"
                  >
                    <span className="flex w-full items-center justify-center rounded-lg bg-black px-4 py-3 text-sm font-bold text-neon-white transition-colors hover:bg-neon-white/5">
                      VIEW CART
                    </span>
                  </Link>

                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className="flex items-center justify-center rounded-lg bg-neon-gradient px-4 py-3 text-sm font-bold text-neon-white transition-opacity hover:opacity-90"
                  >
                    CHECKOUT
                  </Link>
                </div>

                <button
                  type="button"
                  onClick={closeCart}
                  className="mt-3 w-full text-center text-sm text-neon-pink underline transition-colors hover:text-neon-white"
                >
                  Continue shopping
                </button>
              </div>
            </>
          )}
        </div>
      </aside>
    </div>
  );
}