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
  return (
    <section className="bg-black px-8 py-16">
      <div className="flex items-center justify-center gap-4 mb-10">
        <div className="h-px w-28 bg-linear-to-r from-transparent to-neon-pink" />
        <h2 className="text-2xl font-bold text-neon-white tracking-wide whitespace-nowrap">
          BEST DEALS
        </h2>
        <div className="h-px w-28 bg-linear-to-l from-transparent to-neon-orange" />
      </div>

      <div className="grid grid-cols-5 gap-6 w-full max-w-[1800px] mx-auto px-4">
        {deals.map((deal) => (
          <ProductCard key={deal.id} product={deal} />
        ))}
      </div>

      <div className="flex justify-center mt-10">
        <div className="bg-neon-gradient p-[1.5px] rounded-full">
          <button className="bg-black text-neon-white text-lg font-regular tracking-wide px-8 py-3 rounded-full hover:bg-neon-white/5 transition-colors">
            VIEW ALL DEALS
          </button>
        </div>
      </div>
    </section>
  );
}