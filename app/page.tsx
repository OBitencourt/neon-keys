import BestDeals from "@/src/sections/bestdeals";
import CategoriesSection from "@/src/sections/categories";
import HeroSection from "@/src/sections/hero";
import Newsletter from "@/src/sections/newsletter";
import WhyChooseUs from "@/src/sections/whychooseus";

export default function MainPage() {
  return (
    <div className="bg-black min-h-screen">
      <HeroSection />
      <CategoriesSection />
      <WhyChooseUs />
      <BestDeals />
      <Newsletter />
    </div>
  );
}
