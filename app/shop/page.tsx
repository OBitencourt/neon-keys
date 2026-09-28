"use client";

import { useMemo, useState } from "react";
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
      // ex: "Steam Games" -> "Steam"
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
      return sorted; // "best-selling" mantém a ordem original (mock)
  }
}

export default function ShopPage() {
  const [filters, setFilters] = useState<ShopFilterState>(defaultFilters);
  const [sortBy, setSortBy] = useState("best-selling");

  const filteredProducts = useMemo(
    () => sortProducts(applyFilters(mockProducts, filters), sortBy),
    [filters, sortBy]
  );

  return (
    <div className="bg-black min-h-screen">
      <ShopBanner />

      <div className="px-36 pb-16 max-w-450 mx-auto flex flex-col md:flex-row gap-8 items-start">
        <ShopFilters onChange={setFilters} />

        <div className="flex-1 w-full">
          {/* Barra superior: contagem de resultados + Sort by */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-neon-gray text-sm">
              Showing {filteredProducts.length} of {mockProducts.length}+ results
            </p>

            <div className="bg-neon-gradient rounded-lg p-0.5">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-black text-neon-white text-md rounded-lg px-4 py-2 outline-none appearance-none cursor-pointer"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-black">
                    Sort by: {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}