export type GameGenre =
  | "Action"
  | "Adventure"
  | "RPG"
  | "Racing"
  | "Simulation"
  | "Sports"
  | "Strategy"
  | "Other";

export type ProductStockStatus = "in_stock" | "out_of_stock" | "unknown";

export type ProductSource = "manual" | "supplier";

export interface Product {
  // Identificação
  id: string;
  name: string;
  description: string;

  // Imagens
  image: string;
  heroImage?: string;
  gallery?: string[];

  // Informações do jogo
  platform: string;
  genre: GameGenre;
  type: string;
  steamAppId?: number | null;

  // Região e restrições
  region: string;
  allowedCountries: string[];
  excludedCountries: string[];

  // Preços
  price: number;
  originalPrice?: number;

  // Avaliações
  rating: number;
  reviewsCount: number;

  // Entrega
  delivery: string;

  // Estoque
  stock?: number;
  stockStatus?: "in_stock" | "out_of_stock";

  // Origem do produto
  source?: ProductSource;
}
