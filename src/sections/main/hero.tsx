"use client";

import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useRef, useState } from "react";
import { mockProducts } from "../../mocks/mockProducts";
import type { Product } from "../../types/product";
import { formatPrice, getDiscountPercent } from "../../utils/priceFunctions";
import { getProductUrl } from "../../utils/slug";
import {
  PLATFORM_ICONS,
  DEFAULT_PLATFORM_ICON,
} from "../../utils/platformIcons";

const heroProducts: Product[] = [...mockProducts]
  .sort((a, b) => b.rating - a.rating)
  .slice(0, 5);

export default function HeroSection() {
  // useRef para o plugin não ser recriado a cada render
  const autoplay = useRef(
    Autoplay({
      delay: 3500,
      stopOnInteraction: false, // continua depois de arrastar / clicar nas setas
      stopOnMouseEnter: true, // pausa com o rato por cima (desktop)
    })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center" },
    [autoplay.current]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="relative w-full px-2 py-6 sm:px-8 sm:py-10">
      <div className="overflow-x-hidden" ref={emblaRef}>
        <div className="flex">
          {heroProducts.map((product, index) => (
            <div
              key={product.id}
              className="min-w-0 flex-[0_0_88%] px-1.5 sm:flex-[0_0_75%] sm:px-3 lg:flex-[0_0_65%]"
            >
              <HeroSlide product={product} isActive={index === selectedIndex} />
            </div>
          ))}
        </div>
      </div>

      {/* Seta anterior */}
      <div className="bg-neon-gradient absolute left-1 top-1/2 z-10 -translate-y-1/2 rounded-full p-0.5 sm:left-4 lg:left-20">
        <button
          type="button"
          onClick={() => emblaApi?.scrollPrev()}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 text-neon-white transition hover:bg-zinc-800 sm:h-12 sm:w-12 lg:h-14 lg:w-14"
        >
          <Image
            src="/carousel-prev.svg"
            alt="Seta anterior"
            width={20}
            height={20}
            className="h-auto w-3 sm:w-4"
          />
        </button>
      </div>

      {/* Seta seguinte */}
      <div className="bg-neon-gradient absolute right-1 top-1/2 z-10 -translate-y-1/2 rounded-full p-0.5 sm:right-4 lg:right-20">
        <button
          type="button"
          onClick={() => emblaApi?.scrollNext()}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 text-neon-white transition hover:bg-zinc-800 sm:h-12 sm:w-12 lg:h-14 lg:w-14"
        >
          <Image
            src="/carousel-next.svg"
            alt="Seta seguinte"
            width={20}
            height={20}
            className="h-auto w-3 sm:w-4"
          />
        </button>
      </div>
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
    platform,
  } = product;
  const discount = getDiscountPercent(price, originalPrice);
  const iconSrc = PLATFORM_ICONS[platform] || DEFAULT_PLATFORM_ICON;

  return (
    <Link
      href={getProductUrl(product)}
      className={`relative block aspect-[4/5] w-full rounded-2xl transition-all duration-500 sm:aspect-video ${
        isActive ? "scale-100 opacity-100" : "scale-95 opacity-40"
      }`}
    >
      {image ? (
        <Image
          src={image}
          alt={name}
          fill
          className="rounded-2xl object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-2xl bg-neon-gray/10 text-neon-gray">
          Capa do jogo (placeholder)
          {platform}
        </div>
      )}

      <div className="absolute inset-0 rounded-2xl bg-linear-to-t from-black/90 via-black/30 to-black/10" />

      {/* Ícone da plataforma */}
      <div className="absolute left-4 top-11 z-10 flex h-8 w-8 items-center justify-center rounded-full sm:left-8 sm:top-12 sm:h-10 sm:w-10">
        <Image
          src={iconSrc}
          alt={platform}
          width={35}
          height={35}
          className="h-full w-full object-contain"
        />
      </div>

      {discount !== null && (
        <span className="bg-neon-gradient text-neon-white absolute top-2 -left-2 z-10 rounded-lg px-2 py-0.5 font-gabarito text-base font-bold tracking-wider sm:-left-6 sm:px-3 sm:py-1 sm:text-lg">
          -{discount}%
        </span>
      )}

      {/* Avaliações */}
      <div className="absolute right-3 top-3 inline-flex items-center overflow-hidden rounded-lg border border-zinc-500 bg-black/90 font-sans text-neon-white sm:right-4 sm:top-4">
        <div className="flex items-center gap-1.5 px-2 py-1 sm:gap-2 sm:border-r sm:border-zinc-500 sm:px-3 sm:py-1.5">
          <Image
            src="/star-gradient.svg"
            alt="Estrela"
            width={20}
            height={20}
            className="h-4 w-4 sm:h-6 sm:w-6"
          />
          <span className="text-xs font-semibold sm:text-sm">{rating}</span>
        </div>

        <div className="hidden px-3 py-1.5 text-sm font-semibold sm:block">
          {(reviewsCount / 1000).toFixed(1)}K avaliações
        </div>
      </div>

      {/* Conteúdo inferior */}
      <div className="absolute bottom-0 left-0 w-full p-4 sm:p-6 lg:p-10">
        <h2 className="line-clamp-2 font-inder text-xl font-bold text-neon-white sm:text-3xl lg:text-4xl">
          {name}
        </h2>

        <p className="mt-2 line-clamp-2 hidden max-w-md text-sm text-neon-white/80 sm:block">
          {description}
        </p>

        <div className="mt-3 flex items-end justify-between gap-3 sm:mt-2">
          <button
            type="button"
            className="bg-neon-gradient flex items-center gap-3 rounded-md px-4 py-2.5 text-sm font-medium text-neon-white transition-opacity hover:opacity-90 sm:gap-6 sm:px-6 sm:py-3 sm:text-lg"
          >
            <Image
              src="/shopping-cart-white.svg"
              alt="Carrinho de compras"
              width={24}
              height={24}
              className="h-5 w-5 sm:h-6 sm:w-6"
            />
            <span>Comprar Agora</span>
          </button>

          <div className="text-right">
            {originalPrice && (
              <span className="block text-sm text-neon-gray line-through sm:text-lg">
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