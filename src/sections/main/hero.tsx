"use client";

import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { mockProducts } from "../../mocks/mockProducts";
import type { Product } from "../../types/product";
import { formatPrice, getDiscountPercent } from "../../utils/priceFunctions";
import { getProductUrl } from "../../utils/slug";

// Seleciona os produtos com melhor avaliação para o hero
const heroProducts: Product[] = [...mockProducts]
  .sort((a, b) => b.rating - a.rating)
  .slice(0, 5);

export default function HeroSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="relative w-full px-4 py-10 sm:px-8">
      <div className="overflow-x-hidden" ref={emblaRef}>
        <div className="flex">
          {heroProducts.map((product, index) => (
            <div
              key={product.id}
              className="min-w-0 flex-[0_0_80%] px-3 sm:flex-[0_0_65%]"
            >
              <HeroSlide product={product} isActive={index === selectedIndex} />
            </div>
          ))}
        </div>
      </div>

      {/* Setas */}
      <button
        type="button"
        onClick={() => emblaApi?.scrollPrev()}
        disabled={!canScrollPrev}
        className="absolute left-2 top-1/2 z-10 flex h-14 w-14  -translate-y-1/2 items-center justify-center rounded-full border-2 border-neon-pink bg-zinc-600 text-neon-white transition hover:bg-zinc-800 disabled:opacity-30 sm:left-20"
      >
        <Image
          src="/carousel-prev.svg"
          alt="Seta anterior"
          width={20}
          height={20}
          className="w-4 h-auto absolute left-4"
        />
      </button>

      <button
        type="button"
        onClick={() => emblaApi?.scrollNext()}
        disabled={!canScrollNext}
        className="absolute right-2 top-1/2 z-10 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border-2 border-neon-orange bg-zinc-600 text-neon-white transition hover:bg-zinc-800 disabled:opacity-30 sm:right-20"
      >
        <Image
          src="/carousel-next.svg"
          alt="Seta seguinte"
          width={20}
          height={20}
          className="w-4 h-auto absolute right-4"
        />
      </button>
    </div>
  );
}

function HeroSlide({
  product,
  isActive,
}: {
  product: Product;
  isActive: boolean;
}) {
  const {
    name,
    image,
    price,
    originalPrice,
    description,
    rating,
    reviewsCount,
  } = product;
  const discount = getDiscountPercent(price, originalPrice);

  return (
    <Link
      href={getProductUrl(product)}
      className={`relative block aspect-video w-full  rounded-2xl transition-all duration-500 ${
        isActive ? "scale-100 opacity-100" : "scale-95 opacity-40"
      }`}
    >
      {image ? (
        <Image src={image} alt={name} fill className="object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-neon-gray/10 text-neon-gray">
          Capa do jogo (placeholder)
        </div>
      )}

      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-black/10" />

      {discount !== null && (
        <span className="bg-neon-gradient text-neon-white absolute top-2 -left-6 z-10 rounded-full px-3 py-1 font-gabarito text-lg font-bold tracking-wider">
          -{discount}%
        </span>
      )}

      <div className="absolute right-4 top-4 inline-flex items-center overflow-hidden rounded-lg border border-zinc-500 bg-black/90 font-sans text-neon-white">
        {/* Bloco da Nota / Estrela */}
        <div className="flex items-center gap-2 border-r border-zinc-500 px-3 py-1.5">
          <Image
            src="/star-gradient.svg"
            alt="Estrela"
            width={20}
            height={20}
            className="h-6 w-6"
          />
          <span className="text-sm font-semibold">{rating}</span>
        </div>

        {/* Bloco do Total de Avaliações */}
        <div className="px-3 py-1.5 text-sm font-semibold">
          {(reviewsCount / 1000).toFixed(1)}K avaliações
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full p-6 sm:p-10">
        <h2 className="font-inder text-3xl font-bold text-neon-white sm:text-4xl">
          {name}
        </h2>

        <p className="mt-2 line-clamp-2 max-w-md text-sm text-neon-white/80 sm:text-sm">
          {description}
        </p>

        <div className="mt-2 flex items-end justify-between">
          <button
            type="button"
            className="bg-neon-gradient flex items-center gap-6 rounded-md px-6 py-3 text-lg font-medium text-neon-white transition-opacity hover:opacity-90"
          >
            <Image
              src="/shopping-cart-white.svg"
              alt="Carrinho de compras"
              width={24}
              height={24}
              className="h-6 w-6"
            />
            <span>Comprar Agora</span>
          </button>

          <div className="text-right">
            {originalPrice && (
              <span className="block text-lg text-neon-gray line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
            <span className="text-2xl font-bold text-neon-green sm:text-4xl">
              {formatPrice(price)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
