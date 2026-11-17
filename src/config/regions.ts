// Países (ISO 3166-1 alpha-2) e regiões pré-definidas.
// Seguro para usar no cliente e no servidor.

export const ALL_COUNTRIES: readonly string[] = (
  "AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ " +
  "BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ " +
  "CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ " +
  "DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR " +
  "GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY " +
  "HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP " +
  "KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY " +
  "MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ " +
  "NA NC NE NF NG NI NL NO NP NR NU NZ OM " +
  "PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW " +
  "SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ " +
  "TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ " +
  "UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW"
).split(" ");

const COUNTRY_SET = new Set(ALL_COUNTRIES);

export function isCountryCode(code: string) {
  return COUNTRY_SET.has(code);
}

const EU = (
  "AT BE BG HR CY CZ DK EE FI FR DE GR HU IE IT LV LT LU MT NL PL PT RO SK SI ES SE"
).split(" ");

export interface RegionPreset {
  label: string;
  // GLOBAL = todos os países; CUSTOM = só os países escolhidos manualmente.
  countries: readonly string[] | "ALL" | "NONE";
}

export const REGION_PRESETS = {
  GLOBAL: { label: "Global (worldwide)", countries: "ALL" },
  EU: { label: "European Union", countries: EU },
  EEA: { label: "EEA (EU + IS, LI, NO)", countries: [...EU, "IS", "LI", "NO"] },
  LATAM: {
    label: "LATAM",
    countries: "AR BO BR CL CO CR CU DO EC GT HN HT MX NI PA PY PE SV UY VE".split(" "),
  },
  NORTH_AMERICA: { label: "North America", countries: ["US", "CA", "MX"] },
  NORDICS: { label: "Nordics", countries: ["DK", "FI", "IS", "NO", "SE"] },
  CUSTOM: { label: "Custom (pick countries)", countries: "NONE" },
} as const satisfies Record<string, RegionPreset>;

export type RegionKey = keyof typeof REGION_PRESETS;

export const REGION_KEYS = Object.keys(REGION_PRESETS) as [RegionKey, ...RegionKey[]];

export interface RegionInput {
  regionPreset: RegionKey;
  includedCountries?: string[];
  excludedCountries?: string[];
}

// Países que o preset cobre por si só (sem extras nem exclusões).
export function presetCountries(preset: RegionKey): readonly string[] {
  const { countries } = REGION_PRESETS[preset] as RegionPreset;
  if (countries === "ALL") return ALL_COUNTRIES;
  if (countries === "NONE") return [];
  return countries;
}

// allowed = (preset ∪ extras) − excluídos
export function resolveAllowedCountries(input: RegionInput): string[] {
  const set = new Set<string>([
    ...presetCountries(input.regionPreset),
    ...(input.includedCountries ?? []),
  ]);

  for (const code of input.excludedCountries ?? []) set.delete(code);

  return [...set].sort();
}

// Worldwide puro: preset GLOBAL sem exclusões. Guardamos allowedCountries = [].
export function isWorldwide(input: RegionInput) {
  return (
    input.regionPreset === "GLOBAL" &&
    (input.excludedCountries ?? []).length === 0
  );
}

// Valor guardado em Product.allowedCountries (vazio = sem restrições).
export function storedAllowedCountries(input: RegionInput): string[] {
  return isWorldwide(input) ? [] : resolveAllowedCountries(input);
}

// Texto curto guardado em Product.region (mostrado na página do produto).
export function regionLabel(input: RegionInput) {
  return input.regionPreset === "CUSTOM" ? "Custom" : input.regionPreset.replace("_", " ");
}

// Devolve uma mensagem de erro, ou null se estiver tudo coerente.
export function validateRegion(input: RegionInput): string | null {
  const base = new Set([
    ...presetCountries(input.regionPreset),
    ...(input.includedCountries ?? []),
  ]);

  const stray = (input.excludedCountries ?? []).filter((c) => !base.has(c));
  if (stray.length > 0) {
    return `Excluded countries not in the selected region: ${stray.join(", ")}`;
  }

  if (resolveAllowedCountries(input).length === 0) {
    return "Select at least one allowed country";
  }

  return null;
}