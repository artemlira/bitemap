"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/shared/lib/i18n";
import styles from "./language-switcher.module.scss";

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("languageSwitcher");
  const nextLocale = locale === "uk" ? "en" : "uk";

  return (
    <button
      className={styles.button}
      type="button"
      onClick={() => router.replace(pathname, { locale: nextLocale })}
      aria-label={t("switchTo", { locale: nextLocale.toUpperCase() })}
    >
      {nextLocale.toUpperCase()}
    </button>
  );
}
