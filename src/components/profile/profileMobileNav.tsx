"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "@/src/lib/auth-client";
import LogoutButton from "./logoutButton";

const links = [
  { href: "/profile", label: "MY PROFILE" },
  { href: "/profile/mygames", label: "MY GAMES" },
  { href: "/profile/orders", label: "ORDERS" },
];

export default function ProfileMobileNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
          router.refresh();
        },
      },
    });
  }

  return (
    <nav
      aria-label="Profile navigation"
      className="mb-6 flex flex-col gap-2 lg:hidden"
    >
      <div className="grid grid-cols-3 gap-2">
        {links.map(({ href, label }) => {
          const active = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              className={`rounded-lg p-[1.5px] text-center text-[10px] font-bold tracking-wide transition-opacity sm:text-[11px] ${
                active
                  ? "bg-neon-gradient text-neon-white"
                  : "bg-neon-gray/30 text-neon-gray hover:opacity-80"
              }`}
            >
              <span
                className={`flex items-center justify-center rounded-lg px-1 py-2.5 ${
                  active ? "bg-transparent" : "bg-black"
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>

      <LogoutButton handleLogout={handleLogout} />
    </nav>
  );
}