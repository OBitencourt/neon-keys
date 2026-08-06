"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import ShopBanner from "../../src/components/shopbanner";
import ShopFilters from "../../src/components/shopFilters";
import ProductCard from "../../src/components/productcard";
import type { Product } from "../../src/types/product"; 
import { ShopFilterState, defaultFilters } from "../../src/utils/shopfilters";
import { mockProducts } from "../../src/utils/mockProducts";
import Link from "next/link";

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

  const isFiltering =
    filters.category !== defaultFilters.category ||
    filters.genres.length > 0 ||
    filters.platforms.length > 0 ||
    filters.priceRange[0] !== defaultFilters.priceRange[0] ||
    filters.priceRange[1] !== defaultFilters.priceRange[1];

  const filteredProducts = useMemo(
    () => sortProducts(applyFilters(mockProducts, filters), sortBy),
    [filters, sortBy]
  );

  // Seções curadas, exibidas só quando nenhum filtro está ativo
  const bestSellers = sortProducts(mockProducts.slice(0, 4), sortBy);
  const pcGames = sortProducts(mockProducts.filter((p) => p.platform === "Steam").slice(0, 4), sortBy);
  const actionGames = sortProducts(mockProducts.filter((p) => p.genre === "Action").slice(0, 4), sortBy);

  return (
    <div className="bg-black min-h-screen">
      <ShopBanner />

      <div className="px-8 pb-16 max-w-450 mx-auto flex flex-col md:flex-row gap-8 items-start">
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

          {isFiltering ? (
            // Resultado filtrado — grid único
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            // Sem filtro ativo — seções curadas
            <div className="flex flex-col gap-12">
              <ShopSection image="/icons-shop-5.svg" title="BEST SELLERS" products={bestSellers} />
              <ShopSection image="/icons-shop-6.svg" title="PC GAMES" products={pcGames} />
              <ShopSection image="/icons-shop-7.svg" title="ACTION GAMES" products={actionGames} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface ShopSectionProps {
  image: string;
  title: string;
  products: Product[];
}

export  function ShopSection({ image, title, products }: ShopSectionProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3 mb-6">
          <Image src={image} alt={title} width={40} height={40} />
          <h2 className="text-neon-white font-regular font-inder text-2xl">{title}</h2>
        </div>
        <a href="#" className="text-neon-pink text-sm hover:underline">
          view all
        </a>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

