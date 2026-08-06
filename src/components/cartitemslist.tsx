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
            <div className="relative flex items-start gap-4 rounded-2xl bg-black p-4">
              {/* Badge de desconto */}
              {discount !== null && (
                <span className="bg-neon-gradient text-neon-white absolute -top-2 font-gabarito -left-6 z-10 rounded-full px-3 py-1 text-lg tracking-wider font-bold">
                  -{discount}%
                </span>
              )}

              {/* Capa */}
              <div className="w-45 h-45 rounded-lg overflow-hidden border border-neon-gray/30 shrink-0 flex items-center justify-center text-neon-gray relative">
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
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-neon-white text-2xl font-semibold font-gabarito truncate max-w-90">
                      {product.name}
                    </h3>
                    <p className="text-[#989393] font-bold font-inter flex flex-col text-xl">
                      {product.platform} Key {product.region ?? ""}
                    </p>
                  </div>

                  <div className="flex items-center gap-6">
                    <span className="text-neon-green text-xl font-bold">
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
                        width={50}
                        height={20}
                        className="w-6"
                        />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col  gap-3 mt-3 text-[#989393] tracking-wider text-sm">
                  <span className="flex items-center gap-1.5">
                    Platform
                    <Image
                      src={platformIconPath(product.platform)}
                      alt={product.platform}
                      width={25}
                      height={25}
                    />
                    <span className="uppercase font-semibold font-gabarito">{product.platform}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    Region
                    <Image
                      src="/gray-globe.svg"
                      alt="Região"
                      width={25}
                      height={25}
                    />
                    <span className="uppercase font-semibold font-gabarito">{product.region ?? "—"}</span>
                  </span>
                </div>

                <div className="flex justify-end mt-3">
                  

                  <div className="flex bg-neon-gradient p-0.5 items-center rounded-lg overflow-hidden">
                    <div className="bg-zinc-950 rounded-md">
                      <button
                        aria-label="Diminuir quantidade"
                        className="px-3 py-1.5 rounded-tl-sm rounded-bl-sm border-transparent border-r hover:border-zinc-600 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                        onClick={() =>
                          onQuantityChange(
                            product.id,
                            Math.max(1, quantity - 1),
                          )
                        }
                      >
                        -
                      </button>
                      <span className="px-4 py-1.5 text-white font-semibold text-sm">
                        {quantity}
                      </span>
                      <button
                        aria-label="Aumentar quantidade"
                        className="px-3 py-1.5 rounded-tr-sm rounded-br-sm border-transparent border-l hover:border-zinc-600 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
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
