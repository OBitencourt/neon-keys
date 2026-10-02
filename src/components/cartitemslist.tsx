"use client";

import Image from "next/image";
import type { CartItem } from "../types/cart";
import { formatPrice, getDiscountPercent } from "../utils/priceFunctions";

interface CartItemsListProps {
  items: CartItem[];
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

function platformIconPath(platform: string) {
  return `/icon-${platform.toLowerCase().replace(/\s+/g, "-")}.svg`;
}

export default function CartItemsList({
  items,
  onQuantityChange,
  onRemove,
}: CartItemsListProps) {
  return (
    <div className="flex flex-col gap-4">
      {items.map(({ product, quantity }) => {
        const discount = getDiscountPercent(
          product.price,
          product.originalPrice,
        );

        return (
          <div
            key={product.id}
            className="bg-neon-gradient rounded-2xl p-[1.5px]"
          >
            <div className="relative flex items-start gap-3 rounded-2xl bg-black p-3 md:gap-4 md:p-4">
              {/* Badge de desconto */}
              {discount !== null && (
                <span className="bg-neon-gradient text-neon-white absolute -top-2 -left-3 z-10 rounded-full px-2 py-0.5 font-gabarito text-sm font-bold tracking-wider md:-left-6 md:px-3 md:py-1 md:text-lg">
                  -{discount}%
                </span>
              )}

              {/* Capa */}
              <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-neon-gray/30 text-neon-gray md:h-45 md:w-45">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span className="text-[10px] text-center px-1">Capa</span>
                )}
              </div>

              {/* Infos */}
              <div className="flex-1 min-w-0">
                <div className="flex min-w-0 flex-col gap-2 md:flex-row md:items-start md:justify-between md:gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="line-clamp-2 max-w-full text-base font-semibold leading-tight font-gabarito text-neon-white md:max-w-90 md:text-2xl">
                      {product.name}
                    </h3>
                    <p className="flex flex-col text-sm font-bold font-inter text-[#989393] md:text-xl">
                      {product.platform} Key {product.region ?? ""}
                    </p>
                  </div>

                  <div className="mt-2 flex w-full items-center justify-between gap-2 md:mt-0 md:w-auto md:gap-6">
                    <span className="whitespace-nowrap text-base font-bold text-neon-green md:text-xl">
                        {formatPrice(product.price)}
                    </span>

                    <button
                        type="button"
                        onClick={() => onRemove(product.id)}
                        aria-label="Remover item"
                        className="shrink-0 bg-zinc-900 p-1.5 rounded-md hover:bg-zinc-800 transition-colors"
                    >
                        <Image
                        src="/gradient-trash.svg"
                        alt="Remover"
                        width={24}
                        height={24}
                        className="h-5 w-5 md:h-6 md:w-6"
                        />
                    </button>
                  </div>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs tracking-wider text-[#989393] md:mt-3 md:flex-col md:items-start md:gap-3 md:text-sm">
                  <span className="flex items-center gap-1.5">
                    Platform
                    <Image
                      src={platformIconPath(product.platform)}
                      alt={product.platform}
                      width={18}
                      height={18}
                      className="md:h-[25px] md:w-[25px]"
                    />
                    <span className="uppercase font-semibold font-gabarito">{product.platform}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    Region
                    <Image
                      src="/gray-globe.svg"
                      alt="Região"
                      width={18}
                      height={18}
                      className="md:h-[25px] md:w-[25px]"
                    />
                    <span className="uppercase font-semibold font-gabarito">{product.region ?? "—"}</span>
                  </span>
                </div>

                <div className="mt-3 flex justify-end md:mt-3">
                  

                  <div className="flex bg-neon-gradient p-0.5 items-center rounded-lg overflow-hidden">
                    <div className="bg-zinc-950 rounded-md">
                      <button
                        aria-label="Diminuir quantidade"
                        className="rounded-tl-sm rounded-bl-sm border-transparent border-r px-2 py-1 text-zinc-400 transition-colors hover:border-zinc-600 hover:bg-zinc-800 hover:text-white md:px-3 md:py-1.5"
                        onClick={() =>
                          onQuantityChange(
                            product.id,
                            Math.max(1, quantity - 1),
                          )
                        }
                      >
                        -
                      </button>
                      <span className="px-3 py-1 text-sm font-semibold text-white md:px-4 md:py-1.5">
                        {quantity}
                      </span>
                      <button
                        aria-label="Aumentar quantidade"
                        className="rounded-tr-sm rounded-br-sm border-transparent border-l px-2 py-1 text-zinc-400 transition-colors hover:border-zinc-600 hover:bg-zinc-800 hover:text-white md:px-3 md:py-1.5"
                        onClick={() =>
                          onQuantityChange(product.id, quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
