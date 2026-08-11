import Image from "next/image";
import Link from "next/link";
import { ProfileNavItem } from "./profileNavItem";

export const ProfileSidebar = () => {


  function handleLogout() {
    /*
     * FUTURO:
     *
     * await logout();
     * router.push("/login");
     */
  }

  return (
    <aside className="hidden w-71.5 shrink-0 lg:block">
      <div className="rounded-2xl bg-neon-gradient p-[1.5px]">
        <div className="overflow-hidden rounded-2xl bg-black">
          {/* User */}
          <div className="p-5">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="h-17 w-17 shrink-0 rounded-full bg-neon-gradient p-0.5">
                <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-neon-gray">
                  {/* PLACEHOLDER DO AVATAR */}
                  <span className="text-3xl">🦊</span>
                </div>
              </div>

              <div className="min-w-0">
                <h2 className="truncate text-lg font-bold text-neon-white">
                  Neon Player
                </h2>

                <p className="truncate text-sm text-neon-gray">
                  neonplayer@gmail.com
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col">
            <ProfileNavItem
              href="/profile"
              icon="/pink-person.svg"
              label="Profile"
              active
            />

            <ProfileNavItem
              href="/games"
              icon="/pink-controller.svg"
              label="My Games"
            />

            <ProfileNavItem
              href="/orders"
              icon="/pink-paper.svg"
              label="Orders"
            />

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              className="
                    flex
                    items-center
                    gap-4
                    px-5
                    py-3.5
                    text-left
                    text-base
                    text-neon-white
                    transition-colors
                    hover:bg-neon-white/5
                  "
            >
              <Image src="/pink-logout.svg" alt="" width={23} height={23} />

              <span>Log out</span>
            </button>
          </nav>

          {/* Divider */}
          <div className="mx-5 my-4 h-px bg-neon-gray/40" />

          {/* Help */}
          <div className="p-5 pt-1">
            <h3 className="text-base font-bold text-neon-pink">NEED HELP?</h3>

            <p className="mt-1 text-xs leading-relaxed text-neon-gray">
              Our support team is ready to help you!
            </p>

            <Link
              href="/support"
              className="
                    mt-3
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-3
                    rounded-lg
                    bg-neon-gradient
                    p-[1.5px]
                  "
            >
              <span
                className="
                      flex
                      w-full
                      items-center
                      justify-center
                      gap-3
                      rounded-lg
                      bg-black
                      px-4
                      py-3
                      text-sm
                      font-semibold
                      text-neon-white
                      transition-opacity
                      hover:opacity-50
                    "
              >
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
