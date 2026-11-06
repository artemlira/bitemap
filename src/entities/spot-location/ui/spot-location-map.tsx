"use client";

import dynamic from "next/dynamic";
import type { SpotCoordinates } from "../model/coordinates";
import styles from "./spot-location-map.module.scss";

const LeafletSpotMap = dynamic(
  () => import("./leaflet-spot-map").then((module) => module.LeafletSpotMap),
  {
    loading: () => <div className={styles.map} aria-busy="true" />,
    ssr: false,
  },
);

type SpotLocationMapProps = {
  coordinates: SpotCoordinates | null;
  shape?: { kind: "area" | "line"; lines: [number, number][][] };
  isPicker?: boolean;
  onCoordinatesChange?: (coordinates: SpotCoordinates) => void;
};

export function SpotLocationMap({ coordinates, shape, isPicker, onCoordinatesChange }: SpotLocationMapProps) {
  return (
    <div className={styles.map}>
      <LeafletSpotMap coordinates={coordinates} shape={shape} isPicker={isPicker} onCoordinatesChange={onCoordinatesChange} />
    </div>
  );
}
