"use client";

import { useEffect, useState } from "react";
import { buildFishingSpot, type CatalogBase, type WaterBodyType } from "./catalog-mapping";
import type { FishingSpot } from "./types";

type RawIndex = {
  importedAt: string;
  types: WaterBodyType[];
  regions: { uk: string; en: string }[];
  fishNames: string[];
  items: [string, string, string, number, number, number, number, number, number, number[]][];
};

let indexPromise: Promise<readonly FishingSpot[]> | null = null;
let loadedById = new Map<string, FishingSpot>();

/** Synchronous lookup that works after loadCatalogIndex() has resolved. */
export function getLoadedCatalogSpot(id: string): FishingSpot | undefined {
  return loadedById.get(id);
}

/** Loads the compact open-data index once per page session (cached by the browser too). */
export function loadCatalogIndex(): Promise<readonly FishingSpot[]> {
  indexPromise ??= fetch("/data/water-bodies-index.json")
    .then((response) => {
      if (!response.ok) throw new Error("Catalog index unavailable");
      return response.json() as Promise<RawIndex>;
    })
    .then((raw) =>
      raw.items.map(([id, nameUk, nameEn, typeIndex, regionIndex, latitude, longitude, lengthKm, areaKm2, fishIdx]) => {
        const base: CatalogBase = {
          id,
          type: raw.types[typeIndex],
          name: { uk: nameUk, en: nameEn || null },
          region: raw.regions[regionIndex],
          latitude,
          longitude,
        };
        return buildFishingSpot(base, raw.importedAt, undefined, {
          facts: lengthKm || areaKm2 ? { lengthKm: lengthKm || undefined, areaKm2: areaKm2 || undefined } : undefined,
          fish: (fishIdx ?? []).map((index) => raw.fishNames?.[index]).filter(Boolean),
        });
      }),
    )
    .then((spots) => {
      loadedById = new Map(spots.map((spot) => [spot.id, spot]));
      return spots;
    })
    .catch((error) => {
      indexPromise = null;
      throw error;
    });

  return indexPromise;
}

export function useCatalogIndex() {
  const [state, setState] = useState<{ spots: readonly FishingSpot[]; isLoading: boolean; error: boolean }>({
    spots: [],
    isLoading: true,
    error: false,
  });

  useEffect(() => {
    let isActive = true;
    loadCatalogIndex().then(
      (spots) => isActive && setState({ spots, isLoading: false, error: false }),
      () => isActive && setState({ spots: [], isLoading: false, error: true }),
    );
    return () => {
      isActive = false;
    };
  }, []);

  return state;
}
