import Image from "next/image";

const Header = () => {
  return (
    
    <header className="flex flex-col px-90 py-6 bg-black items-center justify-between border-t border-b border-neon-white/10">
      <span className="tracking-wide mb-4 w-full text-sm text-white">BUSINESS@NEON-KEYS.COM</span>
      <div className="flex items-center justify-between w-full max-w-7xl">
        {/* Logo — troque por <img src="/logo.svg" /> quando tiver a arte final */}
        <div className="text-3xl font-extrabold tracking-tight">
          <span className="text-neon-white">NEON</span>{" "}
          <span className="bg-neon-gradient bg-clip-text text-transparent">
            KEYS
          </span>
        </div>

        {/* Navegação */}
        <nav className="hidden -ml-22 md:flex items-center gap-12 text-md font-medium">
          <a
            href="#"
            className="relative text-neon-pink font-semibold [text-shadow:0_0_4px_#f90ba3,0_0_12px_#f90ba3,0_0_24px_#f90ba3,0_0_48px_#f90ba3]"
          >
            Home
            <span className="absolute left-0 bottom-0 w-full h-0.5 rounded-full bg-neon-pink shadow-[0_0_4px_#f90ba3,0_0_10px_#f90ba3,0_0_20px_#f90ba3]" />
          </a>
          <a
            href="#"
            className="text-neon-white/80 hover:text-neon-white transition-colors"
          >
            Shop
          </a>
          <a
            href="#"
            className="text-neon-white/80 hover:text-neon-white transition-colors"
          >
            About
          </a>
          <a
            href="#"
            className="text-neon-white/80 hover:text-neon-white transition-colors"
          >
            Contact
          </a>
        </nav>

        {/* Idioma + carrinho */}
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
