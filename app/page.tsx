import { getProducts } from "@/src/lib/eneba/products";

import PriceDeals from "@/src/components/pricedeals";
import BestDeals from "@/src/sections/main/bestdeals";
import CategoriesSection from "@/src/sections/main/categories";
import HeroSection from "@/src/sections/main/hero";

export const dynamic = "force-dynamic";

export default async function MainPage() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-black">
      <HeroSection products={products} />

      <BestDeals products={products} />

      <PriceDeals products={products} maxPrice={20} />
      <PriceDeals products={products} maxPrice={30} />
      <PriceDeals
        products={products}
        minPrice={30}
        maxPrice={50}
      />
      <PriceDeals
        products={products}
        minPrice={50}
        maxPrice={100}
      />

      <CategoriesSection />
    </div>
  );
}