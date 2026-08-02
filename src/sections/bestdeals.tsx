import ProductCard from "../components/productcard";
import type { Product } from "../types/product";

const deals: Product[] = [
  {
    id: "capote-steam-latam",
    name: "Capote Steam(PC) Key LATAM",
    image: "",
    platform: "Steam",
    price: 8.99,
    originalPrice: 11.99,
    genre: "Adventure",
  },
  {
    id: "human-fall-flat-steam-latam",
    name: "Human: Fall Flat Steam Key LATAM",
    image: "",
    platform: "Steam",
    price: 10.99,
    originalPrice: 17.99,
    genre: "Adventure",
  },
  {
    id: "ori-blind-forest-global",
    name: "Ori and the Blind Forest (Definitive Edition) Steam (PC) Key GLOBAL",
    image: "",
    platform: "Steam",
    price: 22.99,
    originalPrice: 39.9,
    genre: "Adventure",
  },
  {
    id: "humanitz-steam-latam",
    name: "HumanitZ Steam Key LATAM",
    image: "",
    platform: "Steam",
    price: 10.99,
    originalPrice: 17.99,
    genre: "Simulation",
  },
  {
    id: "crimson-desert-deluxe-latam",
    name: "Crimson Desert Deluxe Edition Steam Key LATAM",
    image: "",
    platform: "Steam",
    price: 245.99,
    originalPrice: 299.99,
    genre: "Action",
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