"use client";

import { useState } from "react";

type ShareUserSpotButtonProps = {
  spotId: string;
  spotName: string;
};

export function ShareUserSpotButton({ spotId, spotName }: ShareUserSpotButtonProps) {
  const [label, setLabel] = useState("Поділитися");

  async function shareSpot() {
    const url = `${window.location.origin}/community/${spotId}`;

    try {
      if (navigator.share) {
        await navigator.share({ text: `Водойма «${spotName}» у BiteMap`, title: spotName, url });
        return;
      }

      await navigator.clipboard.writeText(url);
      setLabel("Посилання скопійовано");
      window.setTimeout(() => setLabel("Поділитися"), 2500);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      setLabel("Не вдалося скопіювати");
    }
  }

  return <button type="button" onClick={() => void shareSpot()}>{label}</button>;
}
