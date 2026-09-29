// src/components/categories/CategoryGrid.tsx
import type { Category } from "./categories";
import CategoryCard from "./categoryCard";

export default function CategoryGrid({ items }: { items: Category[] }) {
  return (
    <div className="grid w-full grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
      {items.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  );
}