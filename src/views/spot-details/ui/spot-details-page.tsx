"use client";

import { Link } from "@/shared/lib/i18n";
import { getFishingSpotFish, getFishingSpotText, type FishingSpot } from "@/entities/fishing-spot";
import { SpotImageGallery } from "@/entities/spot-image";
import { useLocale } from "next-intl";
import { FavoriteSpotButton } from "@/features/favorite-spot";
import { SpotImageUpload } from "@/features/upload-spot-image";
import { SiteHeader } from "@/widgets/site-header";
import styles from "./spot-details-page.module.scss";

type SpotDetailsPageProps = {
  spot: FishingSpot;
};

export function SpotDetailsPage({ spot }: SpotDetailsPageProps) {
  const locale = useLocale();
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
            <span aria-current="page">{getFishingSpotText(spot, "name", locale)}</span>
          </nav>

          <div className={styles.heroGrid}>
            <div>
              <p className={styles.eyebrow}>{getFishingSpotText(spot, "waterType", locale)}</p>
              <h1>{getFishingSpotText(spot, "name", locale)}</h1>
              <p className={styles.region}>{getFishingSpotText(spot, "region", locale)}</p>
              <p className={styles.description}>{getFishingSpotText(spot, "description", locale)}</p>
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
            <dd>{getFishingSpotText(spot, "waterType", locale)}</dd>
          </div>
          <div>
            <dt>Регіон</dt>
            <dd>{getFishingSpotText(spot, "region", locale)}</dd>
          </div>
          <div>
            <dt>Доступ</dt>
            <dd>{getFishingSpotText(spot, "access", locale)}</dd>
          </div>
        </dl>

        <div className={styles.fishSection}>
          <div>
            <p className={styles.sectionLabel}>Що можна зустріти</p>
            <h2>Риба у водоймі</h2>
          </div>
          <ul className={styles.fishList} aria-label="Види риби">
            {getFishingSpotFish(spot, locale).map((fish) => (
              <li key={fish}>{fish}</li>
            ))}
          </ul>
        </div>

        <section className={styles.gallery} aria-labelledby="spot-gallery-title">
          <div className={styles.sectionHeading}>
            <p className={styles.sectionLabel}>Фотографії спільноти</p>
            <h2 id="spot-gallery-title">Вода очима рибалок</h2>
          </div>
          <SpotImageGallery targetType="catalog" targetId={spot.id} />
          <SpotImageUpload targetType="catalog" targetId={spot.id} />
        </section>

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
