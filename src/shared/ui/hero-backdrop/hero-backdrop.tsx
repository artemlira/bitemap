import styles from "./hero-backdrop.module.scss";

const WAVE_BACK = "M0 40C150 14 300 14 450 40S750 66 900 40 1050 14 1200 40 1350 66 1500 40 1650 14 1800 40 1950 66 2100 40 2250 14 2400 40V80H0Z";
const WAVE_FRONT = "M0 52C200 30 400 30 600 52S1000 74 1200 52 1400 30 1600 52 2000 74 2200 52 2300 44 2400 52V80H0Z";

/**
 * Animated water behind every inner page hero. Pure CSS motion: sliding waves along the
 * bottom edge (the front wave is page-coloured so the hero melts into the content),
 * rings spreading from a point and a drifting glow.
 */
export function HeroBackdrop() {
  return (
    <div className={styles.backdrop} aria-hidden="true">
      <span className={styles.glow} />
      <span className={styles.ring} />
      <span className={styles.ring} />
      <span className={styles.ring} />
      <svg className={styles.waveBack} viewBox="0 0 2400 80" preserveAspectRatio="none">
        <path d={WAVE_BACK} />
      </svg>
      <svg className={styles.waveFront} viewBox="0 0 2400 80" preserveAspectRatio="none">
        <path d={WAVE_FRONT} />
      </svg>
    </div>
  );
}
