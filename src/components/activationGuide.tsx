import Link from "next/link";
import Image from "next/image";
export default function ActivationGuide() {
  return (
    <div className="mt-6 rounded-xl bg-neon-purple/50 p-[1.5px]">

      <div
        className="
          flex
          flex-col
          gap-4
          rounded-xl
          bg-black
          px-5
          py-4
          sm:flex-row
          sm:items-center
          sm:justify-between
          lg:px-7
        "
      >

        {/* Left */}
        <div className="flex items-center gap-4">

          <div
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-full
              border
              border-neon-purple
              text-lg
              text-neon-purple
            "
          >
            i
          </div>

          <div>

            <h3 className="text-base font-medium text-neon-purple lg:text-lg">
              How to activate your key?
            </h3>

            <p className="mt-0.5 text-xs text-neon-gray lg:text-sm">
              View our activation guide for step-by-step instructions.
            </p>

          </div>

        </div>

        {/* Right */}
        <Link
          href="/activation-guide"
          className="
            flex
            items-center
            gap-3
            text-sm
            font-bold
            text-[#B91FDF]
            transition
            hover:brightness-75
            lg:text-base
          "
        >
          VIEW GUIDE

          <Image
            src="/purple-guide-icon.svg"
            alt=""
            width={20}
            height={20}
          />
        </Link>

      </div>

    </div>
  );
}