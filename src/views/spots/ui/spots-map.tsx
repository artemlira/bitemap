"use client";

import dynamic from "next/dynamic";
import type { SpotCoordinates } from "@/entities/spot-location";
import styles from "./spots-map.module.scss";

export type MapSpot = SpotCoordinates & {
  href: string;
  id: string;
  name: string;
  region: string;
};

const LeafletSpotsMap = dynamic(
  () => import("./spots-map-leaflet").then((module) => module.SpotsMapLeaflet),
  { loading: () => <div className={styles.map} aria-busy="true" />, ssr: false },
);

export function SpotsMap({ spots, refreshKey, onBoundsChange }: { spots: readonly MapSpot[]; refreshKey?: string; onBoundsChange?: (bounds: { south: number; west: number; north: number; east: number }) => void }) {
  return (
    <div className={styles.map}>
      <LeafletSpotsMap spots={spots} refreshKey={refreshKey} onBoundsChange={onBoundsChange} />
    </div>
  );
}
