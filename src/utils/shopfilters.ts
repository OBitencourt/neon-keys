import type { GameGenre } from "../types/product";

export interface ShopFilterState {
  category: string;
  genres: GameGenre[];
  platforms: string[];
  priceRange: [number, number];
}

export const defaultFilters: ShopFilterState = {
  category: "All Products",
  genres: [],
  platforms: [],
  priceRange: [0, 500],
};

export const PRICE_MIN = 0;
export const PRICE_MAX = 500;

export const categoryOptions = [
  { label: "All Products", count: 120 },
  { label: "Steam Games", count: 62 },
  { label: "Epic Games", count: 18 },
  { label: "Xbox Games", count: 16 },
  { label: "Playstation Games", count: 12 },
  { label: "Gift Cards", count: 12 },
];

export const genreOptions: { label: GameGenre; count: number }[] = [
  { label: "Action", count: 28 },
  { label: "Adventure", count: 17 },
  { label: "RPG", count: 20 },
  { label: "Racing", count: 9 },
  { label: "Simulation", count: 11 },
  { label: "Sports", count: 7 },
  { label: "Strategy", count: 8 },
  { label: "Other", count: 20 },
];

export const platformOptions = [
  { label: "Steam", count: 62 },
  { label: "Epic Games", count: 18 },
  { label: "Xbox", count: 16 },
  { label: "Playstation", count: 12 },
  { label: "Other", count: 12 },
];
