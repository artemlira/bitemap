import type { FishingReport } from "./types";

export function getFishingReportFish(report: FishingReport, locale: string) {
  if (locale === "en") {
    const translatedValue = report.translations?.en?.fish;

    if (translatedValue && translatedValue.length > 0) {
      return translatedValue;
    }
  }

  return report.fish;
}

export function getFishingReportText(report: FishingReport, field: "bait" | "impression" | "method", locale: string) {
  if (locale === "en") {
    const translatedValue = report.translations?.en?.[field];

    if (translatedValue) {
      return translatedValue;
    }
  }

  return report[field];
}
