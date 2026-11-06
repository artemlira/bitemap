"use client";

import { useEffect } from "react";
import { latLngBounds } from "leaflet";
import { CircleMarker, MapContainer, Polygon, Polyline, TileLayer, useMap, useMapEvents } from "react-leaflet";
import type { SpotCoordinates } from "../model/coordinates";

type LeafletSpotMapProps = {
  coordinates: SpotCoordinates | null;
  shape?: { kind: "area" | "line"; lines: [number, number][][] };
  isPicker?: boolean;
  onCoordinatesChange?: (coordinates: SpotCoordinates) => void;
};

const ukrainianCenter: [number, number] = [49.0, 31.0];
const defaultZoom = 6;
const selectedZoom = 13;

function MapViewport({ coordinates, shape }: Pick<LeafletSpotMapProps, "coordinates" | "shape">) {
  const map = useMap();

  useEffect(() => {
    if (shape && shape.lines.length > 0) {
      map.fitBounds(latLngBounds(shape.lines.flat()), { maxZoom: 15, padding: [24, 24] });
      return;
    }

    if (coordinates) {
      map.setView([coordinates.latitude, coordinates.longitude], selectedZoom);
    }
  }, [coordinates, map, shape]);

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

export function LeafletSpotMap({ coordinates, shape, isPicker = false, onCoordinatesChange }: LeafletSpotMapProps) {
  const center: [number, number] = coordinates
    ? [coordinates.latitude, coordinates.longitude]
    : ukrainianCenter;

  return (
    <MapContainer center={center} zoom={coordinates ? selectedZoom : defaultZoom} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapViewport coordinates={coordinates} shape={shape} />
      {shape
        ? shape.lines.map((line, index) =>
            shape.kind === "area" ? (
              <Polygon key={index} positions={line} pathOptions={{ color: "#14a38d", weight: 2, fillColor: "#14a38d", fillOpacity: 0.22 }} />
            ) : (
              <Polyline key={index} positions={line} pathOptions={{ color: "#14a38d", weight: 4, opacity: 0.9 }} />
            ),
          )
        : null}
      {coordinates ? (
        <CircleMarker center={[coordinates.latitude, coordinates.longitude]} pathOptions={{ color: "#f3a640", fillColor: "#f3a640", fillOpacity: 1 }} radius={10} />
      ) : null}
      {isPicker && onCoordinatesChange ? <CoordinatePicker onCoordinatesChange={onCoordinatesChange} /> : null}
    </MapContainer>
  );
}
