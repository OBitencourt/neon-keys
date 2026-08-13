"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { GameGenre } from "../types/product";
import {
  ShopFilterState,
  defaultFilters,
  PRICE_MIN,
  PRICE_MAX,
  categoryOptions,
  genreOptions,
  platformOptions,
} from "../utils/shopfilters";

interface ShopFiltersProps {
  onChange: (filters: ShopFilterState) => void;
}

export default function ShopFilters({ onChange }: ShopFiltersProps) {
  const [category, setCategory] = useState(defaultFilters.category);
  const [genres, setGenres] = useState<GameGenre[]>(defaultFilters.genres);
  const [platforms, setPlatforms] = useState<string[]>(
    defaultFilters.platforms,
  );
  const [priceRange, setPriceRange] = useState<[number, number]>(
    defaultFilters.priceRange,
  );

  useEffect(() => {
    onChange({ category, genres, platforms, priceRange });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, genres, platforms, priceRange]);

  function toggleGenre(genre: GameGenre) {
    setGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre],
    );
  }

  function togglePlatform(platform: string) {
    setPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform],
    );
  }

  function resetFilters() {
    setCategory(defaultFilters.category);
    setGenres(defaultFilters.genres);
    setPlatforms(defaultFilters.platforms);
    setPriceRange(defaultFilters.priceRange);
  }

  return (
    <aside className="bg-neon-gradient w-full max-w-xs rounded-2xl p-[1.5px] h-fit">
      <div className="rounded-2xl bg-black flex flex-col gap-8">
        <div>
          <div className="flex px-6 pt-6 items-center gap-2 mb-6">
            <Image
              src="/icons-shop-1.svg"
              alt="Categories"
              width={30}
              height={30}
            />
            <h3 className="text-white font-inder text-lg font-regular tracking-wide">
              CATEGORIES
            </h3>
          </div>

          <ul className="flex flex-col gap-1">
            {categoryOptions.map((opt) => {
              const active = category === opt.label;
              return (
                <li key={opt.label}>
                  <button
                    type="button"
                    onClick={() => setCategory(opt.label)}
                    className={`w-full flex items-center justify-between text-white px-6 py-4 font-regular text-md transition-colors ${
                      active
                        ? "bg-linear-to-r from-neon-pink/30 via-neon-pink/30 to-black text-neon-pink border-l-2 border-neon-pink "
                        : "hover:text-neon-white/80"
                    }`}
                  >
                    <span>{opt.label}</span>
                    <span className="text-neon-gray text-xs">
                      ({opt.count})
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <div className="flex px-6 pt-6 items-center gap-3 mb-6">
            <Image
              src="/icons-shop-2.svg"
              alt="Genres"
              width={30}
              height={30}
            />
            <h3 className="text-white font-inder text-lg font-regular tracking-wide">
              GENRES
            </h3>
          </div>
          <ul className="flex flex-col gap-2">
            {genreOptions.map((opt) => (
              <li key={opt.label} className="px-6 py-0.5">
                <label className="flex items-center justify-between gap-2 text-sm text-neon-white/80 cursor-pointer">
                  <span className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={genres.includes(opt.label)}
                      onChange={() => toggleGenre(opt.label)}
                      className="accent-neon-pink w-4 h-4"
                    />
                    {opt.label}
                  </span>
                  <span className="text-neon-gray text-xs">({opt.count})</span>
                </label>
              </li>
            ))}
          </ul>
        </div>

        <div className="px-6">
          <div className="flex pt-6 items-center gap-3 mb-6">
            <Image
              src="/icons-shop-3.svg"
              alt="Price Range"
              width={30}
              height={30}
            />
            <h3 className="text-white font-inder text-lg font-regular tracking-wide">
              PRICE RANGE
            </h3>
          </div>
          <div className="relative h-6 flex items-center ">
            {/* Trilho */}
            <div className="absolute left-0 right-0 h-1 rounded-full bg-neon-white/15" />
            {/* Trilho ativo entre os dois valores */}
            <div
              className="absolute h-1 rounded-full bg-neon-gradient"
              style={{
                left: `${(priceRange[0] / PRICE_MAX) * 100}%`,
                right: `${100 - (priceRange[1] / PRICE_MAX) * 100}%`,
              }}
            />
            <input
              type="range"
              min={PRICE_MIN}
              max={PRICE_MAX}
              value={priceRange[0]}
              onChange={(e) =>
                setPriceRange([
                  Math.min(Number(e.target.value), priceRange[1] - 1),
                  priceRange[1],
                ])
              }
              className="absolute w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-neon-pink"
            />
            <input
              type="range"
              min={PRICE_MIN}
              max={PRICE_MAX}
              value={priceRange[1]}
              onChange={(e) =>
                setPriceRange([
                  priceRange[0],
                  Math.max(Number(e.target.value), priceRange[0] + 1),
                ])
              }
              className="absolute w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-neon-orange"
            />
          </div>
          <div className="flex justify-between text-neon-white/80 text-xs mt-2">
            <span>R${priceRange[0]}</span>
            <span>R${priceRange[1]}</span>
          </div>
        </div>

        <div>
          <div className="flex px-6 pt-6 items-center gap-3 mb-6">
            <Image
              src="/icons-shop-4.svg"
              alt="Platform"
              width={30}
              height={30}
            />
            <h3 className="text-white font-inder text-lg font-regular tracking-wide">
              PLATFORM
            </h3>
          </div>
          <ul className="flex flex-col gap-2 px-6">
            {platformOptions.map((opt) => (
              <li key={opt.label}>
                <label className="flex items-center justify-between gap-2 text-sm text-neon-white/80 cursor-pointer">
                  <span className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={platforms.includes(opt.label)}
                      onChange={() => togglePlatform(opt.label)}
                      className="accent-neon-pink w-4 h-4"
                    />
                    {opt.label}
                  </span>
                  <span className="text-neon-gray text-xs">({opt.count})</span>
                </label>
              </li>
            ))}
          </ul>
        </div>

        <div className="px-2 pb-2">

            <div className="bg-neon-gradient p-0.5 rounded-xl w-full">
            <button
                type="button"
                onClick={resetFilters}
                className="group relative overflow-hidden flex w-full items-center justify-center gap-4 bg-black text-neon-white font-medium py-3 rounded-xl transition-colors"
            >
                {/* Camada de overlay */}
                <span
                className="absolute inset-0 bg-neon-gradient opacity-0 group-hover:opacity-50 group-active:opacity-70 transition-opacity duration-300"
                aria-hidden="true"
                />

                <span className="relative flex items-center justify-center gap-4">
                <Image
                    src="/reload2.svg"
                    alt="Reset Filters"
                    width={20}
                    height={20}
                />
                <span>RESET FILTERS</span>
                </span>
            </button>
            </div>
        </div>
      </div>
    </aside>
  );
}
