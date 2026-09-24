import Categories from "../../components/categories";

export default function CategoriesSection() {
  return (
    <section className="bg-black px-8 py-20">
      <Categories />

      <div className="flex justify-center mt-10">
        <div className="bg-neon-gradient p-[1.5px] rounded-full">
          <button className="bg-black text-neon-white text-lg font-regular tracking-wide px-8 py-3 rounded-full hover:bg-neon-white/5 transition-colors">
            VIEW ALL CATEGORIES
          </button>
        </div>
      </div>
    </section>
  );
}