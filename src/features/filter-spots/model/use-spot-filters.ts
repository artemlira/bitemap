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
  access: "",
  sort: "recommended",
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
    access: ["free", "paid", "restricted", "unknown"],
  };
}

function createFiltersUrl(filters: SpotFilters) {
  const searchParams = new URLSearchParams();

  for (const [name, value] of Object.entries(filters)) {
    if (value && !(name === "sort" && value === "recommended")) {
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

  const filteredSpots = useMemo(() => {
    const filtered = spots.filter(
        (spot) =>
          (filters.query === "" || getSpot(spot).searchText.toLocaleLowerCase().includes(filters.query.toLocaleLowerCase())) &&
          (filters.region === "" || getSpot(spot).region === filters.region) &&
          (filters.waterType === "" || getSpot(spot).waterType === filters.waterType) &&
          (filters.fish === "" || getSpot(spot).fish.includes(filters.fish)) &&
          (filters.access === "" || (getSpot(spot).accessCategory ?? "unknown") === filters.access),
      );

    if (filters.sort === "name") {
      return filtered.sort((first, second) => getSpot(first).searchText.localeCompare(getSpot(second).searchText, "uk"));
    }

    if (filters.sort === "updated") {
      return filtered.sort((first, second) =>
        (getSpot(second).updatedAt?.getTime() ?? 0) - (getSpot(first).updatedAt?.getTime() ?? 0),
      );
    }

    return filtered;
  }, [filters, getSpot, spots]);

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

  const hasActiveFilters = Object.entries(filters).some(
    ([name, value]) => Boolean(value) && !(name === "sort" && value === "recommended"),
  );

  return {
    filters,
    filteredSpots,
    hasActiveFilters,
    options,
    resetFilters,
    setFilter,
  };
}
