import type { FishingSpot } from "../model/types";
import styles from "./fishing-spot-card.module.scss";

type FishingSpotCardProps = {
  spot: FishingSpot;
};

export function FishingSpotCard({ spot }: FishingSpotCardProps) {
  return (
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
}
