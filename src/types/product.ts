export type GameGenre =
  | "Action"
  | "Adventure"
  | "RPG"
  | "Racing"
  | "Simulation"
  | "Sports"
  | "Strategy"
  | "Other";

export interface Product {
  id: string;
  name: string;
  image: string;
  platform: string;
  price: number;
  originalPrice?: number;
  genre: GameGenre;
  region: string;
  rating: number;
  reviewsCount: number;
  description: string;
  type: string;
  delivery: string;
  allowedCountries: string[];
  gallery?: string[];
  stockStatus?: string;
}
