"use client";

import type { SpotFilterName, SpotFilterOptions, SpotFilters } from "../model/types";
import styles from "./spot-filter-bar.module.scss";

type SpotFilterBarProps = {
  filters: SpotFilters;
  hasActiveFilters: boolean;
  options: SpotFilterOptions;
  onChange: (name: SpotFilterName, value: string) => void;
  onReset: () => void;
};

const filterFields: ReadonlyArray<{
  id: string;
  label: string;
  name: SpotFilterName;
  placeholder: string;
}> = [
  { id: "spot-filter-region", label: "Регіон", name: "region", placeholder: "Усі регіони" },
  { id: "spot-filter-water-type", label: "Тип водойми", name: "waterType", placeholder: "Усі типи" },
  { id: "spot-filter-fish", label: "Риба", name: "fish", placeholder: "Усі види" },
];

export function SpotFilterBar({
  filters,
  hasActiveFilters,
  options,
  onChange,
  onReset,
}: SpotFilterBarProps) {
  return (
    <div className={styles.filters} role="group" aria-label="Фільтри каталогу водойм">
      {filterFields.map((field) => (
        <label className={styles.field} htmlFor={field.id} key={field.name}>
          <span>{field.label}</span>
          <select
            id={field.id}
            name={field.name}
            value={filters[field.name]}
            onChange={(event) => onChange(field.name, event.target.value)}
          >
            <option value="">{field.placeholder}</option>
            {options[field.name].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      ))}

      <button className={styles.reset} type="button" onClick={onReset} disabled={!hasActiveFilters}>
        Скинути
      </button>
    </div>
  );
}
