import { Link } from "@/shared/lib/i18n";
import type { FishingSpot } from "../model/types";
import styles from "./fishing-spot-card.module.scss";

type FishingSpotCardProps = {
  spot: FishingSpot;
  href?: string;
};

export function FishingSpotCard({ spot, href }: FishingSpotCardProps) {
  const content = (
    <article className={styles.card}>
      <div className={styles.visual} data-tone={spot.tone} aria-hidden="true">
        <span>{spot.waterType}</span>
        <i />
      </div>

      <div className={styles.content}>
        <p className={styles.region}>{spot.region}</p>
        <h3>{spot.name}</h3>
        <p className={styles.description}>{spot.description}</p>
        <div className={styles.meta}>
          <span>{spot.fish.join(" · ")}</span>
          <span>{spot.access}</span>
        </div>
      </div>
    </article>
  );

  if (!href) {
    return content;
  }

  return (
    <Link className={styles.link} href={href}>
      {content}
    </Link>
  );
}
