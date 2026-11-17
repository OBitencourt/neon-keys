import { z } from "zod";
import {
  REGION_KEYS,
  isCountryCode,
  validateRegion,
} from "@/src/config/regions";

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

const countryList = z
  .array(
    z
      .string()
      .regex(/^[A-Z]{2}$/)
      .refine(isCountryCode, "Invalid country code"),
  )
  .max(260);

const productBase = z.object({
  name: z.string().trim().min(2).max(200),

  description: z.string().trim().max(10000),

  platform: z.string().trim().min(2).max(80),

  genre: z.enum(productGenres),

  regionPreset: z.enum(REGION_KEYS),

  includedCountries: countryList,

  salePrice: z.number().finite().positive(),

  originalPrice: z.number().finite().positive().nullable(),

  image: z.union([httpsUrl, z.literal("")]),

  gallery: z.array(httpsUrl).max(8),

  steamAppId: z.number().int().positive().nullable(),

  excludedCountries: countryList,

  keys: z
    .array(z.string().trim().min(3).max(500))
    .max(100)
    .refine(
      (keys) => new Set(keys).size === keys.length,
      "Existem chaves duplicadas",
    ),
});

function checkRegion(
  data: {
    regionPreset: (typeof REGION_KEYS)[number];
    includedCountries: string[];
    excludedCountries: string[];
  },
  ctx: z.RefinementCtx,
) {
  const error = validateRegion(data);

  if (error) {
    ctx.addIssue({ code: "custom", message: error, path: ["excludedCountries"] });
  }
}

export const createProductSchema = productBase.superRefine(checkRegion);

export const updateProductSchema = productBase
  .omit({ keys: true })
  .extend({ status: z.enum(["active", "inactive"]) })
  .superRefine(checkRegion);

export const addKeysSchema = productBase
  .pick({ keys: true })
  .refine((data) => data.keys.length > 0, "Adicione pelo menos uma chave");

export type CreateProductInput = z.infer<typeof createProductSchema>;