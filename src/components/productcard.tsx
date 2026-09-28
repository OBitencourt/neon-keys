"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "../types/product";
import { formatPrice, getDiscountPercent } from "../utils/priceFunctions";
import { getProductUrl } from "../utils/slug";
import { PLATFORM_ICONS, DEFAULT_PLATFORM_ICON } from "../utils/platformIcons";

interface ProductCardProps {
  product: Product;
}



export default function ProductCard({ product }: ProductCardProps) {
  const { name, image, price, originalPrice, platform, genre } = product;
  const discount = getDiscountPercent(price, originalPrice);
  const iconSrc = PLATFORM_ICONS[platform] || DEFAULT_PLATFORM_ICON;

  return (
    <Link
      href={getProductUrl(product)}
      className="group/card relative block h-[500px] w-full max-w-[250px] mx-auto"
    >
      <div className="bg-neon-gradient absolute inset-0 rounded-3xl opacity-30 blur-sm transition duration-500 group-hover/card:opacity-40" />

      <div className="bg-neon-gradient relative h-full w-full rounded-3xl p-px">
        <div className="relative flex h-full flex-col rounded-3xl bg-black">
          {discount !== null && (
            <span className="bg-neon-gradient text-neon-white absolute -top-6 -left-8 z-10 rounded-full px-3 py-1 font-gabarito text-lg font-bold tracking-wider">
              -{discount}%
            </span>
          )}

          <div className="flex h-full w-full flex-col">
            <div
              className={`relative h-[300px] w-full shrink-0 overflow-hidden rounded-t-3xl ${
                !image ? "border border-dashed border-neon-gray/40" : ""
              }`}
            >
              {image ? (
                <Image
                  src={image}
                  alt={name}
                  width={300}
                  height={250}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-neon-gray">
                  <Image src="/image-placeholder-icon.svg" alt="Placeholder" width={32} height={32} />
                  <span className="text-xs">Capa do jogo (placeholder)</span>
                </div>
              )}

              <div className="absolute bottom-2.5 right-2.5 flex h-9 w-9 items-center justify-center rounded-full border-2 border-black bg-black">
                <Image src={iconSrc} alt={platform} width={22} height={22} />
              </div>
            </div>

            {/* Todo o resto mantido exatamente igual ao seu código enviado */}
            <div className="flex flex-1 flex-col px-3.5 pt-3 pb-3 min-h-0">
              <h3 className="text-neon-white text-left font-gabarito text-lg font-medium leading-snug line-clamp-2">
                {name}
              </h3>

              <div className="mt-1.5 flex flex-wrap gap-2">
                <span className="rounded-md bg-neon-gray/15 border border-neon-gray/15 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-white">
                  {genre}
                </span>
              </div>

              <div className="mt-auto pt-2">
                <div className="relative flex items-center gap-2">
                  {originalPrice && (
                    <span className="text-neon-gray text-lg font-regular line-through">
                      {formatPrice(originalPrice)}
                    </span>
                  )}
                  <div className="relative">
                    <span
                      className="absolute inset-0 text-2xl font-bold text-neon-green blur-sm"
                      aria-hidden="true"
                    >
                      {formatPrice(price)}
                    </span>
                    <span className="text-2xl font-bold text-neon-green">{formatPrice(price)}</span>
                  </div>
                </div>

                <div className="bg-neon-gradient mt-2.5 flex w-full items-center justify-center rounded-4xl p-0.5">
                  <div className="flex w-full items-center justify-center rounded-4xl bg-black">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // TODO: lógica de adicionar ao carrinho
                      }}
                      className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full py-2 text-xs font-semibold text-neon-white transition-colors"
                    >
                      <span
                        className="bg-neon-gradient absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-30 group-active:opacity-60"
                        aria-hidden="true"
                      />
                      <div className="relative z-10 flex items-center justify-center gap-2">
                        <Image src="/cart-icon.svg" alt="Carrinho" width={22} height={22} />
                        <span className="text-md">ADD TO BAG</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}