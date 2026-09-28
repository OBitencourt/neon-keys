// app/categorias/page.tsx
import { categories } from "../../src/components/categories/categories";
import CategoryGrid from "../../src/components/categories/categoryGrid";

export default function CategoriasPage() {
  return (
    <main className="min-h-screen bg-black px-4 py-16 sm:px-8">
      <div className="mx-auto w-full max-w-[1240px]">
        <h1 className="mb-8 font-gabarito text-3xl font-bold tracking-wide sm:text-5xl">
          <span className="font-medium text-neon-white">CATEGORIAS</span>
        </h1>

        <CategoryGrid items={categories} />
      </div>
    </main>
  );
}