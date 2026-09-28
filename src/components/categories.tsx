import Image from "next/image";
import Link from "next/link";

interface Category {
  id: string;
  label: string;
  image: string;
  href: string;
}

const categories: Category[] = [
  { id: "acao", label: "AÇÃO", image: "/action-category.png", href: "/shop" },
  { id: "terror", label: "TERROR", image: "/terror-category.png", href: "/shop" },
  { id: "indie", label: "INDIE", image: "/indie-category.png", href: "/shop" },
  { id: "multiplayer", label: "MULTIPLAYER", image: "/multiplayer-category.png", href: "/shop" },
  { id: "casuais", label: "CASUAIS", image: "/casual-category.png", href: "/shop" },
  { id: "corrida", label: "CORRIDA", image: "/race-category.png", href: "/shop" },
];

export default function Categories() {
  return (
    <section className="w-full px-4 py-16 sm:px-8">
      <div className="mx-auto w-full max-w-[1240px]">
        <h2 className="mb-6 font-gabarito text-3xl font-bold tracking-wide text-left sm:text-5xl">
          <span className="text-neon-white font-medium">CATEGORIAS </span>
          <span className="bg-neon-gradient font-bold bg-clip-text text-transparent">
            MAIS BUSCADAS
          </span>
        </h2>

        <div className="grid w-full grid-cols-1 justify-items-center gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.id}
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
          ))}
        </div>
      </div>
    </section>
  );
}