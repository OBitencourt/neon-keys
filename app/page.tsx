import PriceDeals from "@/src/components/pricedeals";
import BestDeals from "@/src/sections/main/bestdeals";
import CategoriesSection from "@/src/sections/main/categories";
import HeroSection from "@/src/sections/main/hero";

export default function MainPage() {
  return (
    <div className="bg-black min-h-screen">
      <HeroSection />
      <BestDeals />
      <PriceDeals maxPrice={30} />
      <PriceDeals minPrice={30} maxPrice={50} />
      <PriceDeals minPrice={50} maxPrice={100} />
      <CategoriesSection />
    </div>
  );
}
