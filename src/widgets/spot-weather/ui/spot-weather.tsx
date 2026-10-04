"use client";

import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { FishingReportTargetType } from "@/entities/fishing-report";
import type { FishingActivity, FishingReport } from "@/entities/fishing-report";
import { getFishingActivity, getWeatherConditionKey, getWeatherIcon, type SpotWeatherForecast } from "@/entities/weather-forecast";
import { getSpotCoordinates } from "@/entities/spot-location";
import { getFirebaseFirestore } from "@/shared/api/firebase";
import styles from "./spot-weather.module.scss";

type SpotWeatherProps = { id: string; latitude?: number; longitude?: number; targetType: FishingReportTargetType };

type ForecastState =
  | { status: "loading" }
  | { status: "ready"; forecast: SpotWeatherForecast }
  | { status: "error" };

type FishKey = "carp" | "pike" | "perch" | "zander" | "bream" | "catfish" | "roach" | "crucian" | "tench" | "trout" | "chub" | "eel" | "grassCarp" | "silverCarp";
type SpeciesSummary = { key: string; label: string; count: number; activityAverage: number | null; waterTemperatureAverage: number | null; waterTemperatureCount: number };
type CommunityState = { status: "loading" | "ready" | "error"; species: SpeciesSummary[] };

const fishAliases: ReadonlyArray<readonly [FishKey, readonly string[]]> = [
  ["carp", ["короп", "carp"]], ["pike", ["щука", "pike"]], ["perch", ["окунь", "perch"]],
  ["zander", ["судак", "zander", "pikeperch"]], ["bream", ["лящ", "bream"]], ["catfish", ["сом", "catfish"]],
  ["roach", ["плітка", "плотва", "roach"]], ["crucian", ["карась", "crucian carp", "crucian"]],
  ["tench", ["лин", "tench"]], ["trout", ["форель", "trout"]], ["chub", ["голавль", "головень", "chub"]],
  ["eel", ["вугор", "eel"]], ["grassCarp", ["білий амур", "grass carp", "white amur"]],
  ["silverCarp", ["товстолоб", "silver carp"]],
];

function normalizeFishName(value: string) {
  return value.toLocaleLowerCase().replace(/[’']/g, "'").replace(/\s+/g, " ").trim();
}

function getFishKey(value: string) {
  const normalized = normalizeFishName(value);
  return fishAliases.find(([, aliases]) => aliases.includes(normalized))?.[0] ?? `other:${normalized}`;
}

function getActivityPoints(activity?: FishingActivity) {
  if (activity === "excellent") return 4;
  if (activity === "good") return 3;
  if (activity === "fair") return 2;
  if (activity === "low") return 1;
  return null;
}

function useCommunityObservations(targetType: FishingReportTargetType, targetId: string) {
  const [state, setState] = useState<CommunityState>({ status: "loading", species: [] });

  useEffect(() => {
    let active = true;
    async function loadObservations() {
      try {
        const snapshot = await getDocs(query(
          collection(getFirebaseFirestore(), "fishing-reports"),
          where("isPublic", "==", true),
          where("targetId", "==", targetId),
          where("targetType", "==", targetType),
          orderBy("tripDate", "desc"),
          limit(100),
        ));
        const cutoff = new Date();
        cutoff.setFullYear(cutoff.getFullYear() - 1);
        const groups = new Map<string, { label: string; count: number; activityTotal: number; activityCount: number; waterTemperatureTotal: number; waterTemperatureCount: number }>();

        snapshot.docs.forEach((entry) => {
          const report = entry.data() as FishingReport;
          if (!report.tripDate || new Date(`${report.tripDate}T23:59:59`).getTime() < cutoff.getTime() || !Array.isArray(report.fish)) return;
          [...new Set(report.fish.map((fish) => getFishKey(fish)))].forEach((key) => {
            const label = report.fish.find((fish) => getFishKey(fish) === key) ?? key;
            const group = groups.get(key) ?? { label, count: 0, activityTotal: 0, activityCount: 0, waterTemperatureTotal: 0, waterTemperatureCount: 0 };
            group.count += 1;
            const activity = getActivityPoints(report.activity);
            if (activity !== null) { group.activityTotal += activity; group.activityCount += 1; }
            if (typeof report.waterTemperatureC === "number" && report.waterTemperatureC >= -2 && report.waterTemperatureC <= 40) {
              group.waterTemperatureTotal += report.waterTemperatureC;
              group.waterTemperatureCount += 1;
            }
            groups.set(key, group);
          });
        });

        const species = [...groups.entries()]
          .filter(([, group]) => group.count >= 3)
          .map(([key, group]) => ({
            key,
            label: group.label,
            count: group.count,
            activityAverage: group.activityCount ? group.activityTotal / group.activityCount : null,
            waterTemperatureAverage: group.waterTemperatureCount ? group.waterTemperatureTotal / group.waterTemperatureCount : null,
            waterTemperatureCount: group.waterTemperatureCount,
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);
        if (active) setState({ status: "ready", species });
      } catch {
        if (active) setState({ status: "error", species: [] });
      }
    }
    void loadObservations();
    return () => { active = false; };
  }, [targetId, targetType]);

  return state;
}

function formatTemperature(value: number) {
  return `${Math.round(value)}°`;
}

export function SpotWeather({ id, latitude, longitude, targetType }: SpotWeatherProps) {
  const locale = useLocale();
  const t = useTranslations("spotWeather");
  const coordinates = getSpotCoordinates({ latitude, longitude });
  const forecastLatitude = coordinates?.latitude;
  const forecastLongitude = coordinates?.longitude;
  const [state, setState] = useState<ForecastState>({ status: "loading" });
  const community = useCommunityObservations(targetType, id);
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
                  <p className={styles.activity} data-level={activity.level}>{t(`activity.${activity.level}`)} · {t("indexValue", { value: activity.score })}</p>
                </li>
              );
            })}
          </ul>
          <details className={styles.method}>
            <summary>{t("methodTitle")}</summary>
            <p>{t("method")}</p>
          </details>
          <section className={styles.community} aria-labelledby={`${titleId}-community`}>
            <div><h3 id={`${titleId}-community`}>{t("communityTitle")}</h3><p>{t("communityLead")}</p></div>
            {community.status === "loading" ? <p className={styles.communityState} aria-live="polite">{t("communityLoading")}</p> : null}
            {community.status === "error" ? <p className={styles.communityState} role="status">{t("communityUnavailable")}</p> : null}
            {community.status === "ready" && community.species.length === 0 ? <p className={styles.communityState}>{t("communityTooFew")}</p> : null}
            {community.status === "ready" && community.species.length > 0 ? (
              <ul className={styles.speciesList}>
                {community.species.map((species) => {
                  const translatedKey = species.key.startsWith("other:") ? null : species.key;
                  return (
                    <li key={species.key}>
                      <strong>{translatedKey ? t(`communityFish.${translatedKey}`) : species.label}</strong>
                      <span>{t("communityReportCount", { count: species.count })}</span>
                      {species.activityAverage !== null ? <span>{t("communityActivity", { value: species.activityAverage.toFixed(1) })}</span> : null}
                      {species.waterTemperatureAverage !== null ? <span>{t("communityWaterTemperature", { value: species.waterTemperatureAverage.toFixed(1), count: species.waterTemperatureCount })}</span> : null}
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </section>
          <p className={styles.disclaimer}>{t("disclaimer")}</p>
        </>
      ) : null}
    </section>
  );
}
