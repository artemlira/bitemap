"use client";

import { useCallback, useMemo, useState } from "react";
import type { FishingSpot } from "@/entities/fishing-spot";
import type { SpotFilterName, SpotFilterOptions, SpotFilters } from "./types";

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

export function useSpotFilters(spots: readonly FishingSpot[]) {
  const [filters, setFilters] = useState<SpotFilters>(initialFilters);

  const options = useMemo(() => getFilterOptions(spots), [spots]);

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

  const setFilter = useCallback((name: SpotFilterName, value: string) => {
    setFilters((currentFilters) => ({ ...currentFilters, [name]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

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
