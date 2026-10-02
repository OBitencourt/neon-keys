"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ProfileSidebar } from "@/src/profile/profileSidebar";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  function isActive(path: string) {
    return pathname === path;
  }

  function handleLogout() {
    // Ligue aqui a chamada de logout do seu sistema de autenticação.
    router.push("/login");
  }

  return (
    <main className="min-h-screen bg-black px-4 py-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-350 gap-8">
        <aside className="hidden shrink-0 lg:block">
          <ProfileSidebar />
        </aside>

        <section className="min-w-0 flex-1">
          <nav
            aria-label="Profile navigation"
            className="mb-6 flex flex-col gap-2 lg:hidden"
          >
            {/* Os 3 botões na mesma linha */}
            <div className="grid grid-cols-3 gap-2">
              <Link
                href="/profile"
                className={`rounded-lg p-[1.5px] text-center text-[10px] sm:text-[11px] font-bold tracking-wide transition-opacity ${
                  isActive("/profile")
                    ? "bg-neon-gradient text-neon-white"
                    : "bg-neon-gray/30 text-neon-gray hover:opacity-80"
                }`}
              >
                <span
                  className={`flex items-center justify-center rounded-lg px-1 py-2.5 ${
                    isActive("/profile") ? "bg-transparent" : "bg-black"
                  }`}
                >
                  MY PROFILE
                </span>
              </Link>

              <Link
                href="/profile/mygames"
                className={`rounded-lg p-[1.5px] text-center text-[10px] sm:text-[11px] font-bold tracking-wide transition-opacity ${
                  isActive("/profile/mygames")
                    ? "bg-neon-gradient text-neon-white"
                    : "bg-neon-gray/30 text-neon-gray hover:opacity-80"
                }`}
              >
                <span
                  className={`flex items-center justify-center rounded-lg px-1 py-2.5 ${
                    isActive("/profile/mygames") ? "bg-transparent" : "bg-black"
                  }`}
                >
                  MY GAMES
                </span>
              </Link>

              <Link
                href="/profile/orders"
                className={`rounded-lg p-[1.5px] text-center text-[10px] sm:text-[11px] font-bold tracking-wide transition-opacity ${
                  isActive("/profile/orders")
                    ? "bg-neon-gradient text-neon-white"
                    : "bg-neon-gray/30 text-neon-gray hover:opacity-80"
                }`}
              >
                <span
                  className={`flex items-center justify-center rounded-lg px-1 py-2.5 ${
                    isActive("/profile/orders") ? "bg-transparent" : "bg-black"
                  }`}
                >
                  ORDERS
                </span>
              </Link>
            </div>

            {/* Botão de Logout separado abaixo */}
            <button
              type="button"
              onClick={handleLogout}
              className="w-full rounded-lg border border-neon-pink/70 px-3 py-2 text-[11px] font-bold tracking-wide text-neon-pink transition-colors hover:bg-neon-pink/10"
            >
              LOG OUT
            </button>
          </nav>

          {children}
        </section>
      </div>
    </main>
  );
}