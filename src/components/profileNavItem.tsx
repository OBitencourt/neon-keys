import Image from "next/image";
import Link from "next/link";

export function ProfileNavItem({
  href,
  icon,
  label,
  active = false,
}: {
  href: string;
  icon: string;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`
        relative
        flex
        items-center
        gap-4
        px-5
        py-3.5
        text-base
        transition-colors
        ${
          active
            ? "bg-neon-gradient/20 text-neon-white"
            : "text-neon-white hover:bg-neon-white/5"
        }
      `}
    >
      {active && (
        <span className="absolute inset-0 bg-neon-gradient opacity-20" />
      )}

      <Image
        src={icon}
        alt=""
        width={23}
        height={23}
        className="relative z-10 shrink-0"
      />
      <span className="relative z-10">{label}</span>
    </Link>
  );
}
