export type SpotCoordinates = {
  latitude: number;
  longitude: number;
};

type CoordinatesSource = {
  latitude?: number | null;
  longitude?: number | null;
};

export function getSpotCoordinates(source: CoordinatesSource): SpotCoordinates | null {
  const { latitude, longitude } = source;

  if (
    typeof latitude !== "number" ||
    typeof longitude !== "number" ||
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    return null;
  }

  return { latitude, longitude };
}

export function formatCoordinates({ latitude, longitude }: SpotCoordinates) {
  return `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
}

export function getDirectionsUrl(coordinates: SpotCoordinates) {
  const destination = `${coordinates.latitude},${coordinates.longitude}`;

  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
}

export function getLocationSearchUrl(location: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
}
