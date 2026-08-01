import Image from "next/image";
import Categories from "../components/categories";

export default function CategoriesSection() {
  return (
    <section className="bg-black px-8 py-20">
      {/* Título com linhas em gradiente dos dois lados */}
      <div className="flex items-center justify-center gap-6 mb-12">
        <div className="h-1.5 rounded-full w-28 bg-linear-to-r from-transparent to-neon-pink" />
        <h2 className="text-5xl font-regular font-inder text-neon-white tracking-wide whitespace-nowrap">
          CATEGORIES
        </h2>
        <div className="h-1.5 rounded-full w-28 bg-linear-to-l from-transparent to-neon-orange" />
      </div>

      {/* Grid de categorias */}
      <Categories />
    

      {/* Botão "View all products" — borda em gradiente */}
      <div className="flex justify-center mt-10">
        <div className="bg-neon-gradient p-[1.5px] rounded-full">
          <button className="bg-black text-neon-white text-lg font-regular tracking-wide px-8 py-3 rounded-full hover:bg-neon-white/5 transition-colors">
            VIEW ALL PRODUCTS
          </button>
        </div>
      </div>
    </section>
  );
}