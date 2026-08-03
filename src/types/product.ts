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
}