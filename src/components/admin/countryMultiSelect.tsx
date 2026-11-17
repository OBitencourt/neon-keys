"use client";

import { useEffect, useMemo, useRef, useState } from "react";

interface CountryMultiSelectProps {
  label: string;
  hint?: string;
  value: string[];
  options: readonly string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  inputClass: string;
  labelClass: string;
}

const names =
  typeof Intl !== "undefined" && "DisplayNames" in Intl
    ? new Intl.DisplayNames(["en"], { type: "region" })
    : null;

function countryName(code: string) {
  try {
    return names?.of(code) ?? code;
  } catch {
    return code;
  }
}

export default function CountryMultiSelect({
  label,
  hint,
  value,
  options,
  onChange,
  placeholder = "Search country...",
  inputClass,
  labelClass,
}: CountryMultiSelectProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const selected = useMemo(() => new Set(value), [value]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return options
      .map((code) => ({ code, name: countryName(code) }))
      .filter(
        ({ code, name }) =>
          !q || code.toLowerCase().includes(q) || name.toLowerCase().includes(q),
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [options, query]);

  function toggle(code: string) {
    onChange(
      selected.has(code) ? value.filter((c) => c !== code) : [...value, code].sort(),
    );
  }

  return (
    <div ref={rootRef} className="relative">
      <label className={labelClass}>{label}</label>

      {value.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {value.map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => toggle(code)}
              title={`Remove ${countryName(code)}`}
              className="rounded-full border border-neon-pink/40 bg-neon-pink/10 px-2.5 py-1 text-xs text-neon-white transition hover:bg-neon-pink/25"
            >
              {code} ✕
            </button>
          ))}
          <button
            type="button"
            onClick={() => onChange([])}
            className="px-2 text-xs text-neon-gray underline hover:text-neon-pink"
          >
            Clear
          </button>
        </div>
      )}

      <input
        className={inputClass}
        placeholder={placeholder}
        value={query}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
      />

      {open && (
        <ul className="absolute z-20 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-white/10 bg-zinc-950 py-1 shadow-xl">
          {filtered.length === 0 && (
            <li className="px-4 py-2 text-sm text-neon-gray">No countries found</li>
          )}
          {filtered.map(({ code, name }) => (
            <li key={code}>
              <button
                type="button"
                onClick={() => toggle(code)}
                className="flex w-full items-center justify-between px-4 py-2 text-left text-sm text-neon-white transition hover:bg-white/5"
              >
                <span>
                  {name} <span className="text-neon-gray">({code})</span>
                </span>
                {selected.has(code) && <span className="text-neon-pink">✓</span>}
              </button>
            </li>
          ))}
        </ul>
      )}

      {hint && <p className="mt-2 text-xs text-neon-gray">{hint}</p>}
    </div>
  );
}