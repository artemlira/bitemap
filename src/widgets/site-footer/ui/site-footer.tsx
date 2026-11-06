import { getTranslations } from "next-intl/server";
import { Link } from "@/shared/lib/i18n";
import { Logo } from "@/shared/ui/logo";
import styles from "./site-footer.module.scss";

const SOURCES = [
  { name: "Wikidata", license: "CC0", href: "https://www.wikidata.org" },
  { name: "OpenStreetMap", license: "ODbL", href: "https://www.openstreetmap.org/copyright" },
  { name: "Wikipedia", license: "CC BY-SA 4.0", href: "https://uk.wikipedia.org" },
  { name: "Wikimedia Commons", license: "", href: "https://commons.wikimedia.org" },
];

export async function SiteFooter() {
  const t = await getTranslations("footer");
  const nav = await getTranslations("navigation");

  const links = [
    { href: "/spots", label: nav("spots") },
    { href: "/community", label: nav("community") },
    { href: "/articles", label: nav("articles") },
    { href: "/#how-it-works", label: nav("howItWorks") },
  ] as const;

  return (
    <footer className={styles.footer}>
      <svg className={styles.wave} viewBox="0 0 2400 80" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 40C150 14 300 14 450 40S750 66 900 40 1050 14 1200 40 1350 66 1500 40 1650 14 1800 40 1950 66 2100 40 2250 14 2400 40V80H0Z" />
      </svg>

      <div className={styles.inner}>
        <div className={styles.brand}>
          <Logo name={nav("brand")} />
          <p>{t("tagline")}</p>
        </div>

        <nav className={styles.column} aria-label={t("sections")}>
          <h2>{t("sections")}</h2>
          <ul>
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.column}>
          <h2>{t("data")}</h2>
          <ul>
            {SOURCES.map((source) => (
              <li key={source.name}>
                <a href={source.href} target="_blank" rel="noreferrer">
                  {source.name}
                </a>
                {source.license ? <span> · {source.license}</span> : null}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>© {new Date().getFullYear()} {nav("brand")}</p>
        <p>{t("disclaimer")}</p>
        <a className={styles.top} href="#top">{t("backToTop")}</a>
      </div>
    </footer>
  );
}
