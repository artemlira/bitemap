"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";

type ShareUserSpotButtonProps = {
  spotId: string;
  spotName: string;
};

export function ShareUserSpotButton({ spotId, spotName }: ShareUserSpotButtonProps) {
  const locale = useLocale();
  const t = useTranslations("share");
  const [label, setLabel] = useState(t("share"));

  async function shareSpot() {
    const url = `${window.location.origin}/${locale}/community/${spotId}`;

    try {
      if (navigator.share) {
        await navigator.share({ text: t("text", { spotName }), title: spotName, url });
        return;
      }

      await navigator.clipboard.writeText(url);
      setLabel(t("copied"));
      window.setTimeout(() => setLabel(t("share")), 2500);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      setLabel(t("failed"));
    }
  }

  return <button type="button" onClick={() => void shareSpot()}>{label}</button>;
}
