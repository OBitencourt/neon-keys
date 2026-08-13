"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { ProfileSidebar } from "@/src/components/profileSidebar";
import { initialCartItems } from "@/src/utils/cartmock";

type OwnedGame = {
  id: string;
  name: string;
  image?: string;
  platform: string;
  activationCountry: string;
  purchaseDate: string;
  orderId: string;
  key?: string;
  keyRevealed: boolean;
};

const initialGames: OwnedGame[] = [
  {
    id: initialCartItems[0].product.id,
    name: initialCartItems[0].product.name,
    image: initialCartItems[0].product.image,
    platform: "STEAM",
    activationCountry: "Brazil",
    purchaseDate: "May 14, 2026",
    orderId: "#NK78213",
    key: "3NXS-POLO-A2SD",
    keyRevealed: true,
  },
  {
    id: initialCartItems[1].product.id,
    name: initialCartItems[1].product.name,
    image: initialCartItems[1].product.image,
    platform: "STEAM",
    activationCountry: "Argentina",
    purchaseDate: "May 11, 2026",
    orderId: "#NK78125",
    key: "XXXX-XXXX-XXXX",
    keyRevealed: false,
  },
];

export default function GamesPage() {
  const [games, setGames] = useState<OwnedGame[]>(initialGames);
  const [modalGame, setModalGame] = useState<OwnedGame | null>(null);

  function revealKey(gameId: string) {
    setGames((prev) =>
      prev.map((game) =>
        game.id === gameId
          ? {
              ...game,
              keyRevealed: true,
            }
          : game
      )
    );
  }

  function handleConfirmReveal() {
    if (!modalGame) return;
    revealKey(modalGame.id);
    setModalGame(null);
  }

  return (
    <main className="min-h-screen bg-black px-4 py-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-350 gap-8">

        <ProfileSidebar />

        <section className="min-w-0 flex-1">

          {/* ================================================= */}
          {/* HEADER */}
          {/* ================================================= */}

          <header className="mb-8">

            <h1 className="text-4xl font-bold text-neon-white lg:text-5xl">
              Welcome back, Neon Player
            </h1>

            <p className="mt-1 text-sm text-neon-gray lg:text-base">
              here you can find all the games you have purchased
            </p>

          </header>

          {/* ================================================= */}
          {/* GAMES */}
          {/* ================================================= */}

          <div className="flex flex-col gap-4">

            {games.length > 0 ? (
              games.map((game) => (
                <OwnedGameCard
                  key={game.id}
                  game={game}
                  onOpenRevealModal={() => setModalGame(game)}
                />
              ))
            ) : (
              <EmptyGames />
            )}

          </div>

          <ActivationGuide />

        </section>

      </div>

      {/* ================================================= */}
      {/* REVEAL KEY MODAL */}
      {/* ================================================= */}

      {modalGame && (
        <RevealKeyModal
          game={modalGame}
          onClose={() => setModalGame(null)}
          onConfirm={handleConfirmReveal}
        />
      )}

    </main>
  );
}


/* ================================================= */
/* GAME CARD */
/* ================================================= */

function OwnedGameCard({
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

        {/* ================================================= */}
        {/* GAME IMAGE */}
        {/* ================================================= */}

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


/* ================================================= */
/* REVEAL KEY MODAL */
/* ================================================= */

function RevealKeyModal({
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

          {/* ================================================= */}
          {/* GAME INFO */}
          {/* ================================================= */}

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

          {/* ================================================= */}
          {/* PLATFORM / REGION BOX */}
          {/* ================================================= */}

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

          {/* ================================================= */}
          {/* MASKED KEY */}
          {/* ================================================= */}

          <div className="mt-4">

            <p className="mb-1 text-xs text-neon-gray">Your Key</p>

            <div className="flex h-10.5 items-center justify-center rounded-md border border-neon-gray/40 bg-neon-gray/10 text-sm tracking-widest text-neon-white">
              {maskedKey}
            </div>

          </div>

          {/* ================================================= */}
          {/* WARNING */}
          {/* ================================================= */}

          <div className="mt-4 flex items-start gap-2 rounded-md border border-orange-500/60 bg-orange-500/10 px-4 py-3">

            <span className="mt-0.5 text-orange-400">⚠</span>

            <p className="text-md text-neon-white">
              <span className="font-bold">Important:</span> Once this key is revealed,
              the order cannot be refunded unless the key is invalid.
            </p>

          </div>

          {/* ================================================= */}
          {/* CONFIRM CHECKBOX */}
          {/* ================================================= */}

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

          {/* ================================================= */}
          {/* ACTIONS */}
          {/* ================================================= */}

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


/* ================================================= */
/* ACTIVATION GUIDE */
/* ================================================= */

function ActivationGuide() {
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


/* ================================================= */
/* EMPTY STATE */
/* ================================================= */

function EmptyGames() {
  return (
    <div className="rounded-xl bg-neon-gradient p-[1.5px]">

      <div className="flex flex-col items-center justify-center rounded-xl bg-black px-6 py-16 text-center">

        <h2 className="text-xl font-bold text-neon-white">
          You haven't purchased any games yet
        </h2>

        <p className="mt-2 text-sm text-neon-gray">
          Your purchased games and keys will appear here.
        </p>

        <Link
          href="/shop"
          className="mt-6 rounded-lg bg-neon-gradient px-6 py-3 text-sm font-bold text-neon-white transition-opacity hover:opacity-90"
        >
          BROWSE GAMES
        </Link>

      </div>

    </div>
  );
}