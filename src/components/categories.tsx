import Image from "next/image";

export default function Categories() {
  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
      <div className="flex flex-col items-center justify-center rounded-xl border-2 border-neon-pink p-10 text-center shadow-[0_0_14px_#f90ba34d] transition-all duration-300 hover:bg-neon-pink/20 hover:shadow-[0_0_24px_#f90ba380]">
        <Image src="/controller3.png" alt="Games" width={80} height={80} className="mb-5" />
        
        <div className="relative mb-3">
          <h3 className="font-inder text-neon-pink absolute inset-0 text-2xl font-regular tracking-wide blur-md" aria-hidden="true">
            GAMES
          </h3>
          <h3 className="font-inder text-neon-white relative text-2xl font-regular tracking-wide">
            GAMES
          </h3>
        </div>

        <a href="#" className="text-neon-white/90 hover:text-neon-pink flex items-center gap-1.5 text-base font-semibold transition-colors">
          View all games <span className="text-neon-pink">→</span>
        </a>
      </div>

      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-neon-blue p-10 text-center shadow-[0_0_14px_#025cb74d] transition-all duration-300 hover:bg-neon-blue/20 hover:shadow-[0_0_22px_#025cb780]">
        <Image src="/steam2.svg" alt="Steam" width={80} height={80} className="mb-5" />
        
        <div className="relative mb-3">
          <h3 className="font-inder text-neon-blue absolute inset-0 text-2xl font-extrabold tracking-wide blur-md" aria-hidden="true">
            STEAM GAMES
          </h3>
          <h3 className="font-inder text-neon-blue relative text-2xl font-regular tracking-wide">
            STEAM GAMES
          </h3>
        </div>

        <a href="#" className="text-neon-white/90 hover:text-neon-blue flex items-center gap-1.5 text-base font-semibold transition-colors">
          Explore games <span className="text-neon-blue">→</span>
        </a>
      </div>
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-neon-orange p-10 text-center shadow-[0_0_14px_#fe59004d] transition-all duration-300 hover:bg-neon-orange/20 hover:shadow-[0_0_24px_#fe590080]">
        <Image src="/epicgames1.png" alt="Epic Games" width={80} height={80} className="mb-5" />
        
        <div className="relative mb-3">
          <h3 className="font-inder text-neon-orange absolute inset-0 text-2xl font-regular tracking-wide blur-md" aria-hidden="true">
            EPIC GAMES
          </h3>
          <h3 className="font-inder text-neon-orange relative text-2xl font-regular tracking-wide">
            EPIC GAMES
          </h3>
        </div>

        <a href="#" className="text-neon-white/90 hover:text-neon-orange flex items-center gap-1.5 text-base font-semibold transition-colors">
          Explore games <span className="text-neon-orange">→</span>
        </a>
      </div>

      {/* XBOX GAMES — green */}
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-neon-green p-10 text-center shadow-[0_0_14px_#24721d4d] transition-all duration-300 hover:bg-neon-green/20 hover:shadow-[0_0_24px_#24721d80]">
        <Image src="/xbox3.png" alt="Xbox" width={80} height={80} className="mb-5" />
        
        <div className="relative mb-3">
          <h3 className="font-inder text-[#62D33D] absolute inset-0 text-2xl font-regular tracking-wide blur-md" aria-hidden="true">
            XBOX GAMES
          </h3>
          <h3 className="font-inder text-[#62D33D] relative text-2xl font-regular tracking-wide">
            XBOX GAMES
          </h3>
        </div>

        <a href="#" className="text-neon-white/90 hover:text-neon-green flex items-center gap-1.5 text-base font-semibold transition-colors">
          Explore games <span className="text-neon-green">→</span>
        </a>
      </div>

      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-neon-purple p-10 text-center shadow-[0_0_14px_#8b3fff4d] transition-all duration-300 hover:bg-neon-purple/20 hover:shadow-[0_0_24px_#8b3fff80]">
        <Image src="/playstation2.png" alt="PlayStation" width={80} height={80} className="mb-5" />
        
        <div className="relative mb-3">
          <h3 className="font-inder text-neon-purple absolute inset-0 text-2xl font-regular tracking-wide blur-md" aria-hidden="true">
            PLAYSTATION GAMES
          </h3>
          <h3 className="font-inder text-neon-purple relative text-2xl font-regular tracking-wide">
            PLAYSTATION GAMES
          </h3>
        </div>

        <a href="#" className="text-neon-white/90 hover:text-neon-purple flex items-center gap-1.5 text-base font-semibold transition-colors">
          Explore games <span className="text-neon-purple">→</span>
        </a>
      </div>

      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-neon-pink p-10 text-center shadow-[0_0_14px_#f90ba34d] transition-all duration-300 hover:bg-neon-pink/20 hover:shadow-[0_0_24px_#f90ba380]">
        <Image src="/gift1.png" alt="Gift Cards" width={80} height={80} className="mb-5" />
        
        <div className="relative mb-3">
          <h3 className="font-inder text-neon-pink absolute inset-0 text-2xl font-regular tracking-wide blur-md" aria-hidden="true">
            GIFT CARDS
          </h3>
          <h3 className="font-inder text-neon-pink relative text-2xl font-regular tracking-wide">
            GIFT CARDS
          </h3>
        </div>

        <a href="#" className="text-neon-white/90 hover:text-neon-pink flex items-center gap-1.5 text-base font-semibold transition-colors">
          Explore games <span className="text-neon-pink">→</span>
        </a>
      </div>
    </div>
  );
}