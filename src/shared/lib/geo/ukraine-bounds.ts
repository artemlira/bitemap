// Rough bounding box of Ukraine (including Crimea). It rejects obvious mistakes
// such as swapped latitude/longitude, not precise border cases.
export const UKRAINE_BOUNDS = { north: 52.4, south: 44.3, west: 22.1, east: 40.3 } as const;

export function isWithinUkraine(latitude: number, longitude: number): boolean {
  return (
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= UKRAINE_BOUNDS.south &&
    latitude <= UKRAINE_BOUNDS.north &&
    longitude >= UKRAINE_BOUNDS.west &&
    longitude <= UKRAINE_BOUNDS.east
  );
}
