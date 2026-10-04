"use client";

import { divIcon, latLngBounds } from "leaflet";
import { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { useTranslations } from "next-intl";
import { Link } from "@/shared/lib/i18n";
import type { MapSpot } from "./spots-map";
import styles from "./spots-map.module.scss";

const ukraineCenter: [number, number] = [49, 31];

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

  return (
    <MapContainer center={ukraineCenter} zoom={6} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitSpots spots={spots} />
      {spots.map((spot) => (
        <Marker
          key={spot.id}
          position={[spot.latitude, spot.longitude]}
          icon={divIcon({ className: styles.marker, html: "<span></span>", iconSize: [22, 22], iconAnchor: [11, 11] })}
        >
          <Popup>
            <div className={styles.popup}>
              <strong>{spot.name}</strong>
              <span>{spot.region}</span>
              <Link href={spot.href}>{t("openMapSpot")}</Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
