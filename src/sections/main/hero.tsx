import Image from "next/image";

export default function HeroSection() {
  return (
      <section className="grid md:grid-cols-2 gap-12 items-center px-8 py-8 max-w-7xl mx-auto">
        <div>
          <div className="relative inline-block">
            <div
              className="absolute inset-0 rounded-full bg-neon-gradient blur-lg opacity-60"
              aria-hidden="true"
            />
            <div className="relative bg-neon-gradient p-[1.5px] rounded-full">
              <span className="flex items-center gap-2 bg-black rounded-full px-4 py-1.5">
                <Image src="/raio-icon.svg" alt="Raio" width={18} height={18} />
                <span className="bg-neon-gradient bg-clip-text text-transparent text-sm font-semibold">
                  FAST DELIVERY
                </span>
              </span>
            </div>
          </div>

          <div className="relative mt-6 inline-block">
            <h1
              className="absolute inset-0 text-8xl font-extrabold bg-neon-gradient bg-clip-text text-transparent blur-xl opacity-50 select-none pointer-events-none"
              aria-hidden="true"
            >
              Neon Keys
            </h1>
            <h1 className="relative text-8xl font-extrabold bg-neon-gradient bg-clip-text text-transparent leading-tight">
              Neon Keys
            </h1>
          </div>

          <p className="mt-3 text-xl font-semibold text-neon-white">
            Digital game distribution &amp; reselling
          </p>

          <p className="mt-4 text-neon-gray max-w-md">
            Premium game keys at the best prices, instant delivery. 100% secure.
          </p>

          <div className="mt-8 flex items-center gap-4">
            <div className="bg-neon-gradient p-0.5 rounded-full">
              <button className="group relative overflow-hidden flex items-center gap-4 bg-black text-neon-white font-medium pl-4 pr-5 py-3 rounded-full transition-colors">
                <span
                  className="absolute inset-0 bg-neon-gradient opacity-0 group-hover:opacity-50 group-active:opacity-70 transition-opacity duration-300"
                  aria-hidden="true"
                />
                <div className="relative flex items-center justify-center w-14 h-14 border-2 p-2 border-neon-pink rounded-full">
                  <Image
                    src="/controller3.png"
                    alt="Controle de jogo"
                    width={50}
                    height={50}
                  />
                </div>
                <span className="relative">BROWSE PRODUCTS</span>
              </button>
            </div>

            <div className="bg-neon-gradient p-0.5 rounded-full">
              <button className="flex items-center gap-4 bg-neon-gradient-soft text-neon-white font-semibold pl-4 pr-7 py-3 rounded-full hover:opacity-90 transition-opacity">
                <div className="flex items-center justify-center w-14 h-14 border-2 p-2 border-black rounded-full">
                  <Image
                    src="/contact-icon.svg"
                    alt="Envelope"
                    width={30}
                    height={30}
                  />
                </div>
                CONTACT US
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 bg-neon-gradient bg-clip-text text-transparent font-bold text-3xl mb-4">
            <div className="h-1 w-12 bg-linear-to-r from-black via-neon-pink/50 to-neon-pink rounded-full"></div>
            <Image src="/star-pink.svg" alt="Estrela" width={14} height={14} />
            <Image src="/star-pink.svg" alt="Estrela" width={20} height={20} />
            BEST SELLER
            <Image
              src="/star-yellow1.svg"
              alt="Estrela"
              width={20}
              height={20}
            />
            <Image
              src="/star-yellow1.svg"
              alt="Estrela"
              width={14}
              height={14}
            />
            <div className="h-1 w-12 bg-linear-to-l from-black via-amber-400750 to-amber-400 rounded-full"></div>
          </div>


          <div className="group/card relative w-full max-w-md">
            <div className="bg-neon-gradient absolute inset-0 rounded-3xl opacity-30 blur-sm transition duration-500 group-hover/card:opacity-40"></div>

            <div className="bg-neon-gradient relative w-full rounded-2xl p-0.5">
              <div className="flex flex-col items-center rounded-2xl bg-black p-5">
                <div className="border-neon-gray/40 text-neon-gray flex h-120 w-[80%] flex-col items-center justify-center gap-2 rounded-lg border border-dashed">
                  <Image
                    src="/image-placeholder-icon.svg"
                    alt="Placeholder"
                    width={28}
                    height={28}
                  />
                  <span className="text-xs">Capa do jogo (placeholder)</span>
                </div>

                <h3 className="text-neon-white mt-4 text-center text-xl font-semibold">
                  Human: Fall Flat Steam Key GLOBAL
                </h3>

                <div className="relative mt-2 flex items-center gap-2">
                  <span className="text-neon-gray text-lg font-semibold line-through">
                    R$17,99
                  </span>
                  <div className="relative">
                    <span
                      className="absolute inset-0 text-3xl font-bold text-neon-green blur-sm"
                      aria-hidden="true"
                    >
                      R$10,99
                    </span>
                    <span className="text-3xl font-bold text-neon-green">
                      R$10,99
                    </span>
                  </div>
                </div>

                {/* Botão com seu próprio escopo 'group' */}
                <div className="bg-neon-gradient mt-4 flex w-[90%] items-center justify-center rounded-4xl p-0.5">
                  <div className="flex w-full items-center justify-center rounded-4xl bg-black">
                    <button className="group relative flex w-full items-center justify-center gap-4 overflow-hidden rounded-full py-3 text-md font-semibold transition-colors">
                      <span
                        className="bg-neon-gradient absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-30 group-active:opacity-60"
                        aria-hidden="true"
                      />

                      <div className="relative z-10 flex items-center justify-center gap-4">
                        <Image
                          src="/cart-icon.svg"
                          alt="Carrinho"
                          width={30}
                          height={30}
                        />
                        <span className="bg-neon-gradient bg-clip-text text-transparent">
                          ADD TO BAG
                        </span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  )
}