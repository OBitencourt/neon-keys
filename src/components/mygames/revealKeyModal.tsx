import { OwnedGame } from "@/src/types/ownedGame";
import Image from "next/image";
import { useState } from "react";

export default function RevealKeyModal({
  game,
  onClose,
  onConfirm,
}: {
  game: OwnedGame;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const [confirmed, setConfirmed] = useState(false);
  const maskedKey =
    game.key
      ?.split("-")
      .map((segment) => "*".repeat(segment.length))
      .join("-") ?? "*****-*****-*****";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4"
      onClick={onClose}
    >

      <div
        className="w-full max-w-xl rounded-xl bg-neon-gradient p-0.5"
        onClick={(e) => e.stopPropagation()}
      >

        <div className="rounded-xl bg-black p-6">


          <div className="flex items-start justify-between">

            <h2 className="text-xl font-bold text-neon-white">
              Reveal your game key
            </h2>

            <button
              type="button"
              onClick={onClose}
              className="text-neon-gray transition-colors hover:text-neon-white"
              title="Close"
            >
              ✕
            </button>

          </div>

          <div className="mt-4 flex items-center gap-3">

            <div className="relative h-30 w-30 shrink-0 overflow-hidden rounded-lg bg-neon-gray/40">
              {game.image ? (
                <Image
                  src={game.image}
                  alt={game.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-neon-gray">
                  GAME
                </div>
              )}
            </div>

            <div className="min-w-0">

              <h3 className="truncate text-base font-bold text-neon-white">
                {game.name}
              </h3>

              <div className="mt-1 flex flex-wrap items-center gap-3">

                <div className="flex items-center gap-1.5">
                  <Image src="/steam.svg" alt="Steam" width={14} height={14} />
                  <span className="text-xs font-bold text-neon-white">
                    {game.platform}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full border border-neon-green text-[10px] text-neon-green">
                    ✓
                  </span>
                  <span className="text-xs text-neon-green">
                    Active in {game.activationCountry}
                  </span>
                </div>

              </div>

            </div>

          </div>

          <p className="mt-3 text-xs text-neon-gray">
            Before revealing your key, please confirm the activation details below.
          </p>

          <div className="mt-4 rounded-md border border-neon-gray/40 px-4 py-3">

            <div className="flex items-center justify-between text-sm">
              <span className="text-neon-gray">Platform</span>
              <span className="font-medium text-neon-white">{game.platform}</span>
            </div>

            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-neon-gray">Region</span>
              <span className="font-medium text-neon-white">{game.activationCountry}</span>
            </div>

          </div>
          <div className="mt-4">

            <p className="mb-1 text-xs text-neon-gray">Your Key</p>

            <div className="flex h-10.5 items-center justify-center rounded-md border border-neon-gray/40 bg-neon-gray/10 text-sm tracking-widest text-neon-white">
              {maskedKey}
            </div>

          </div>


          <div className="mt-4 flex items-start gap-2 rounded-md border border-orange-500/60 bg-orange-500/10 px-4 py-3">

            <span className="mt-0.5 text-orange-400">⚠</span>

            <p className="text-md text-neon-white">
              <span className="font-bold">Important:</span> Once this key is revealed,
              the order cannot be refunded unless the key is invalid.
            </p>

          </div>

          <label className="mt-4 flex cursor-pointer items-start gap-2 text-xs text-neon-white">

            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-neon-green"
            />

            <span>
              I confirm that my <span className="font-bold underline">{game.platform}</span> account
              is registered in <span className="font-bold underline">{game.activationCountry}</span> and
              this key is compatible with my region.
            </span>

          </label>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">

            <button
              type="button"
              onClick={onClose}
              className="
                flex-1
                rounded-md
                border
                border-neon-gray
                px-5
                py-2.5
                text-sm
                font-bold
                text-neon-white
                transition-colors
                hover:bg-neon-white/10
              "
            >
              CANCEL
            </button>

            <button
              type="button"
              disabled={!confirmed}
              onClick={onConfirm}
              className="
                flex-1
                rounded-md
                bg-neon-gradient
                px-5
                py-2.5
                text-sm
                font-bold
                text-neon-white
                transition-opacity
                hover:opacity-90
                disabled:cursor-not-allowed
                disabled:opacity-40
                disabled:hover:opacity-40
              "
            >
              I UNDERSTAND — REVEAL MY KEY
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}