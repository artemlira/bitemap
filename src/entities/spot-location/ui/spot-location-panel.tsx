"use client";

import { useTranslations } from "next-intl";
import {
  formatCoordinates,
  getDirectionsUrl,
  getLocationSearchUrl,
  getSpotCoordinates,
} from "../model/coordinates";
import { SpotLocationMap } from "./spot-location-map";
import styles from "./spot-location-panel.module.scss";

type SpotLocationPanelProps = {
  id: string;
  latitude?: number;
  locationLabel: string;
  longitude?: number;
};

export function SpotLocationPanel({ id, latitude, locationLabel, longitude }: SpotLocationPanelProps) {
  const t = useTranslations("spotLocation");
  const coordinates = getSpotCoordinates({ latitude, longitude });
  const titleId = `spot-location-title-${id}`;

  return (
    <section className={styles.section} aria-labelledby={titleId}>
      <div className={styles.heading}>
        <p className={styles.eyebrow}>{t("eyebrow")}</p>
        <h2 id={titleId}>{t("title")}</h2>
      </div>

      {coordinates ? (
        <>
          <SpotLocationMap coordinates={coordinates} />
          <div className={styles.mapActions}>
            <a
              className={styles.coordinates}
              href={getLocationSearchUrl(formatCoordinates(coordinates))}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("coordinates")}: {formatCoordinates(coordinates)} · {t("openOnMap")}
            </a>
            <a className={styles.action} href={getDirectionsUrl(coordinates)} target="_blank" rel="noopener noreferrer">
              {t("buildRoute")} <span aria-hidden="true">↗</span>
            </a>
          </div>
        </>
      ) : (
        <div className={styles.fallback}>
          <p>{t("missingCoordinates")}</p>
          <a className={styles.action} href={getLocationSearchUrl(locationLabel)} target="_blank" rel="noopener noreferrer">
            {t("openApproximateLocation")} <span aria-hidden="true">↗</span>
          </a>
        </div>
      )}
    </section>
  );
}
