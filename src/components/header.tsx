"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Header = () => {
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "About", href: "/about-us" },
    { name: "Contact", href: "/contact" },
  ];

  const activeStyles =
    "relative text-neon-pink font-semibold [text-shadow:0_0_4px_#f90ba3,0_0_12px_#f90ba3,0_0_24px_#f90ba3,0_0_48px_#f90ba3]";
  const inactiveStyles =
    "text-neon-white/80 hover:text-neon-white transition-colors";

  return (
    <header className="flex flex-col bg-black border-t border-b border-neon-white/10">
      {/* Barra de contato */}
      <div className="w-full  border-neon-white/10 py-2 text-center text-xs tracking-wide text-white">
        BUSINESS@NEON-KEYS.COM
      </div>

      {/* Linha principal: logo + busca + ações */}
      <div className="mx-auto flex w-full max-w-7xl items-center gap-6 px-6 py-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 text-3xl font-extrabold tracking-tight"
        >
          <Image src="/Logo-Neon.svg" alt="Neon Keys" width={80} height={80} />
          <span className="text-neon-white">NEON</span>{" "}
          <span className="bg-neon-gradient bg-clip-text text-transparent">
            KEYS
          </span>
        </Link>

        {/* Search bar */}
        <div className="relative mx-auto w-full max-w-xl">
          <input
            type="text"
            placeholder="Search for a game..."
            className="
              h-11
              w-full
              rounded-md
              border
              border-neon-white/20
              bg-black
              pl-4
              pr-14
              text-sm
              text-neon-white
              placeholder:text-neon-white/40
              outline-none
              focus:border-neon-pink
            "
          />

          <button
            type="button"
            className="
              absolute
              right-0
              top-0
              flex
              h-full
              w-12
              items-center
              justify-center
              rounded-r-md
              bg-neon-gradient
              transition-opacity
              hover:opacity-90
            "
          >
            <Image
              src="/lupa-searchbar.svg"
              alt="Carrinho de compras"
              width={18}
              height={18}
            />
          </button>
        </div>

        {/* Ações: idioma, carrinho, perfil */}
        <div className="flex shrink-0 items-center gap-6">
          <button className="flex items-center gap-1 text-sm text-neon-white/80 transition-colors hover:text-neon-white">
            PT
            <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
              <path
                d="M6 9l6 6 6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <Link href="/cart" className="relative text-neon-pink">
            <Image
              src="/header-bag-icon.svg"
              alt="Carrinho de compras"
              width={30}
              height={30}
            />
            <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-extrabold text-black">
              0
            </span>
          </Link>

          <Link href="/profile" className="text-neon-pink">
            <Image
              src="/profile-icon.svg"
              alt="Perfil"
              width={35}
              height={35}
            />
          </Link>
        </div>
      </div>

      {/* Navegação — alinhada centralmente com a search bar */}
      <div className="flex w-full justify-center pb-4">
        <nav className="hidden w-full max-w-xl items-center justify-center gap-8 text-sm font-medium md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={isActive ? activeStyles : inactiveStyles}
              >
                {link.name}
                {isActive && (
                  <span className="absolute left-0 -bottom-1 h-0.5 w-full rounded-full bg-neon-pink shadow-[0_0_4px_#f90ba3,0_0_10px_#f90ba3,0_0_20px_#f90ba3]" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default Header;
