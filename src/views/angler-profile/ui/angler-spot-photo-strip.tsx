"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useSpotImages } from "@/entities/spot-image";
import { Link } from "@/shared/lib/i18n";
import styles from "./angler-spot-photo-strip.module.scss";

type AnglerSpotPhotoStripProps = {
  spotId: string;
};

export function AnglerSpotPhotoStrip({ spotId }: AnglerSpotPhotoStripProps) {
  const locale = useLocale();
  const t = useTranslations("anglerProfile");
  const { images } = useSpotImages("user-spot", spotId);

  if (images.length === 0) return null;

  return (
    <ul className={styles.strip} aria-label={t("spotPhotosList")}>
      {images.slice(0, 4).map((image) => {
        const caption = locale === "en" ? image.caption.en || image.caption.uk : image.caption.uk;

        return (
          <li key={image.id}>
            <Link className={styles.photo} href={`/community/${spotId}`} aria-label={caption}>
              <Image fill unoptimized src={image.url} alt={caption} sizes="(max-width: 480px) 22vw, 100px" />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
