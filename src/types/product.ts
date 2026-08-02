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
  /** Identificador único (ex: _id do MongoDB) */
  id: string;
  /** Nome do jogo, exibido no card */
  name: string;
  /** Caminho da imagem da capa. Deixe vazio ("") para exibir o placeholder */
  image: string;
  /** Plataforma do jogo (ex: "Steam", "Epic Games", "PSN", "Xbox") */
  platform: string;
  /** Preço atual, em reais (ex: 10.99) */
  price: number;
  /** Preço original, exibido riscado quando há desconto */
  originalPrice?: number;
  /** Gênero do jogo */
  genre: GameGenre;
}