"use client";

import { useMemo } from "react";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";

import ProductCard from "../../components/productcard";
import type { Product } from "../../types/product";
import { getDiscountPercent } from "../../utils/priceFunctions";

interface BestDealsProps {
  products: Product[];
  limit?: number;
}

export default function BestDeals({ products, limit = 5 }: BestDealsProps) {
  const [emblaRef] = useEmblaCarousel({
    loop: false,
    align: "center",
  });

  const deals = useMemo(() => {
    // Produtos com desconto, ordenados do maior para o menor
    const discountedProducts = [...products]
      .filter(
        (product) =>
          product.originalPrice != null &&
          product.originalPrice > product.price,
      )
      .sort((a, b) => {
        const discountA = getDiscountPercent(a.price, a.originalPrice) ?? 0;

        const discountB = getDiscountPercent(b.price, b.originalPrice) ?? 0;

        return discountB - discountA;
      });

    // Completar com outros produtos, sem repetir
    const discountedIds = new Set(
      discountedProducts.map((product) => product.id),
    );

    const remainingProducts = products.filter(
      (product) => !discountedIds.has(product.id),
    );

    return [...discountedProducts, ...remainingProducts].slice(
      0,
      Math.max(5, limit),
    );
  }, [products, limit]);

  if (deals.length === 0) return null;

  return (
    <section className="w-full overflow-x-clip bg-black px-4 py-12 sm:px-8 sm:py-16">
      {/* Título da seção */}
      <div className="mb-8 flex items-center justify-center gap-3 sm:mb-10 sm:gap-4">
        <div className="h-px w-8 bg-linear-to-r from-transparent to-neon-pink sm:w-28" />

        <h2 className="font-inder text-3xl font-regular tracking-wide whitespace-nowrap bg-neon-gradient bg-clip-text text-transparent sm:text-5xl">
          NEON DEALS
        </h2>

        <div className="h-px w-8 bg-linear-to-l from-transparent to-neon-orange sm:w-28" />
      </div>

      {/* Mobile - Carrossel Embla */}
      <div className="w-full sm:hidden">
        <div ref={emblaRef} className="w-full overflow-x-clip py-2">
          <div className="flex touch-pan-y gap-1">
            <div className="shrink-0 w-18" />

            {deals.map((deal) => (
              <div key={deal.id} className="min-w-0 flex-[0_0_55%] px-0">
                <ProductCard product={deal} />
              </div>
            ))}

            <div className="shrink-0 w-18" />
          </div>
        </div>
      </div>

      {/* Tablet/Desktop: grid normal */}
      <div className="mx-auto hidden w-full max-w-[1550px] grid-cols-2 justify-items-center gap-6 px-0 sm:grid lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 2xl:px-20">
        {deals.map((deal) => (
          <ProductCard key={deal.id} product={deal} />
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <div className="rounded-full bg-neon-gradient p-[1.5px]">
          <Link
            href="/shop?sort=discount"
            className="block rounded-full bg-black px-6 py-3 text-base font-regular tracking-wide text-neon-white transition-colors hover:bg-neon-white/5 sm:px-8 sm:text-lg"
          >
            VIEW ALL DEALS
          </Link>
        </div>
      </div>
    </section>
  );
}
