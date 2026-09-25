import BestDeals from "@/src/sections/main/bestdeals";
import CategoriesSection from "@/src/sections/main/categories";
import HeroSection from "@/src/sections/main/hero";
import WhyChooseUs from "@/src/sections/main/whychooseus";

export default function MainPage() {
  return (
    <div className="bg-black min-h-screen">
      <HeroSection />
      <BestDeals />
      <CategoriesSection />
    </div>
  );
}
