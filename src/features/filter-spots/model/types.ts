export type SpotFilterName = "query" | "region" | "waterType" | "fish" | "access" | "sort";

export type SpotFilterOptionName = Exclude<SpotFilterName, "query" | "sort">;

export type SpotAccessFilter = "free" | "paid" | "restricted" | "unknown";
export type SpotSort = "recommended" | "name" | "updated";

export type SpotFilters = Record<SpotFilterName, string>;

export type SpotFilterOptions = Record<SpotFilterOptionName, readonly string[]>;

export type FilterableSpot = {
  accessCategory?: SpotAccessFilter;
  fish: readonly string[];
  region: string;
  searchText: string;
  waterType: string;
  updatedAt?: Date;
};

export type SpotFilterSearchParams = Record<string, string | string[] | undefined>;
