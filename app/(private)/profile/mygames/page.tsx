
"use client";

import Link from "next/link";

import ActivationGuide from "@/src/components/activationGuide";

export default function MyGamesPage() {
  // TODO: Buscar os jogos comprados pelo usuário autenticado.
  // Os dados virão dos pedidos concluídos no MongoDB.

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-neon-white lg:text-5xl">
          Welcome back, Neon Player
        </h1>

        <p className="mt-1 text-sm text-neon-gray lg:text-base">
          Here you can find all the games you have purchased
        </p>
      </header>

      <div className="flex flex-col gap-4">
        <EmptyGames />
      </div>

      <ActivationGuide />
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
