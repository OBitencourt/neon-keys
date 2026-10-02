import Image from "next/image";

export default function ShopBanner() {
  return (
    <section className="bg-black px-4 pt-8 pb-6 sm:px-8 md:px-12 lg:px-22 md:pt-12 md:pb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-8 max-w-420 mx-auto">
      <div>
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold bg-neon-gradient bg-clip-text text-transparent">
          Shop
        </h1>
        <p className="mt-1.5 md:mt-2 text-base sm:text-lg md:text-xl max-w-100 text-neon-white font-regular">
          Find the best game keys at{" "}
          <span className="bg-neon-gradient bg-clip-text text-transparent font-medium">
            unbeatable prices.
          </span>
        </p>

        <div className="mt-5 md:mt-6 flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-4 sm:gap-6 md:gap-8">
          {/* Feature 1: Instant Delivery */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center shrink-0 rounded-full border border-neon-pink p-2"> 
              <Image 
                src="/raio-icon.svg" 
                alt="Instant Delivery" 
                width={30} 
                height={30} 
                className="h-full w-full object-contain" 
              />
            </div>
            <div>
              <p className="text-neon-white text-sm sm:text-base md:text-lg font-regular">Instant Delivery</p>
              <p className="text-neon-gray text-xs sm:text-sm md:text-md">Get your keys instantly</p>
            </div>
          </div>

          {/* Feature 2: 100% Secure */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center shrink-0 rounded-full border border-neon-orange p-2"> 
              <Image 
                src="/escudo1.svg" 
                alt="100% Secure" 
                width={40} 
                height={40} 
                className="h-full w-full object-contain" 
              />
            </div>
            <div>
              <p className="text-neon-white text-sm sm:text-base md:text-lg font-regular">100% Secure</p>
              <p className="text-neon-gray text-xs sm:text-sm md:text-md">SSL encrypted payments</p>
            </div>
          </div>

          {/* Feature 3: 24/7 Support */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center shrink-0 rounded-full border border-neon-purple p-2"> 
              <Image 
                src="/fone1.svg" 
                alt="24/7 Support" 
                width={45} 
                height={45} 
                className="h-full w-full object-contain ml-0.5" 
              />
            </div>
            <div>
              <p className="text-neon-white text-sm sm:text-base md:text-lg font-regular">24/7 Support</p>
              <p className="text-neon-gray text-xs sm:text-sm md:text-md">We're here to help.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}