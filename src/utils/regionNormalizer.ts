
import type {
  RegionInput,
  RegionKey,
} from "@/src/config/regions";

export type MatchStatus =
  | "match"
  | "review"
  | "mismatch";

export function normalizeValue(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

export function getPlatformMatch(
  neonPlatform: string,
  enebaDrm: string | null,
): boolean {
  if (!enebaDrm) return false;

  return (
    normalizeValue(neonPlatform) ===
    normalizeValue(enebaDrm)
  );
}

// Códigos que consideramos equivalentes
// nominalmente, sem alterações manuais de países.
const REGION_ALIASES: Partial<
  Record<RegionKey, readonly string[]>
> = {
  GLOBAL: ["global", "worldwide"],
  EU: ["eu", "european union"],
  EEA: ["eea", "european economic area"],
  LATAM: ["latam", "latin america"],
  NORTH_AMERICA: ["north america"],
  NORDICS: ["nordics", "nordic"],
};

export function getRegionMatch(
  neonRegion: RegionInput,
  enebaRegions: string[],
): MatchStatus {
  const remote = new Set(
    enebaRegions.map(normalizeValue),
  );

  if (remote.size === 0) {
    return "review";
  }

  // Regiões personalizadas dependem de verificação
  // das restrições individuais de países.
  if (neonRegion.regionPreset === "CUSTOM") {
    return "review";
  }

  const hasCustomRestrictions =
    (neonRegion.includedCountries?.length ?? 0) > 0 ||
    (neonRegion.excludedCountries?.length ?? 0) > 0;

  if (hasCustomRestrictions) {
    return "review";
  }

  const aliases =
    REGION_ALIASES[neonRegion.regionPreset] ?? [];

  if (
    aliases.some((alias) =>
      remote.has(normalizeValue(alias)),
    )
  ) {
    return "match";
  }

  // "Europe" pode incluir países que não pertencem
  // à UE, ao EEE ou aos países nórdicos.
  if (
    ["EU", "EEA", "NORDICS"].includes(
      neonRegion.regionPreset,
    ) &&
    remote.has("europe")
  ) {
    return "review";
  }

  return "mismatch";
}
