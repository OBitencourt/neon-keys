import { z } from "zod";

const httpsUrl = z
  .string()
  .url()
  .startsWith("https://", "Use uma URL HTTPS");

export const productGenres = [
  "Action",
  "Adventure",
  "RPG",
  "Racing",
  "Simulation",
  "Sports",
  "Strategy",
  "Other",
] as const;

export const createProductSchema = z.object({
  name: z.string().trim().min(2).max(200),

  description: z.string().trim().max(10000),

  platform: z.string().trim().min(2).max(80),

  genre: z.enum(productGenres),

  region: z.string().trim().min(2).max(100),

  salePrice: z.number().finite().positive(),

  originalPrice: z.number().finite().positive().nullable(),

  image: z.union([httpsUrl, z.literal("")]),

  gallery: z.array(httpsUrl).max(8),

  steamAppId: z.number().int().positive().nullable(),

  excludedCountries: z
    .array(z.string().regex(/^[A-Z]{2}$/))
    .max(100),

  keys: z
    .array(z.string().trim().min(3).max(500))
    .max(100)
    .refine(
      (keys) => new Set(keys).size === keys.length,
      "Existem chaves duplicadas",
    ),
});

export const addKeysSchema = createProductSchema.pick({
  keys: true,
}).refine(
  (data) => data.keys.length > 0,
  "Adicione pelo menos uma chave",
);

export type CreateProductInput =
  z.infer<typeof createProductSchema>;