"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "../types/product";
import { formatPrice, getDiscountPercent } from "../utils/priceFunctions";
import { getProductUrl } from "../utils/slug";

interface ProductCardProps {
  product: Product;
}

const PLATFORM_ICONS: Record<string, string> = {
  Steam: "/icon-steam.svg",
  Xbox: "/icon-xbox.png",
  "Epic Games": "/icon-epic.png",
  PlayStation: "/icon-playstation.png",
  PSN: "/icon-playstation.png",
  Nintendo: "/icon-nintendo.png",
};

export default function ProductCard({ product }: ProductCardProps) {
  const { name, image, price, originalPrice, platform } = product;
  const discount = getDiscountPercent(price, originalPrice);

  const iconSrc = PLATFORM_ICONS[platform] || "/icon-default-platform.png";

  return (
    <Link href={getProductUrl(product)} className="group/card relative block h-full w-full">
      <div className="bg-neon-gradient absolute inset-0 rounded-3xl opacity-30 blur-sm transition duration-500 group-hover/card:opacity-40" />

      {/* Borda em gradiente */}
      <div className="bg-neon-gradient relative h-full w-full rounded-2xl p-0.5">
        <div className="relative flex h-full flex-col items-center  rounded-2xl bg-black">
          {discount !== null && (
            <span className="bg-neon-gradient text-neon-white absolute -top-2 font-gabarito -left-6 z-10 rounded-full px-3 py-1 text-lg tracking-wider font-bold">
              -{discount}%
            </span>
          )}

          <div className="flex h-full w-full flex-col items-center p-6">
            {/* Capa do jogo */}
            <div className="border-neon-gray/40 text-neon-gray aspect-3/4 flex w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-lg border border-dashed">
              {image ? (
                <Image
                  src={image}
                  alt={name}
                  width={400}
                  height={533}
                  className="h-full w-full object-cover"
                />
              ) : (
                <>
                  <Image src="/image-placeholder-icon.svg" alt="Placeholder" width={32} height={32} />
                  <span className="text-xs">Capa do jogo (placeholder)</span>
                </>
              )}
            </div>

            <h3 className="text-neon-white mt-4 min-h-12 text-center text-base font-semibold leading-snug">
              {name}
            </h3>

            <div className="text-white font-semibold font-gabarito mt-2 flex items-center gap-1.5 text-lg">
              <Image src={iconSrc} alt={platform} width={30} height={30} />
              <span className="uppercase tracking-wide">{platform}</span>
            </div>

            <div className="relative mt-3 flex items-center gap-2">
              {originalPrice && (
                <span className="text-neon-gray text-md font-regular line-through">
                  {formatPrice(originalPrice)}
                </span>
              )}
              <div className="relative">
                <span
                  className="absolute inset-0 text-3xl font-bold text-neon-green blur-sm"
                  aria-hidden="true"
                >
                  {formatPrice(price)}
                </span>
                <span className="text-3xl font-bold text-neon-green">{formatPrice(price)}</span>
              </div>
            </div>

            {/* Botão — impede que o clique dispare a navegação do Link */}
            <div className="bg-neon-gradient mt-4 flex w-full items-center justify-center rounded-4xl p-0.5">
              <div className="flex w-full items-center justify-center rounded-4xl bg-black">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // TODO: lógica de adicionar ao carrinho
                  }}
                  className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-full py-3 text-sm font-semibold transition-colors"
                >
                  <span
                    className="bg-neon-gradient absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-30 group-active:opacity-60"
                    aria-hidden="true"
                  />
                  <div className="relative z-10 flex items-center justify-center gap-3">
                    <Image src="/cart-icon.svg" alt="Carrinho" width={20} height={20} />
                    <span className="bg-neon-gradient bg-clip-text text-transparent">
                      ADD TO BAG
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}