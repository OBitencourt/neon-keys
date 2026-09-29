// src/components/categories/categoryCard.tsx
import Image from "next/image";
import Link from "next/link";
import type { Category } from "./categories";

export default function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={category.href}
      className="group relative block h-[140px] sm:h-[260px] w-full overflow-hidden rounded-xl sm:rounded-2xl"
    >
      <Image
        src={category.image}
        alt={category.label}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 400px"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* Overlay para garantir legibilidade do título */}
      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/10 to-transparent" />

      <h3 className="absolute bottom-3 left-3 sm:bottom-5 sm:left-5 font-gabarito text-sm font-semibold tracking-wide text-neon-white sm:text-2xl">
        {category.label}
      </h3>
    </Link>
  );
}