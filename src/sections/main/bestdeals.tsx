"use client";

import useEmblaCarousel from "embla-carousel-react";
import ProductCard from "../../components/productcard";
import type { Product } from "../../types/product";

const deals: Product[] = [
  {
    id: "capote-steam-latam",
    name: "Capote Steam(PC) Key LATAM",
    image: "",
    platform: "Steam",
    price: 8.99,
    originalPrice: 11.99,
    genre: "Adventure",
    region: "LATAM",
    rating: 4.3,
    reviewsCount: 128,
    description:
      "Capote is an adventure game with a unique art style and an engaging story.",
    type: "Key",
    delivery: "Instant delivery",
    allowedCountries: ["Brazil", "Argentina", "Chile", "Mexico"],
  },
  {
    id: "human-fall-flat-steam-latam",
    name: "Human: Fall Flat Steam Key LATAM",
    image: "",
    platform: "Steam",
    price: 10.99,
    originalPrice: 17.99,
    genre: "Adventure",
    region: "LATAM",
    rating: 4.7,
    reviewsCount: 5420,
    description:
      "A hilarious physics-based puzzle platformer set in floating dreamscapes.",
    type: "Key",
    delivery: "Instant delivery",
    allowedCountries: ["Brazil", "Argentina", "Chile", "Mexico"],
  },
  {
    id: "ori-blind-forest-global",
    name: "Ori and the Blind Forest (Definitive Edition) Steam (PC) Key GLOBAL",
    image: "",
    platform: "Steam",
    price: 22.99,
    originalPrice: 39.9,
    genre: "Adventure",
    region: "GLOBAL",
    rating: 4.9,
    reviewsCount: 8931,
    description:
      "A visually stunning platformer following Ori's emotional journey through a vibrant forest.",
    type: "Key",
    delivery: "Instant delivery",
    allowedCountries: ["Worldwide"],
  },
  {
    id: "humanitz-steam-latam",
    name: "HumanitZ Steam Key LATAM",
    image: "",
    platform: "Steam",
    price: 10.99,
    originalPrice: 17.99,
    genre: "Simulation",
    region: "LATAM",
    rating: 4.1,
    reviewsCount: 342,
    description:
      "A brutal zombie survival simulation where every decision determines your fate.",
    type: "Key",
    delivery: "Instant delivery",
    allowedCountries: ["Brazil", "Argentina", "Chile", "Mexico"],
  },
  {
    id: "crimson-desert-deluxe-latam",
    name: "Crimson Desert Deluxe Edition Steam Key LATAM",
    image: "",
    platform: "Steam",
    price: 245.99,
    originalPrice: 299.99,
    genre: "Action",
    region: "LATAM",
    rating: 4.6,
    reviewsCount: 89,
    description:
      "An open-world action game with visceral combat and a rich, dynamic world.",
    type: "Key",
    delivery: "Instant delivery",
    allowedCountries: ["Brazil", "Argentina", "Chile", "Mexico"],
  },
];

export default function BestDeals() {
  const [emblaRef] = useEmblaCarousel({
    loop: false,
    align: "center",
  });

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
        <div className="bg-neon-gradient rounded-full p-[1.5px]">
          <button className="rounded-full bg-black px-6 py-3 text-base font-regular tracking-wide text-neon-white transition-colors hover:bg-neon-white/5 sm:px-8 sm:text-lg">
            VIEW ALL DEALS
          </button>
        </div>
      </div>
    </section>
  );
}
