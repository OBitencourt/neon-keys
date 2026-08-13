import Image from "next/image";

export function FilterSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="relative">

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          h-11
          w-full
          appearance-none
          rounded-md
          border
          border-neon-gray/40
          bg-black
          pl-4
          pr-9
          text-sm
          text-neon-white
          outline-none
          focus:border-neon-pink
          sm:w-44
        "
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-black text-neon-white">
            {opt.label}
          </option>
        ))}
      </select>

      <Image
        src="/icons/chevron-down-icon.svg"
        alt=""
        width={16}
        height={16}
        className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2"
      />

    </div>
  );
}