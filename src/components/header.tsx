"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Header = () => {
  const pathname = usePathname();

  // Mapeamento das rotas
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const activeStyles =
    "relative text-neon-pink font-semibold [text-shadow:0_0_4px_#f90ba3,0_0_12px_#f90ba3,0_0_24px_#f90ba3,0_0_48px_#f90ba3]";
  const inactiveStyles =
    "text-neon-white/80 hover:text-neon-white transition-colors";

  return (
    <header className="flex flex-col px-90 py-6 bg-black items-center justify-between border-t border-b border-neon-white/10">
      <span className="tracking-wide mb-4 w-full text-sm text-white">
        BUSINESS@NEON-KEYS.COM
      </span>
      <div className="flex items-center justify-between w-full max-w-7xl">
        {/* Logo */}
        <Link href="/" className="text-3xl font-extrabold tracking-tight">
          <span className="text-neon-white">NEON</span>{" "}
          <span className="bg-neon-gradient bg-clip-text text-transparent">
            KEYS
          </span>
        </Link>

        <nav className="hidden -ml-22 md:flex items-center gap-12 text-md font-medium">
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
                  <span className="absolute left-0 bottom-0 w-full h-0.5 rounded-full bg-neon-pink shadow-[0_0_4px_#f90ba3,0_0_10px_#f90ba3,0_0_20px_#f90ba3]" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-6">
          <button className="flex items-center gap-1 text-sm text-neon-white/80 hover:text-neon-white transition-colors">
            PT
          </button>
          <button className="relative text-neon-pink">
            <Image
              src="/shopping-cart1.png"
              alt="Carrinho de compras"
              width={35}
              height={35}
            />
            <span className="absolute -top-2 -right-2 bg-neon-pink text-neon-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              0
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;