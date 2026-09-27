"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "@/shared/lib/i18n";
import type {
  FilterableSpot,
  SpotFilterName,
  SpotFilterOptions,
  SpotFilters,
} from "./types";

const initialFilters: SpotFilters = {
  query: "",
  region: "",
  waterType: "",
  fish: "",
};

function uniqueSorted(values: Iterable<string>) {
  return [...new Set(values)].sort((first, second) => first.localeCompare(second, "uk"));
}

function getFilterOptions<TSpot>(
  spots: readonly TSpot[],
  getSpot: (spot: TSpot) => FilterableSpot,
): SpotFilterOptions {
  return {
    region: uniqueSorted(spots.map((spot) => getSpot(spot).region)),
    waterType: uniqueSorted(spots.map((spot) => getSpot(spot).waterType)),
    fish: uniqueSorted(spots.flatMap((spot) => getSpot(spot).fish)),
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

export function useSpotFilters<TSpot>(
  spots: readonly TSpot[],
  getSpot: (spot: TSpot) => FilterableSpot,
  initialFilterValues: SpotFilters = initialFilters,
) {
  const router = useRouter();

  const options = useMemo(() => getFilterOptions(spots, getSpot), [getSpot, spots]);
  const [filters, setFilters] = useState<SpotFilters>(initialFilterValues);

  const filteredSpots = useMemo(
    () =>
      spots.filter(
        (spot) =>
          (filters.query === "" || getSpot(spot).searchText.toLocaleLowerCase().includes(filters.query.toLocaleLowerCase())) &&
          (filters.region === "" || getSpot(spot).region === filters.region) &&
          (filters.waterType === "" || getSpot(spot).waterType === filters.waterType) &&
          (filters.fish === "" || getSpot(spot).fish.includes(filters.fish)),
      ),
    [filters, getSpot, spots],
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
