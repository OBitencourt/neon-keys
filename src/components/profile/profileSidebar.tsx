"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "@/src/lib/auth-client";
import { ProfileNavItem } from "./profileNavItem";

interface ProfileSidebarProps {
  name: string;
  email: string;
  image: string | null;
}

export const ProfileSidebar = ({ name, email, image }: ProfileSidebarProps) => {
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

  console.log(image)

  return (
    <aside className="hidden w-71.5 shrink-0 lg:block">
      <div className="rounded-2xl bg-neon-gradient p-[1.5px]">
        <div className="overflow-hidden rounded-2xl bg-black">
          <div className="p-5">
            <div className="flex items-center gap-4">
              <div className="h-17 w-17 shrink-0 rounded-full bg-neon-gradient p-0.5">
                <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-neon-gray">
                  {image ? (
                    <Image
                      src={image}
                      alt={name}
                      fill
                      sizes="68px"
                      referrerPolicy="no-referrer"
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-3xl">🦊</span>
                  )}
                </div>
              </div>

              <div className="min-w-0">
                <h2 className="truncate text-lg font-bold text-neon-white">
                  {name}
                </h2>
                <p className="truncate text-sm text-neon-gray">{email}</p>
              </div>
            </div>
          </div>

          <nav className="flex flex-col">
            <ProfileNavItem
              href="/profile"
              icon="/pink-person.svg"
              label="Profile"
              active={pathname === "/profile"}
            />
            <ProfileNavItem
              href="/profile/mygames"
              icon="/pink-controller.svg"
              label="My Games"
              active={pathname === "/profile/mygames"}
            />
            <ProfileNavItem
              href="/profile/orders"
              icon="/pink-paper.svg"
              label="Orders"
              active={pathname === "/profile/orders"}
            />

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-4 px-5 py-3.5 text-left text-base text-neon-white transition-colors hover:bg-neon-white/5"
            >
              <Image src="/pink-logout.svg" alt="" width={23} height={23} />
              <span>Log out</span>
            </button>
          </nav>

          <div className="mx-5 my-4 h-px bg-neon-gray/40" />

          <div className="p-5 pt-1">
            <h3 className="text-base font-bold text-neon-pink">NEED HELP?</h3>
            <p className="mt-1 text-xs leading-relaxed text-neon-gray">
              Our support team is ready to help you!
            </p>

            <Link
              href="/support"
              className="mt-3 flex w-full items-center justify-center gap-3 rounded-lg bg-neon-gradient p-[1.5px]"
            >
              <span className="flex w-full items-center justify-center gap-3 rounded-lg bg-black px-4 py-3 text-sm font-semibold text-neon-white transition-opacity hover:opacity-50">
                <Image src="/pink-headset.svg" alt="" width={19} height={19} />
                OPEN TICKET
              </span>
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
};
