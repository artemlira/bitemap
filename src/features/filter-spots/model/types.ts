export type SpotFilterName = "query" | "region" | "waterType" | "fish";

export type SpotFilterOptionName = Exclude<SpotFilterName, "query">;

export type SpotFilters = Record<SpotFilterName, string>;

export type SpotFilterOptions = Record<SpotFilterOptionName, readonly string[]>;

export type FilterableSpot = {
  fish: readonly string[];
  region: string;
  searchText: string;
  waterType: string;
};

export type SpotFilterSearchParams = Record<string, string | string[] | undefined>;
