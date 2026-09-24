import Link from "next/link";
import type { FishingSpot } from "@/entities/fishing-spot";
import { FavoriteSpotButton } from "@/features/favorite-spot";
import { SiteHeader } from "@/widgets/site-header";
import styles from "./spot-details-page.module.scss";

type SpotDetailsPageProps = {
  spot: FishingSpot;
};

export function SpotDetailsPage({ spot }: SpotDetailsPageProps) {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <SiteHeader />
        <div className={styles.heroContent}>
          <nav className={styles.breadcrumbs} aria-label="Навігація шляхом">
            <Link href="/">Головна</Link>
            <span aria-hidden="true">/</span>
            <Link href="/spots">Водойми</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{spot.name}</span>
          </nav>

          <div className={styles.heroGrid}>
            <div>
              <p className={styles.eyebrow}>{spot.waterType}</p>
              <h1>{spot.name}</h1>
              <p className={styles.region}>{spot.region}</p>
              <p className={styles.description}>{spot.description}</p>
              <FavoriteSpotButton spot={spot} />
            </div>
            <div className={styles.waterVisual} data-tone={spot.tone} aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
      </section>

      <section className={styles.details} aria-labelledby="details-title">
        <div className={styles.sectionHeading}>
          <p className={styles.sectionLabel}>Коротко про локацію</p>
          <h2 id="details-title">Плануй виїзд впевненіше</h2>
        </div>

        <dl className={styles.facts}>
          <div>
            <dt>Тип водойми</dt>
            <dd>{spot.waterType}</dd>
          </div>
          <div>
            <dt>Регіон</dt>
            <dd>{spot.region}</dd>
          </div>
          <div>
            <dt>Доступ</dt>
            <dd>{spot.access}</dd>
          </div>
        </dl>

        <div className={styles.fishSection}>
          <div>
            <p className={styles.sectionLabel}>Що можна зустріти</p>
            <h2>Риба у водоймі</h2>
          </div>
          <ul className={styles.fishList} aria-label="Види риби">
            {spot.fish.map((fish) => (
              <li key={fish}>{fish}</li>
            ))}
          </ul>
        </div>

        <aside className={styles.note}>
          <p>Дані MVP</p>
          <span>
            Це стартовий профіль водойми. Погоду, точку на карті й нотатки користувачів
            додамо після підключення бекенду.
          </span>
        </aside>
      </section>
    </main>
  );
}
