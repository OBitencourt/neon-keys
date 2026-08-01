import CategoriesSection from "@/src/sections/categories";
import HeroSection from "@/src/sections/hero";
import Image from "next/image";

export default function MainPage() {
  return (
    <div className="bg-black min-h-screen">
      <HeroSection />
      <CategoriesSection />
    </div>
  );
}
