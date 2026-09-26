"use client";

import Image from "next/image";
import { useLocale } from "next-intl";
import { useSpotImages } from "../model/use-spot-images";
import type { SpotImageTargetType } from "../model/types";
import styles from "./spot-image-gallery.module.scss";

type SpotImageGalleryProps = {
  targetId: string;
  targetType: SpotImageTargetType;
};

export function SpotImageGallery({ targetId, targetType }: SpotImageGalleryProps) {
  const locale = useLocale();
  const { error, images } = useSpotImages(targetType, targetId);

  if (error) {
    return <p className={styles.error} role="alert">{error}</p>;
  }

  if (images.length === 0) {
    return <p className={styles.empty}>Фотографій поки немає.</p>;
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
        </figure>
      ))}
    </div>
  );
}
