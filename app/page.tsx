import CategoriesSection from "@/src/sections/categories";
import HeroSection from "@/src/sections/hero";
import WhyChooseUs from "@/src/sections/whychooseus";
import Image from "next/image";

export default function MainPage() {
  return (
    <div className="bg-black min-h-screen">
      <HeroSection />
      <CategoriesSection />
      <WhyChooseUs />
    </div>
  );
}
