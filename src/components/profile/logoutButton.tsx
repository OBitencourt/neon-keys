"use client"

import Link from "next/link";

interface LogoutButtonProps {
  handleLogout: () => void;
}

const LogoutButton = ({ handleLogout }: LogoutButtonProps) => {
  return (
    <Link
      type="button"
      onClick={handleLogout}
      href="/login"
      className="w-full rounded-lg border text-center border-neon-pink/70 px-3 py-2 text-[11px] font-bold tracking-wide text-neon-pink transition-colors hover:bg-neon-pink/10"
    >
      LOG OUT
    </Link>
  );
};

export default LogoutButton;