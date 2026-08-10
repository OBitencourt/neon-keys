import Image from "next/image";

export default function ShopBanner() {
  return (
    <section className="bg-black px-8 pt-12 pb-8 flex flex-col md:flex-row items-center justify-between gap-8 max-w-420 mx-auto">
      <div>
        <h1 className="text-7xl font-extrabold bg-neon-gradient bg-clip-text text-transparent">
          Shop
        </h1>
        <p className="mt-2 text-xl max-w-100 text-neon-white font-regular">
          Find the best game keys at{" "}
          <span className="bg-neon-gradient bg-clip-text text-transparent font-medium">
            unbeatable prices.
          </span>
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-8">
          {/* Feature 1: Instant Delivery */}
          <div className="flex items-center gap-3">
            <div className="rounded-full border border-neon-pink px-3 py-1.5"> 
              <Image src="/raio-icon.svg" alt="Instant Delivery" width={30} height={30} />
            </div>
            <div>
              <p className="text-neon-white text-lg font-regular">Instant Delivery</p>
              <p className="text-neon-gray text-md">Get your keys instantly</p>
            </div>
          </div>

          {/* Feature 2: 100% Secure */}
          <div className="flex items-center gap-3">
            <div className="rounded-full border border-neon-orange px-2 py-1.5"> 
              <Image src="/escudo1.svg" alt="100% Secure" width={40} height={40} />
            </div>
            <div>
              <p className="text-neon-white text-lg font-regular">100% Secure</p>
              <p className="text-neon-gray text-md">SSL encrypted payments</p>
            </div>
          </div>

          {/* Feature 3: 24/7 Support */}
          <div className="flex items-center gap-3">
            <div className="rounded-full border border-neon-purple px-2 py-2"> 
              <Image src="/fone1.svg" alt="24/7 Support" className=" ml-0.5" width={45} height={45} />
            </div>
            <div>
              <p className="text-neon-white text-lg font-regular">24/7 Support</p>
              <p className="text-neon-gray text-md">We're here to help.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Ilustração — troque pela imagem/render final do carrinho com os jogos */}
      {/*<div className="w-full max-w-sm aspect-video rounded-2xl border border-dashed border-neon-gray/40 flex items-center justify-center text-neon-gray text-sm shrink-0">
        Ilustração do carrinho (placeholder)
      </div>*/}
    </section>
  );
}
