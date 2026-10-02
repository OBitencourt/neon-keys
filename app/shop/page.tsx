"use client";

import { useEffect, useMemo, useState } from "react";
import ShopBanner from "../../src/components/shop/shopbanner";
import ShopFilters from "../../src/components/shop/shopFilters";
import ProductCard from "../../src/components/productcard";
import type { Product } from "../../src/types/product";
import { ShopFilterState, defaultFilters } from "../../src/utils/shopfilters";
import { mockProducts } from "../../src/mocks/mockProducts";

// Mock — troque por dados vindos da sua API/banco quando estiver pronto.

const sortOptions = [
  { value: "best-selling", label: "Best selling" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name-asc", label: "Name: A to Z" },
];

function applyFilters(products: Product[], filters: ShopFilterState) {
  return products.filter((p) => {
    if (filters.category !== "All Products" && filters.category !== "Gift Cards") {
      const platformFromCategory = filters.category.replace(" Games", "");
      if (p.platform !== platformFromCategory) return false;
    }
    if (filters.genres.length > 0 && !filters.genres.includes(p.genre)) return false;
    if (filters.platforms.length > 0 && !filters.platforms.includes(p.platform)) return false;
    if (p.price < filters.priceRange[0] || p.price > filters.priceRange[1]) return false;
    return true;
  });
}

function sortProducts(products: Product[], sortBy: string) {
  const sorted = [...products];
  switch (sortBy) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "name-asc":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return sorted;
  }
}

export default function ShopPage() {
  const [filters, setFilters] = useState<ShopFilterState>(defaultFilters);
  const [sortBy, setSortBy] = useState("best-selling");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filteredProducts = useMemo(
    () => sortProducts(applyFilters(mockProducts, filters), sortBy),
    [filters, sortBy]
  );

  // Trava o scroll da página enquanto o modal de filtros está aberto (mobile)
  useEffect(() => {
    document.body.style.overflow = filtersOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [filtersOpen]);

  return (
    <div className="bg-black min-h-screen">
      <ShopBanner />

      <div className="px-4 pb-16 sm:px-8 md:px-16 lg:px-36 max-w-420 mx-auto flex flex-col md:flex-row gap-6 md:gap-8 items-start">
        <div
          onClick={() => setFiltersOpen(false)}
          className={`${
            filtersOpen
              ? "fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
              : "hidden"
          } md:contents md:z-auto md:bg-transparent md:p-0`}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative mx-auto w-full max-w-sm max-h-[85vh] overflow-y-auto md:contents md:max-h-none"
          >
            {/* Botão de fechar — só aparece no modal mobile */}
            <button
              type="button"
              onClick={() => setFiltersOpen(false)}
              aria-label="Fechar filtros"
              className="absolute right-0.5 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-neon-gradient text-lg font-bold text-neon-white shadow-lg md:hidden"
            >
              ×
            </button>

            <ShopFilters onChange={setFilters} />
          </div>
        </div>

        <div className="w-full min-w-0 flex-1">
          {/* Barra superior: contagem de resultados + Sort by */}
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-end text-neon-gray">
              Showing {filteredProducts.length} of {mockProducts.length}+ results
            </p>

            <div className="self-end rounded-lg bg-neon-gradient p-0.5 sm:self-auto">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="cursor-pointer appearance-none rounded-lg bg-black px-3 py-2 text-sm text-neon-white outline-none sm:px-4 sm:text-md"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-black">
                    Sort by: {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4 lg:gap-10">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>

      {/* Botão flutuante de filtros — mobile apenas */}
      <button
        type="button"
        onClick={() => setFiltersOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-neon-gradient px-5 py-3 text-sm font-semibold text-neon-white shadow-[0_0_20px_rgba(249,11,163,0.5)] md:hidden"
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
          <path d="M4 6h16M7 12h10M10 18h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        Filters
      </button>
    </div>
  );
}
