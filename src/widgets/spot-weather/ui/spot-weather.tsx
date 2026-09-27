"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { getFishingActivity, getWeatherConditionKey, getWeatherIcon, type SpotWeatherForecast } from "@/entities/weather-forecast";
import { getSpotCoordinates } from "@/entities/spot-location";
import styles from "./spot-weather.module.scss";

type SpotWeatherProps = { id: string; latitude?: number; longitude?: number };

type ForecastState =
  | { status: "loading" }
  | { status: "ready"; forecast: SpotWeatherForecast }
  | { status: "error" };

function formatTemperature(value: number) {
  return `${Math.round(value)}°`;
}

export function SpotWeather({ id, latitude, longitude }: SpotWeatherProps) {
  const locale = useLocale();
  const t = useTranslations("spotWeather");
  const coordinates = getSpotCoordinates({ latitude, longitude });
  const forecastLatitude = coordinates?.latitude;
  const forecastLongitude = coordinates?.longitude;
  const [state, setState] = useState<ForecastState>({ status: "loading" });
  const titleId = `spot-weather-title-${id}`;

  useEffect(() => {
    if (forecastLatitude === undefined || forecastLongitude === undefined) return;

    const controller = new AbortController();
    const url = new URL("/api/weather", window.location.origin);
    url.searchParams.set("latitude", String(forecastLatitude));
    url.searchParams.set("longitude", String(forecastLongitude));

    fetch(url, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("weather-unavailable");
        return (await response.json()) as SpotWeatherForecast;
      })
      .then((forecast) => {
        if (!controller.signal.aborted) setState({ forecast, status: "ready" });
      })
      .catch(() => {
        if (!controller.signal.aborted) setState({ status: "error" });
      });

    return () => controller.abort();
  }, [forecastLatitude, forecastLongitude]);

  const dateFormatter = useMemo(() => new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", weekday: "short" }), [locale]);
  const timeFormatter = useMemo(() => new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit" }), [locale]);

  return (
    <section className={styles.section} aria-labelledby={titleId}>
      <div className={styles.heading}>
        <p>{t("eyebrow")}</p>
        <h2 id={titleId}>{t("title")}</h2>
        <span>{t("lead")}</span>
      </div>

      {!coordinates ? <p className={styles.status}>{t("missingCoordinates")}</p> : null}
      {coordinates && state.status === "loading" ? <p className={styles.status} aria-live="polite">{t("loading")}</p> : null}
      {coordinates && state.status === "error" ? <p className={styles.status}>{t("unavailable")}</p> : null}

      {state.status === "ready" ? (
        <>
          <div className={styles.current}>
            <span className={styles.weatherIcon} aria-hidden="true">{getWeatherIcon(state.forecast.current.weatherCode)}</span>
            <div>
              <p>{t(`conditions.${getWeatherConditionKey(state.forecast.current.weatherCode)}`)}</p>
              <strong>{formatTemperature(state.forecast.current.temperature)}</strong>
            </div>
            <dl>
              <div>
                <dt>{t("wind")}</dt>
                <dd>{t("windValue", { value: Math.round(state.forecast.current.windSpeed) })}</dd>
              </div>
              <div>
                <dt>{t("updated")}</dt>
                <dd>{timeFormatter.format(new Date(state.forecast.current.time))}</dd>
              </div>
            </dl>
          </div>

          <div className={styles.calendarHeading}>
            <h3>{t("calendar")}</h3>
            <p>{t("calendarLead")}</p>
          </div>

          <ul className={styles.dailyList} aria-label={t("calendar")}>
            {state.forecast.daily.map((day) => {
              const activity = getFishingActivity(day);

              return (
                <li className={styles.dayCard} key={day.date}>
                  <p className={styles.day}>{dateFormatter.format(new Date(`${day.date}T12:00:00`))}</p>
                  <span className={styles.dayIcon} aria-hidden="true">{getWeatherIcon(day.weatherCode)}</span>
                  <p className={styles.temperatures}><strong>{formatTemperature(day.temperatureMax)}</strong><span>{formatTemperature(day.temperatureMin)}</span></p>
                  <dl className={styles.dayFacts}>
                    <div><dt>{t("precipitation")}</dt><dd>{day.precipitationProbability}%</dd></div>
                    <div><dt>{t("wind")}</dt><dd>{t("windValue", { value: Math.round(day.windSpeedMax) })}</dd></div>
                  </dl>
                  <p className={styles.activity} data-level={activity.level}>{t(`activity.${activity.level}`)} · {activity.score}%</p>
                </li>
              );
            })}
          </ul>
          <p className={styles.disclaimer}>{t("disclaimer")}</p>
        </>
      ) : null}
    </section>
  );
}
