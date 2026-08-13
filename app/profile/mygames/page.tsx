"use client";

import Link from "next/link";
import { useState } from "react";

import type { OwnedGame } from "@/src/types/ownedGame";

import { initialCartItems } from "@/src/utils/cartmock";

import { ProfileSidebar } from "@/src/components/profileSidebar";

import OwnedGameCard from "@/src/components/mygames/ownedGameCard";
import RevealKeyModal from "@/src/components/mygames/revealKeyModal";
import ActivationGuide from "@/src/components/activationGuide";

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

export default function MyGamesPage() {
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
          : game,
      ),
    );
  }

  function handleConfirmReveal() {
    if (!modalGame) return;
    revealKey(modalGame.id);
    setModalGame(null);
  }

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-neon-white lg:text-5xl">
          Welcome back, Neon Player
        </h1>

        <p className="mt-1 text-sm text-neon-gray lg:text-base">
          here you can find all the games you have purchased
        </p>
      </header>

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

      {modalGame && (
        <RevealKeyModal
          game={modalGame}
          onClose={() => setModalGame(null)}
          onConfirm={handleConfirmReveal}
        />
      )}
    </div>
  );
}

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
