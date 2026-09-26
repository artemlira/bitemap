"use client";

import { useCallback, useMemo, useState } from "react";
import { getFishingSpotFish, getFishingSpotText, type FishingSpot } from "@/entities/fishing-spot";
import { useRouter } from "@/shared/lib/i18n";
import { useLocale } from "next-intl";
import type {
  SpotFilterName,
  SpotFilterOptions,
  SpotFilters,
} from "./types";

const initialFilters: SpotFilters = {
  region: "",
  waterType: "",
  fish: "",
};

function uniqueSorted(values: Iterable<string>) {
  return [...new Set(values)].sort((first, second) => first.localeCompare(second, "uk"));
}

function getFilterOptions(spots: readonly FishingSpot[], locale: string): SpotFilterOptions {
  return {
    region: uniqueSorted(spots.map((spot) => getFishingSpotText(spot, "region", locale))),
    waterType: uniqueSorted(spots.map((spot) => getFishingSpotText(spot, "waterType", locale))),
    fish: uniqueSorted(spots.flatMap((spot) => getFishingSpotFish(spot, locale))),
  };
}

function isFilterOption(
  value: string,
  options: readonly string[],
): value is (typeof options)[number] {
  return value === "" || options.includes(value);
}

function normalizeFilters(filters: SpotFilters, options: SpotFilterOptions): SpotFilters {
  return {
    region: isFilterOption(filters.region, options.region) ? filters.region : "",
    waterType: isFilterOption(filters.waterType, options.waterType) ? filters.waterType : "",
    fish: isFilterOption(filters.fish, options.fish) ? filters.fish : "",
  };
}

function createFiltersUrl(filters: SpotFilters) {
  const searchParams = new URLSearchParams();

  for (const [name, value] of Object.entries(filters)) {
    if (value) {
      searchParams.set(name, value);
    }
  }

  const query = searchParams.toString();

  return query ? `/spots?${query}` : "/spots";
}

export function useSpotFilters(
  spots: readonly FishingSpot[],
  initialFilterValues: SpotFilters = initialFilters,
) {
  const locale = useLocale();
  const router = useRouter();

  const options = useMemo(() => getFilterOptions(spots, locale), [locale, spots]);
  const [filters, setFilters] = useState<SpotFilters>(() =>
    normalizeFilters(initialFilterValues, options),
  );

  const filteredSpots = useMemo(
    () =>
      spots.filter(
        (spot) =>
          (filters.region === "" || getFishingSpotText(spot, "region", locale) === filters.region) &&
          (filters.waterType === "" || getFishingSpotText(spot, "waterType", locale) === filters.waterType) &&
          (filters.fish === "" || getFishingSpotFish(spot, locale).includes(filters.fish)),
      ),
    [filters, locale, spots],
  );

  const updateFilters = useCallback(
    (nextFilters: SpotFilters) => {
      setFilters(nextFilters);
      router.replace(createFiltersUrl(nextFilters), { scroll: false });
    },
    [router],
  );

  const setFilter = useCallback(
    (name: SpotFilterName, value: string) => {
      updateFilters({ ...filters, [name]: value });
    },
    [filters, updateFilters],
  );

  const resetFilters = useCallback(() => {
    updateFilters(initialFilters);
  }, [updateFilters]);

  const hasActiveFilters = Object.values(filters).some(Boolean);

  return {
    filters,
    filteredSpots,
    hasActiveFilters,
    options,
    resetFilters,
    setFilter,
  };
}
