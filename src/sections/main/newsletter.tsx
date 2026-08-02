import Image from "next/image";

export default function Newsletter() {
  return (
    <section className="bg-black px-8 py-10">
      {/* Borda em gradiente ao redor do card inteiro */}
      <div className="bg-neon-gradient max-w-6xl mx-auto rounded-2xl p-[1.5px]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 rounded-2xl bg-black px-10 py-8">
          {/* Coluna esquerda — ícone + texto */}
          <div className="flex items-center gap-6">
            {/* Troque pelo ícone de envelope da sua escolha */}
            <Image src="/mail2.png" alt="Envelope" width={120} height={120} />

            <div>
              <p className="text-neon-white text-md font-bold tracking-wider mb-1">
                STAY UPDATED
              </p>
              <h2 className="text-3xl font-extrabold">
                <span className="text-neon-white font-bold tracking-wider">Join our </span>
                <span className="bg-neon-gradient bg-clip-text font-semibold text-transparent">
                  newsletter
                </span>
              </h2>
              <p className="text-neon-gray text-sm font-medium mt-2 max-w-sm">
                Get exclusive offers, new arrivals and the best deals straight to your inbox
              </p>
            </div>
          </div>

          <form className="bg-neon-gradient flex w-full max-w-md items-center rounded-xl p-[1.5px] shrink-0">
            <div className="flex w-full items-center rounded-xl bg-black pl-6 pr-1 py-1">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 bg-transparent text-neon-white pr-3 placeholder:text-neon-gray text-lg outline-none"
              />
              <button
                type="submit"
                className="bg-neon-gradient text-neon-white text-md font-bold tracking-widest px-6 py-4 rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap"
              >
                SUBSCRIBE
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}