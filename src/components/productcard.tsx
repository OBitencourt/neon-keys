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
      className="group/card relative mx-auto block h-[360px] w-full max-w-[180px] md:h-125 md:max-w-62.5"
    >
      <div className="bg-neon-gradient absolute inset-0 rounded-3xl opacity-30 blur-sm transition duration-500 group-hover/card:opacity-40" />

      <div className="bg-neon-gradient relative h-full w-full rounded-3xl p-px">
        <div className="relative flex h-full flex-col rounded-3xl bg-black">
          {discount !== null && (
            <span className="bg-neon-gradient text-neon-white absolute -top-3 -left-3 z-10 rounded-full px-2 py-0.5 font-gabarito text-sm font-bold tracking-wider md:-top-6 md:-left-8 md:px-3 md:py-1 md:text-lg">
              -{discount}%
            </span>
          )}

          <div className="flex h-full w-full flex-col">
            <div
                className={`relative h-[200px] w-full shrink-0 overflow-hidden rounded-t-3xl md:h-[300px] ${
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

              <div className="absolute bottom-1.5 right-1.5 flex h-7 w-7 items-center justify-center rounded-full border-2 border-black bg-black md:bottom-2.5 md:right-2.5 md:h-9 md:w-9">
                <Image src={iconSrc} alt={platform} width={22} height={22} />
              </div>
            </div>

            {/* Todo o resto mantido exatamente igual ao seu código enviado */}
            <div className="flex min-h-0 flex-1 flex-col px-2 pt-2 pb-2 md:px-3.5 md:pt-3 md:pb-3">
              <h3 className="text-neon-white line-clamp-2 text-left font-gabarito text-sm font-medium leading-snug md:text-lg">
                {name}
              </h3>

              <div className="mt-1 flex flex-wrap gap-1 md:mt-1.5 md:gap-2">
                <span className="rounded-md border border-neon-gray/15 bg-neon-gray/15 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wide text-white md:px-2.5 md:text-[11px]">
                  {genre}
                </span>
              </div>

              <div className="mt-auto pt-1.5 md:pt-2">
                <div className="relative flex items-center gap-1 md:gap-2">
                  {originalPrice && (
                    <span className="text-neon-gray text-xs font-regular line-through md:text-lg">
                      {formatPrice(originalPrice)}
                    </span>
                  )}
                  <div className="relative">
                    <span
                      className="absolute inset-0 text-lg font-bold text-neon-green blur-sm md:text-2xl"
                      aria-hidden="true"
                    >
                      {formatPrice(price)}
                    </span>
                    <span className="text-lg font-bold text-neon-green md:text-2xl">{formatPrice(price)}</span>
                  </div>
                </div>

                <div className="bg-neon-gradient mt-2 flex w-full items-center justify-center rounded-4xl p-0.5 md:mt-2.5">
                  <div className="flex w-full items-center justify-center rounded-4xl bg-black">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // TODO: lógica de adicionar ao carrinho
                      }}
                      className="group relative flex w-full items-center justify-center gap-1 overflow-hidden rounded-full py-1.5 text-[10px] font-semibold text-neon-white transition-colors md:gap-2 md:py-2 md:text-xs"
                    >
                      <span
                        className="bg-neon-gradient absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-30 group-active:opacity-60"
                        aria-hidden="true"
                      />
                      <div className="relative z-10 flex items-center justify-center gap-1 md:gap-2">
                        <Image src="/cart-icon.svg" alt="Carrinho" width={18} height={18} className="md:h-[22px] md:w-[22px]" />
                        <span className="text-xs md:text-md">ADD TO BAG</span>
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
