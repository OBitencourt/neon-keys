// src/components/categories/categoryCard.tsx
import Image from "next/image";
import Link from "next/link";
import type { Category } from "./categories";

export default function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={category.href}
      className="group relative block h-[260px] w-full max-w-[400px] overflow-hidden rounded-2xl"
    >
      <Image
        src={category.image}
        alt={category.label}
        fill
        sizes="(max-width: 768px) 100vw, 400px"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* Overlay para garantir legibilidade do título */}
      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/10 to-transparent" />

      <h3 className="absolute bottom-5 left-5 font-gabarito text-xl font-semibold tracking-wide text-neon-white sm:text-2xl">
        {category.label}
      </h3>
    </Link>
  );
}