import { OwnedGame } from "@/src/types/ownedGame";
import Image from "next/image";

export default function OwnedGameCard({
  game,
  onOpenRevealModal,
}: {
  game: OwnedGame;
  onOpenRevealModal: () => void;
}) {
  return (
    <article className="rounded-lg bg-neon-gradient p-[1.5px]">

      <div
        className="
          flex
          min-h-31
          flex-col
          gap-5
          rounded-lg
          bg-black
          p-3
          sm:flex-row
          sm:items-center
          lg:p-2
        "
      >

        <div
          className="
            relative
            h-27.5
            w-27.5
            shrink-0
            overflow-hidden
            rounded-lg
            bg-neon-gray/40
          "
        >
          {game.image ? (
            <Image
              src={game.image}
              alt={game.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-neon-gray">
              GAME
            </div>
          )}
        </div>


        <div className="flex min-w-0 flex-1 flex-col justify-between self-stretch py-1">

          <div>

            <h2 className="truncate text-xl font-bold text-neon-white lg:text-2xl">
              {game.name}
            </h2>

            <div className="mt-1 flex flex-wrap items-center gap-4">

              <div className="flex items-center gap-1.5">

                <Image
                  src="/steam2.svg"
                  alt="Steam"
                  width={30}
                  height={30}
                />

                <span className="text-sm font-bold text-neon-white">
                  {game.platform}
                </span>

              </div>

              {/* Activation country */}
              <div className="flex items-center gap-1.5">

                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-neon-green text-xs text-neon-green">
                  ✓
                </span>

                <span className="text-sm text-neon-green lg:text-base">
                  Active in {game.activationCountry}
                </span>

              </div>

            </div>

          </div>

          {/* Purchase info */}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-neon-gray">

            <span>
              Purchased on: {game.purchaseDate}
            </span>

            <span className="text-neon-gray/60">
              |
            </span>

            <span>
              Order Id: {game.orderId}
            </span>

          </div>

        </div>

        <div className="flex w-full shrink-0 items-center sm:w-68.75">

          {game.keyRevealed ? (
            <div className="flex w-full items-center gap-2">

              <div className="flex h-10.5 flex-1 items-center justify-center rounded-md border border-neon-gray bg-neon-gray/10 px-3 text-sm font-medium text-neon-white">
                {game.key}
              </div>

              <button
                type="button"
                title="Copy key"
                onClick={() => {
                  if (game.key) {
                    navigator.clipboard.writeText(game.key);
                  }
                }}
                className="
                  flex
                  h-10.5
                  w-10.5
                  shrink-0
                  items-center
                  justify-center
                  rounded-md
                  border
                  border-neon-gray
                  bg-neon-gray/10
                  transition-colors
                  hover:bg-neon-white/10
                "
              >
                <Image
                  src="/white-copy-icon.svg"
                  alt="Copy key"
                  width={18}
                  height={18}
                />
              </button>

            </div>
          ) : (
            <div className="flex w-full flex-col gap-3">

              {/* Key ready */}
              <div className="flex items-center justify-end gap-2">

                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-neon-green text-xs text-neon-green">
                  ✓
                </span>

                <span className="text-sm font-medium text-neon-green lg:text-base">
                  Key ready
                </span>

              </div>

              {/* Reveal button — now opens confirmation modal */}
              <button
                type="button"
                onClick={onOpenRevealModal}
                className="
                  w-full
                  rounded-sm
                  bg-neon-gradient
                  px-5
                  py-2.5
                  text-xs
                  font-semibold
                  text-neon-white
                  transition-opacity
                  hover:opacity-90
                  lg:text-base
                "
              >
                REVEAL KEY
              </button>

            </div>
          )}

        </div>

      </div>

    </article>
  );
}