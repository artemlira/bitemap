"use client";

import { divIcon, latLngBounds } from "leaflet";
import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import { useTranslations } from "next-intl";
import { Link } from "@/shared/lib/i18n";
import type { MapSpot } from "./spots-map";
import styles from "./spots-map.module.scss";

const ukraineCenter: [number, number] = [49, 31];
const clusterCellSize = 56;

type SpotCluster = { key: string; latitude: number; longitude: number; spots: MapSpot[] };

function ClusterZoom({ onZoomChange }: { onZoomChange: (zoom: number) => void }) {
  const map = useMap();
  useMapEvents({
    zoomend: () => onZoomChange(map.getZoom()),
    moveend: () => onZoomChange(map.getZoom()),
  });

  return null;
}

function clusterSpots(spots: readonly MapSpot[], zoom: number): SpotCluster[] {
  const groups = new Map<string, { latitude: number; longitude: number; spots: MapSpot[] }>();
  const scale = 2 ** zoom;

  spots.forEach((spot) => {
    const x = (spot.longitude + 180) / 360 * 256 * scale;
    const sinLatitude = Math.sin(spot.latitude * Math.PI / 180);
    const y = (0.5 - Math.log((1 + sinLatitude) / (1 - sinLatitude)) / (4 * Math.PI)) * 256 * scale;
    const key = `${Math.floor(x / clusterCellSize)}:${Math.floor(y / clusterCellSize)}`;
    const group = groups.get(key) ?? { latitude: 0, longitude: 0, spots: [] };
    group.latitude += spot.latitude;
    group.longitude += spot.longitude;
    group.spots.push(spot);
    groups.set(key, group);
  });

  return [...groups].map(([key, group]) => ({
    key,
    latitude: group.latitude / group.spots.length,
    longitude: group.longitude / group.spots.length,
    spots: group.spots,
  }));
}

function FitSpots({ spots }: { spots: readonly MapSpot[] }) {
  const map = useMap();

  useEffect(() => {
    if (spots.length === 0) {
      map.setView(ukraineCenter, 6);
      return;
    }

    if (spots.length === 1) {
      map.setView([spots[0].latitude, spots[0].longitude], 10);
      return;
    }

    const bounds = latLngBounds(spots.map(({ latitude, longitude }) => [latitude, longitude]));
    map.fitBounds(bounds, { maxZoom: 9, padding: [32, 32] });
  }, [map, spots]);

  return null;
}

export function SpotsMapLeaflet({ spots }: { spots: readonly MapSpot[] }) {
  const t = useTranslations("spots");
  const [zoom, setZoom] = useState(6);
  const clusters = useMemo(() => clusterSpots(spots, zoom), [spots, zoom]);

  return (
    <MapContainer center={ukraineCenter} zoom={6} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitSpots spots={spots} />
      <ClusterZoom onZoomChange={setZoom} />
      {clusters.map((cluster) => (
        <Marker
          key={cluster.key}
          position={[cluster.latitude, cluster.longitude]}
          icon={divIcon({
            className: cluster.spots.length > 1 ? styles.clusterMarker : styles.marker,
            html: cluster.spots.length > 1 ? `<span>${cluster.spots.length}</span>` : "<span></span>",
            iconSize: cluster.spots.length > 1 ? [38, 38] : [22, 22],
            iconAnchor: cluster.spots.length > 1 ? [19, 19] : [11, 11],
          })}
          title={cluster.spots.length > 1 ? t("clusterTitle", { count: cluster.spots.length }) : cluster.spots[0].name}
        >
          <Popup>
            <div className={styles.popup}>
              {cluster.spots.map((spot) => (
                <div className={styles.popupSpot} key={spot.id}>
                  <strong>{spot.name}</strong>
                  <span>{spot.region}</span>
                  <Link href={spot.href}>{t("openMapSpot")}</Link>
                </div>
              ))}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
