"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const Header = () => {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);

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
    <header className="flex flex-col border-b border-t border-neon-white/10 bg-black">
      <div className="w-full border-neon-white/10 py-2 text-center text-[10px] tracking-wide text-white sm:text-xs">
        BUSINESS@NEON-KEYS.COM
      </div>

      <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 py-3 md:gap-6 md:px-6 md:py-4">
        {/* Logo: só o símbolo no mobile, símbolo + texto a partir de md */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 text-3xl font-extrabold tracking-tight"
        >
          <Image
            src="/Logo-Neon.svg"
            alt="Neon Keys"
            width={100}
            height={100}
            className="h-16 w-16 md:h-20 md:w-20"
          />
          <span className="hidden text-neon-white md:inline">NEON</span>
          <span className="hidden bg-neon-gradient bg-clip-text text-transparent md:inline">
            KEYS
          </span>
        </Link>

        {/* Search bar (desktop) */}
        <div className="mx-auto hidden w-full max-w-xl md:block">
          <SearchBar />
        </div>

        {/* Ações */}
        <div className="ml-auto flex shrink-0 items-center gap-4 sm:gap-5 md:ml-0 md:gap-6">
          <button className="hidden items-center gap-1 text-sm text-neon-white/80 transition-colors hover:text-neon-white md:flex">
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

          {/* Ícone de pesquisa (mobile): altera entre a lupa gradiente (fechado) e a lupa normal (aberto) */}
          <button
            type="button"
            onClick={() => setSearchOpen((open) => !open)}
            aria-label={searchOpen ? "Fechar pesquisa" : "Abrir pesquisa"}
            aria-expanded={searchOpen}
            className={`flex h-7 w-7 items-center justify-center rounded-md transition-opacity hover:opacity-90 md:hidden ${
              searchOpen ? "bg-neon-gradient p-1" : ""
            }`}
          >
            <Image
              src={
                searchOpen
                  ? "/lupa-searchbar.svg"
                  : "/lupa-gradient-searchbar.svg"
              }
              alt=""
              width={30}
              height={30}
              className="h-7 w-7 md:h-[30px] md:w-[30px]"
            />
          </button>

          <Link href="/cart" className="relative text-neon-pink">
            <Image
              src="/header-bag-icon.svg"
              alt="Carrinho de compras"
              width={30}
              height={30}
              className="h-7 w-7 md:h-[30px] md:w-[30px]"
            />
            <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-extrabold text-black">
              0
            </span>
          </Link>

          <Link href="/profile" className="text-neon-pink">
            <Image
              src="/profile-icon.svg"
              alt="Perfil"
              width={30}
              height={30}
              className="h-7 w-7 md:h-[30px] md:w-[30px]"
            />
          </Link>
        </div>
      </div>

      {/* Barra de pesquisa expansível (mobile) */}
      {searchOpen && (
        <div className="px-4 pb-3 md:hidden">
          <SearchBar autoFocus />
        </div>
      )}

      {/* Navegação */}
      <div className="flex w-full justify-center px-4 pb-3 md:pb-4">
        <nav className="flex w-full max-w-xl items-center justify-center gap-6 text-sm font-medium md:gap-8">
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
                  <span className="absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-neon-pink shadow-[0_0_4px_#f90ba3,0_0_10px_#f90ba3,0_0_20px_#f90ba3]" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

function SearchBar({ autoFocus = false }: { autoFocus?: boolean }) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSearch() {
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSearch();
      }}
      className="relative w-full"
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoFocus={autoFocus}
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

      {/* Botão de busca — agora visível em todos os tamanhos */}
      <button
        type="submit"
        aria-label="Pesquisar"
        className="absolute right-0 top-0 flex h-full w-12 items-center justify-center rounded-r-md bg-neon-gradient transition-opacity hover:opacity-90"
      >
        <Image src="/lupa-searchbar.svg" alt="" width={18} height={18} />
      </button>
    </form>
  );
}

export default Header;