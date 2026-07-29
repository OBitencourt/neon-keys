
export default function NeonKeysHero() {
  return (
    <div className="bg-black min-h-screen">
      {/* Topbar de contato */}
      <div className="flex items-center justify-center gap-2 py-2 text-xs text-neon-white/80">
        
        <span className="tracking-wide">BUSINESS@NEON-KEYS.COM</span>
      </div>

      {/* Header */}
      

      {/* Hero */}
      <section className="grid md:grid-cols-2 gap-12 items-center px-8 py-20 max-w-7xl mx-auto">
        {/* Coluna esquerda */}
        <div>
          <span className="inline-flex items-center gap-2 border border-neon-pink text-neon-pink text-xs font-semibold px-4 py-1.5 rounded-full">
            "truck"
            FAST DELIVERY
          </span>

          <h1 className="mt-6 text-8xl font-extrabold bg-neon-gradient bg-clip-text text-transparent leading-tight">
            Neon Keys
          </h1>

          <p className="mt-3 text-xl font-semibold text-neon-white">
            Digital game distribution &amp; reselling
          </p>

          <p className="mt-4 text-neon-gray max-w-md">
            Premium game keys at the best prices, instant delivery. 100% secure.
          </p>

          <div className="mt-8 flex items-center gap-4">
            <button className="flex items-center gap-2 border border-neon-pink text-neon-pink font-semibold px-5 py-3 rounded-full hover:bg-neon-pink/10 transition-colors">
              "shopping"
              BROWSE PRODUCTS
            </button>
            <button className="flex items-center gap-2 bg-neon-gradient text-neon-white font-semibold px-5 py-3 rounded-full hover:opacity-90 transition-opacity">
              "send"
              CONTACT US
            </button>
          </div>
        </div>

        {/* Coluna direita — card de produto */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 text-neon-pink font-bold text-sm mb-4">
            "star"
            "star"
            BEST SELLER
            "star"
            "star"
          </div>

          {/* Borda em gradiente */}
          <div className="bg-neon-gradient p rounded-2xl w-full max-w-xs">
            <div className="bg-black rounded-2xl p-5 flex flex-col items-center">
              {/* Capa do jogo — troque por <img src="/capa-do-jogo.jpg" /> */}
              <div className="w-full aspect-3/4 rounded-lg border border-dashed border-neon-gray/40 flex flex-col items-center justify-center gap-2 text-neon-gray">
                "image"
                <span className="text-xs">Capa do jogo (placeholder)</span>
              </div>

              <h3 className="mt-4 text-center text-neon-white font-semibold">
                Human: Fall Flat Steam Key GLOBAL
              </h3>

              <div className="mt-2 flex items-center gap-2">
                <span className="text-neon-gray line-through text-sm">R$17,99</span>
                <span className="text-neon-green font-bold">R$10,99</span>
              </div>

              <button className="mt-4 flex items-center gap-2 border border-neon-orange text-neon-orange text-sm font-semibold px-4 py-2 rounded-full hover:bg-neon-orange/10 transition-colors">
                "shopping cart"
                ADD TO BAG
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}