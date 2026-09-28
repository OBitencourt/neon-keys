import Link from "next/link";
import CategoriesMap  from "../../components/categories/categoriesMap";

export default function CategoriesSection() {
  return (
    <section className="bg-black px-8 py-20">
      <CategoriesMap />

      <div className="flex justify-center mt-10">
        <div className="bg-neon-gradient p-[1.5px] rounded-full">
          <Link
            href="/categorias"
            className="block bg-black text-neon-white text-lg font-regular tracking-wide px-8 py-3 rounded-full hover:bg-neon-white/5 transition-colors"
          >
            VIEW ALL CATEGORIES
          </Link>
        </div>
      </div>
    </section>
  );
}