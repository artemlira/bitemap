import { FishingSpotCard, fishingSpots } from "@/entities/fishing-spot";
import { SiteHeader } from "@/widgets/site-header";
import styles from "./spots-page.module.scss";

export function SpotsPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <SiteHeader />
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>Каталог водойм</p>
          <h1>Місця, куди хочеться вирушити ще до світанку.</h1>
          <p>
            Зберігаємо стартову добірку локацій для MVP. Згодом тут з’являться карта,
            фільтри, актуальна погода та відгуки спільноти.
          </p>
        </div>
      </section>

      <section className={styles.catalog} aria-labelledby="spots-title">
        <div className={styles.catalogHeading}>
          <div>
            <p className={styles.sectionLabel}>Обери напрямок</p>
            <h2 id="spots-title">Усі водойми</h2>
          </div>
          <p className={styles.counter}>{fishingSpots.length} локацій у каталозі</p>
        </div>

        <div className={styles.grid}>
          {fishingSpots.map((spot) => (
            <FishingSpotCard key={spot.id} spot={spot} />
          ))}
        </div>
      </section>
    </main>
  );
}
