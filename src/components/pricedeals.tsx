"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/productcard";
import { mockProducts } from "../mocks/mockProducts";

interface PriceDealsProps {
  maxPrice: number;
  minPrice?: number;
  title?: string;
  limit?: number;
}

// Hook simples: true = mobile (abaixo do breakpoint sm do Tailwind, 640px)
function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 639px)");
    setIsMobile(mql.matches);

    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return isMobile;
}

export default function PriceDeals({
  maxPrice,
  minPrice = 0,
  title,
  limit,
}: PriceDealsProps) {
  const isMobile = useIsMobile();

  const [emblaRef] = useEmblaCarousel({
    loop: false,
    align: "start",
    containScroll: "trimSnaps",
  });

  const deals = useMemo(() => {
    const filtered = mockProducts.filter((p) => {
      const aboveMin = minPrice === 0 ? p.price >= minPrice : p.price > minPrice;
      return aboveMin && p.price <= maxPrice;
    });
    return limit ? filtered.slice(0, limit) : filtered;
  }, [minPrice, maxPrice, limit]);

  const sectionTitle = `ATÉ R$${maxPrice}`;

  if (deals.length === 0) return null;

  return (
    <section className="w-full overflow-x-clip bg-black px-4 py-12 sm:px-8 sm:py-16">
      <div className="mb-8 flex items-center justify-center gap-3 sm:mb-10 sm:gap-4">
        <div className="h-px w-8 bg-linear-to-r from-transparent to-neon-pink sm:w-28" />
        <h2 className="font-gabarito text-3xl font-regular tracking-wide whitespace-nowrap bg-neon-gradient bg-clip-text text-transparent sm:text-5xl">
          {sectionTitle}
        </h2>
        <div className="h-px w-8 bg-linear-to-l from-transparent to-neon-orange sm:w-28" />
      </div>

      {isMobile === true && (
        <div className="w-full">
          <div ref={emblaRef} className="w-full overflow-x-clip py-2">
            <div className="flex touch-pan-y">
              {deals.map((deal) => (
                <div key={deal.id} className="min-w-0 flex-[0_0_75%] px-2">
                  <ProductCard product={deal} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {isMobile === false && (
        <div className="mx-auto flex w-full max-w-[1550px] flex-wrap justify-center gap-6 px-0 2xl:px-20">
          {deals.map((deal) => (
            <div
              key={deal.id}
              className="w-full sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)] xl:w-[calc(20%-19.2px)] max-w-[280px]"
            >
              <ProductCard product={deal} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}