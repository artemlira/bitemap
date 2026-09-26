"use client";

import { useCallback, useMemo, useState } from "react";
import type { FishingSpot } from "@/entities/fishing-spot";
import { useRouter } from "@/shared/lib/i18n";
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

function getFilterOptions(spots: readonly FishingSpot[]): SpotFilterOptions {
  return {
    region: uniqueSorted(spots.map((spot) => spot.region)),
    waterType: uniqueSorted(spots.map((spot) => spot.waterType)),
    fish: uniqueSorted(spots.flatMap((spot) => spot.fish)),
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
  const router = useRouter();

  const options = useMemo(() => getFilterOptions(spots), [spots]);
  const [filters, setFilters] = useState<SpotFilters>(() =>
    normalizeFilters(initialFilterValues, options),
  );

  const filteredSpots = useMemo(
    () =>
      spots.filter(
        (spot) =>
          (filters.region === "" || spot.region === filters.region) &&
          (filters.waterType === "" || spot.waterType === filters.waterType) &&
          (filters.fish === "" || spot.fish.includes(filters.fish)),
      ),
    [filters, spots],
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
