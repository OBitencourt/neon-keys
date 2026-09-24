import Image from "next/image";
import Link from "next/link";

interface Category {
  id: string;
  label: string;
  image: string;
  href: string;
}

// Ao clicar na categoria, o usuário será redirecionado para a página de shop mas com o filtro de categoria já aplicado. Por isso, o href de cada categoria aponta para a página de shop com query params.

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

      <h2 className="mb-8 font-gabarito text-3xl font-bold tracking-wide sm:text-5xl">
        <span className="text-neon-white font-medium">CATEGORIAS </span>
        <span className="bg-neon-gradient font-bold bg-clip-text text-transparent">
          MAIS BUSCADAS
        </span>
      </h2>

      <div className="mx-auto grid w-full max-w-[1800px] grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

        {categories.map((category) => (
          <Link
            key={category.id}
            href={category.href}
            className="group relative block aspect-video w-full overflow-hidden rounded-2xl"
          >

            <Image
              src={category.image}
              alt={category.label}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Overlay para garantir legibilidade do título */}
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/10 to-transparent" />

            <h3 className="absolute bottom-4 left-4 font-gabarito text-xl font-semibold tracking-wide text-neon-white sm:text-3xl">
              {category.label}
            </h3>

          </Link>
        ))}

      </div>

    </section>
  );
}