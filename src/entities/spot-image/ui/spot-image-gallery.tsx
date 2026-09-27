"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSpotImages } from "../model/use-spot-images";
import type { SpotImage, SpotImageTargetType } from "../model/types";
import styles from "./spot-image-gallery.module.scss";

type SpotImageGalleryProps = {
  renderActions?: (image: SpotImage) => ReactNode;
  targetId: string;
  targetType: SpotImageTargetType;
};

export function SpotImageGallery({ renderActions, targetId, targetType }: SpotImageGalleryProps) {
  const locale = useLocale();
  const t = useTranslations("gallery");
  const { hasError, images } = useSpotImages(targetType, targetId);

  if (hasError) {
    return <p className={styles.error} role="alert">{t("loadError")}</p>;
  }

  if (images.length === 0) {
    return <p className={styles.empty}>{t("empty")}</p>;
  }

  return (
    <div className={styles.grid}>
      {images.map((image) => (
        <figure className={styles.item} key={image.id}>
          <div className={styles.image}>
            <Image
              fill
              unoptimized
              alt={locale === "en" ? image.caption.en || image.caption.uk : image.caption.uk}
              sizes="(max-width: 768px) 100vw, 33vw"
              src={image.url}
            />
          </div>
          <figcaption>{locale === "en" ? image.caption.en || image.caption.uk : image.caption.uk}</figcaption>
          {renderActions ? <div className={styles.actions}>{renderActions(image)}</div> : null}
        </figure>
      ))}
    </div>
  );
}
