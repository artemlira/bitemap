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

export function SpotsMap({ spots }: { spots: readonly MapSpot[] }) {
  return (
    <div className={styles.map}>
      <LeafletSpotsMap spots={spots} />
    </div>
  );
}
