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
  const { name, image, price, originalPrice, platform, genre } = product;
  const discount = getDiscountPercent(price, originalPrice);

  const iconSrc = PLATFORM_ICONS[platform] || "/icon-default-platform.png";

  return (
    <Link href={getProductUrl(product)} className="group/card relative block h-full w-full">
      <div className="bg-neon-gradient absolute inset-0 rounded-3xl opacity-30 blur-sm transition duration-500 group-hover/card:opacity-40" />

      {/* Borda em gradiente */}
      <div className="bg-neon-gradient relative h-full w-full rounded-3xl p-0.5">
        <div className="relative flex h-full flex-col rounded-3xl bg-black">
          {discount !== null && (
            <span className="bg-neon-gradient text-neon-white absolute -top-2 -left-6 z-10 rounded-full px-3 py-1 font-gabarito text-lg font-bold tracking-wider">
              -{discount}%
            </span>
          )}

          <div className="flex h-full w-full flex-col">
            {/* Capa do jogo */}
            <div
              className={`relative aspect-3/4 w-full overflow-hidden rounded-t-2xl ${
                !image ? "border border-dashed border-neon-gray/40" : ""
              }`}
            >
              {image ? (
                <Image
                  src={image}
                  alt={name}
                  width={400}
                  height={533}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-neon-gray">
                  <Image src="/image-placeholder-icon.svg" alt="Placeholder" width={32} height={32} />
                  <span className="text-xs">Capa do jogo (placeholder)</span>
                </div>
              )}

              {/* Ícone da plataforma sobreposto */}
              <div className="absolute -bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full border-4 border-black bg-white">
                <Image src={iconSrc} alt={platform} width={20} height={20} />
              </div>
            </div>

            <div className="flex flex-1 flex-col px-4 pt-4">
              <h3 className="text-neon-white text-left font-gabarito text-2xl font-regular leading-snug">
                {name}
              </h3>

              {/* Tags — atualmente só temos um único genre no Product;
                  se quiser múltiplas tags como no design (AÇÃO, AVENTURA, MULTIPLAYER...),
                  o tipo Product precisaria de um campo tags?: string[] */}
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="rounded-md bg-neon-gray/15 px-2.5 py-1 text-xs font-medium uppercase tracking-wide text-neon-gray">
                  {genre}
                </span>
              </div>

              {/* Preço + botão ficam colados um no outro, e esse bloco inteiro
                  é empurrado para o fundo do card via mt-auto */}
              <div className="mt-auto">

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
                <div className="bg-neon-gradient mt-4 mb-4 flex w-full items-center justify-center rounded-4xl p-0.5">
                  <div className="flex w-full items-center justify-center rounded-4xl bg-black">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // TODO: lógica de adicionar ao carrinho
                      }}
                      className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-full py-3 text-sm font-semibold text-neon-white transition-colors"
                    >
                      <span
                        className="bg-neon-gradient absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-30 group-active:opacity-60"
                        aria-hidden="true"
                      />
                      <div className="relative z-10 flex items-center justify-center gap-3">
                        <Image src="/cart-icon.svg" alt="Carrinho" width={20} height={20} />
                        <span>ADD TO BAG</span>
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