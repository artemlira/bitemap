"use client";

import { useEffect } from "react";
import { CircleMarker, MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";
import type { SpotCoordinates } from "../model/coordinates";

type LeafletSpotMapProps = {
  coordinates: SpotCoordinates | null;
  isPicker?: boolean;
  onCoordinatesChange?: (coordinates: SpotCoordinates) => void;
};

const ukrainianCenter: [number, number] = [49.0, 31.0];
const defaultZoom = 6;
const selectedZoom = 13;

function MapViewport({ coordinates }: Pick<LeafletSpotMapProps, "coordinates">) {
  const map = useMap();

  useEffect(() => {
    if (coordinates) {
      map.setView([coordinates.latitude, coordinates.longitude], selectedZoom);
    }
  }, [coordinates, map]);

  return null;
}

function CoordinatePicker({ onCoordinatesChange }: Required<Pick<LeafletSpotMapProps, "onCoordinatesChange">>) {
  useMapEvents({
    click(event) {
      onCoordinatesChange({
        latitude: event.latlng.lat,
        longitude: event.latlng.lng,
      });
    },
  });

  return null;
}

export function LeafletSpotMap({ coordinates, isPicker = false, onCoordinatesChange }: LeafletSpotMapProps) {
  const center: [number, number] = coordinates
    ? [coordinates.latitude, coordinates.longitude]
    : ukrainianCenter;

  return (
    <MapContainer center={center} zoom={coordinates ? selectedZoom : defaultZoom} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapViewport coordinates={coordinates} />
      {coordinates ? (
        <CircleMarker center={[coordinates.latitude, coordinates.longitude]} pathOptions={{ color: "#f3a640", fillColor: "#f3a640", fillOpacity: 1 }} radius={10} />
      ) : null}
      {isPicker && onCoordinatesChange ? <CoordinatePicker onCoordinatesChange={onCoordinatesChange} /> : null}
    </MapContainer>
  );
}
