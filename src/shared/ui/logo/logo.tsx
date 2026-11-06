import styles from "./logo.module.scss";

type LogoProps = {
  name: string;
};

/** Mark: a fishing float resting on rings of water. */
export function Logo({ name }: LogoProps) {
  return (
    <span className={styles.logo}>
      <svg className={styles.mark} viewBox="0 0 32 32" aria-hidden="true">
        <ellipse className={styles.ringOuter} cx="16" cy="25" rx="13" ry="4" />
        <ellipse className={styles.ringInner} cx="16" cy="25" rx="7.5" ry="2.2" />
        <path className={styles.line} d="M16 1v6" />
        <path className={styles.floatTop} d="M16 7c-3.2 0-4.6 2.6-4.6 5.4h9.2C20.6 9.6 19.2 7 16 7Z" />
        <path className={styles.floatBody} d="M11.4 12.4h9.2c0 4.6-1.9 8.4-4.6 8.4s-4.6-3.8-4.6-8.4Z" />
      </svg>
      <span className={styles.name}>{name}</span>
    </span>
  );
}
