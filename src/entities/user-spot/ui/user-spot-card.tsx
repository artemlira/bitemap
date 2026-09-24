import Link from "next/link";
import type { ReactNode } from "react";
import type { UserSpot } from "../model/types";
import styles from "./user-spot-card.module.scss";

type UserSpotCardProps = {
  actionLabel?: string;
  footerActions?: ReactNode;
  href?: string;
  spot: UserSpot;
};

export function UserSpotCard({
  actionLabel = "Редагувати",
  footerActions,
  href,
  spot,
}: UserSpotCardProps) {
  const destination = href ?? `/my-spots/${spot.id}/edit`;

  return (
    <article className={styles.card}>
      <div className={styles.visual} data-tone={spot.tone} aria-hidden="true">
        <span>{spot.waterType}</span>
        <i />
      </div>
      <div className={styles.content}>
        <p className={styles.region}>{spot.settlement ? `${spot.region} · ${spot.settlement}` : spot.region}</p>
        <h2>{spot.name}</h2>
        <p className={styles.visibility}>{spot.visibility === "published" ? "Опубліковано для спільноти" : "Приватна водойма"}</p>
        <p className={styles.description}>{spot.description}</p>
        <p className={styles.fish}>{spot.fish.join(" · ")}</p>
        <div className={styles.footer}>
          <span>{spot.access}</span>
          <div className={styles.actions}>
            {footerActions}
            <Link href={destination}>{actionLabel}</Link>
          </div>
        </div>
      </div>
    </article>
  );
}
