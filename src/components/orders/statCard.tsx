import Image from "next/image";

export function StatCard({
  label,
  value,
  color,
  iconSrc,
}: {
  label: string;
  value: string;
  color: "pink" | "green" | "orange";
  iconSrc: string;
}) {
  const borderColor =
    color === "pink"
      ? "border-neon-pink"
      : color === "green"
      ? "border-neon-green"
      : "border-orange-500";

  return (
    <div className={`rounded-lg border ${borderColor} bg-black px-5 py-4`}>

      <div className="flex items-center gap-3">

        <Image src={iconSrc} alt="" width={24} height={24} />

        <div>

          <p className="text-xs font-medium tracking-wide text-neon-gray">
            {label}
          </p>

          <p className="mt-0.5 text-2xl font-bold text-neon-white">
            {value}
          </p>

        </div>

      </div>

    </div>
  );
}