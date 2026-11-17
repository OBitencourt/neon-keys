"use client";

import { useMemo } from "react";
import CountryMultiSelect from "./countryMultiSelect";
import {
  ALL_COUNTRIES,
  REGION_PRESETS,
  isWorldwide,
  presetCountries,
  resolveAllowedCountries,
  type RegionKey,
} from "@/src/config/regions";

export interface RegionValue {
  regionPreset: RegionKey;
  includedCountries: string[];
  excludedCountries: string[];
}

export const emptyRegion: RegionValue = {
  regionPreset: "GLOBAL",
  includedCountries: [],
  excludedCountries: [],
};

interface RegionFieldsProps {
  value: RegionValue;
  onChange: (value: RegionValue) => void;
  inputClass: string;
  labelClass: string;
}

export default function RegionFields({
  value,
  onChange,
  inputClass,
  labelClass,
}: RegionFieldsProps) {
  const isCustom = value.regionPreset === "CUSTOM";
  const isGlobal = value.regionPreset === "GLOBAL";

  const presetSet = useMemo(
    () => new Set(presetCountries(value.regionPreset)),
    [value.regionPreset],
  );

  // Extras: países fora do preset que se podem somar.
  const extraOptions = useMemo(
    () => ALL_COUNTRIES.filter((c) => !presetSet.has(c)),
    [presetSet],
  );

  // Exclusões: só faz sentido excluir o que o preset (ou os extras) já cobre.
  const excludeOptions = useMemo(
    () => [...new Set([...presetSet, ...value.includedCountries])],
    [presetSet, value.includedCountries],
  );

  function changePreset(next: RegionKey) {
    const nextSet = new Set(presetCountries(next));
    const included = value.includedCountries.filter((c) => !nextSet.has(c));
    const base = new Set([...nextSet, ...included]);

    onChange({
      regionPreset: next,
      includedCountries: included,
      excludedCountries: value.excludedCountries.filter((c) => base.has(c)),
    });
  }

  function changeIncluded(included: string[]) {
    const base = new Set([...presetSet, ...included]);

    onChange({
      ...value,
      includedCountries: included,
      excludedCountries: value.excludedCountries.filter((c) => base.has(c)),
    });
  }

  const total = resolveAllowedCountries(value).length;

  return (
    <div className="space-y-4">
      <div>
        <label className={labelClass}>Activation Region *</label>
        <select
          className={inputClass}
          value={value.regionPreset}
          onChange={(e) => changePreset(e.target.value as RegionKey)}
        >
          {Object.entries(REGION_PRESETS).map(([key, preset]) => (
            <option key={key} value={key}>
              {preset.label}
            </option>
          ))}
        </select>
      </div>

      {!isGlobal && (
        <CountryMultiSelect
          label={isCustom ? "Allowed Countries" : "Extra Countries (optional)"}
          hint={
            isCustom
              ? "Pick every country where the key can be activated."
              : "Add countries that are not part of the selected region."
          }
          value={value.includedCountries}
          options={extraOptions}
          onChange={changeIncluded}
          inputClass={inputClass}
          labelClass={labelClass}
        />
      )}

      <CountryMultiSelect
        label="Excluded Countries"
        hint="Removed from the allowed list above."
        value={value.excludedCountries}
        options={excludeOptions}
        onChange={(excluded) => onChange({ ...value, excludedCountries: excluded })}
        inputClass={inputClass}
        labelClass={labelClass}
      />

      <p className="text-xs text-neon-gray">
        {isWorldwide(value)
          ? "Worldwide — no country restrictions."
          : `${total} allowed countr${total === 1 ? "y" : "ies"}.`}
      </p>
    </div>
  );
}