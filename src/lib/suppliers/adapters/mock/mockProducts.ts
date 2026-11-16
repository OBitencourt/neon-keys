import type { GameGenre } from "@/src/types/product";
import type { SupplierCatalogEntry } from "../../supplierAdapter";

const SUPPLIER = "mock";

type MockGame = {
  id: string;
  name: string;
  steamAppId?: number;
  genre: GameGenre;
  description: string;
  region: string;
  allowedCountries: string[];
  costPrice: number;
  stock: number;
};

const games: MockGame[] = [
  {
    id: "1",
    name: "Human: Fall Flat Steam Key LATAM",
    steamAppId: 477160,
    genre: "Adventure",
    description:
      "Human: Fall Flat is a hilarious, light-hearted physics platformer set in floating dreamscapes that can be played solo or with up to 8 players online.",
    region: "LATAM",
    allowedCountries: ["Brazil", "Argentina", "Chile", "Mexico", "Colombia"],
    costPrice: 799,
    stock: 15,
  },
  {
    id: "2",
    name: "Capote Steam(PC) Key LATAM",
    genre: "Adventure",
    description:
      "A mysterious adventure game where every choice matters. Uncover the secrets of a forgotten city.",
    region: "LATAM",
    allowedCountries: ["Brazil", "Argentina", "Peru"],
    costPrice: 599,
    stock: 5,
  },
  {
    id: "3",
    name: "Ori and the Blind Forest (Definitive Edition) Steam (PC) Key GLOBAL",
    steamAppId: 387290,
    genre: "Adventure",
    description:
      "The forest of Nibel is dying. After a powerful storm sets a series of devastating events in motion, Ori must journey to find courage and confront a dark nemesis to save the forest of Nibel.",
    region: "GLOBAL",
    allowedCountries: ["All Countries"],
    costPrice: 1499,
    stock: 100,
  },
  {
    id: "4",
    name: "HumanitZ Steam Key LATAM",
    genre: "Simulation",
    description:
      "HumanitZ is a top-down, open-world survival game in a world ended by the zombie outbreak. As one of the few human survivors, try to last as long as 'humanly' possible.",
    region: "LATAM",
    allowedCountries: ["Brazil", "Chile", "Uruguay"],
    costPrice: 799,
    stock: 8,
  },
  {
    id: "5",
    name: "Crimson Desert Deluxe Edition Steam Key LATAM",
    genre: "Action",
    description:
      "Crimson Desert is an open-world action-adventure game set in the vast continent of Pywel. Explore a breathtaking world, engage in intense combat, and uncover the truth behind a mercenary's destiny.",
    region: "LATAM",
    allowedCountries: [
      "Belize",
      "El Salvador",
      "Honduras",
      "Brazil",
      "Guatemala",
      "Panama",
      "Costa Rica",
      "Nicaragua",
    ],
    costPrice: 19999,
    stock: 7,
  },
  {
    id: "6",
    name: "Elden Ring Steam Key GLOBAL",
    steamAppId: 1245620,
    genre: "RPG",
    description:
      "Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring and become an Elden Lord in the Lands Between.",
    region: "GLOBAL",
    allowedCountries: ["All Countries"],
    costPrice: 8999,
    stock: 25,
  },
  {
    id: "7",
    name: "Call of Duty: Modern Warfare II Steam Key GLOBAL",
    steamAppId: 1938090,
    genre: "Action",
    description:
      "Call of Duty: Modern Warfare II drops players into an unprecedented global conflict that features the return of the iconic operators of Task Force 141.",
    region: "GLOBAL",
    allowedCountries: ["All Countries"],
    costPrice: 10999,
    stock: 15,
  },
  {
    id: "8",
    name: "Forza Horizon 5 Steam Key GLOBAL",
    steamAppId: 1551360,
    genre: "Racing",
    description:
      "Your Ultimate Horizon Adventure awaits! Explore the vibrant and ever-evolving open world landscapes of Mexico with limitless, fun driving action in hundreds of the world's greatest cars.",
    region: "GLOBAL",
    allowedCountries: ["All Countries"],
    costPrice: 6999,
    stock: 12,
  },
];

function steamImages(appId?: number): string[] {
  if (!appId) return [];

  const base = `https://shared.steamstatic.com/store_item_assets/steam/apps/${appId}`;

  return [`${base}/library_600x900.jpg`, `${base}/header.jpg`];
}

export const mockCatalog: SupplierCatalogEntry[] = games.map((game) => ({
  product: {
    supplier: SUPPLIER,
    supplierProductId: game.id,
    name: game.name,
    description: game.description,
    images: steamImages(game.steamAppId),
    platform: "Steam",
    genre: game.genre,
    region: game.region,
    excludedCountries: [],
    allowedCountries: game.allowedCountries,
    type: "Game",
  },
  offers: [
    {
      supplier: SUPPLIER,
      supplierProductId: game.id,
      supplierOfferId: `mock-offer-${game.id}`,
      costPrice: game.costPrice,
      currency: "EUR",
      availableQuantity: game.stock,
      status: game.stock > 0 ? "available" : "unavailable",
    },
  ],
}));
