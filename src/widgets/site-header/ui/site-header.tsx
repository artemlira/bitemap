"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/shared/lib/i18n";
import { useAuth } from "@/shared/lib/auth";
import { useTheme } from "@/shared/lib/theme";
import { LanguageSwitcher } from "@/widgets/language-switcher";
import styles from "./site-header.module.scss";

export function SiteHeader() {
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const t = useTranslations("navigation");
  const userName = user?.displayName ?? user?.email?.split("@")[0];
  const navigation = [
    { href: "/spots", label: t("spots") },
    { href: "/community", label: t("community") },
    { href: "/#how-it-works", label: t("howItWorks") },
  ];
  const navigationItems = user
    ? [
        ...navigation,
        { href: "/favorites", label: t("favorites") },
        { href: "/my-spots", label: t("mySpots") },
      ]
    : navigation;

  return (
    <header className={styles.header}>
      <Link className={styles.logo} href="/" aria-label={t("home")}>
        Bite<span>Map</span>
      </Link>

      <nav className={styles.navigation} aria-label={t("main")}>
        {navigationItems.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className={styles.controls}>
        {user ? (
          <>
            <span className={styles.userName}>{userName}</span>
            <button className={styles.signOutButton} type="button" onClick={() => void signOut()}>
              {t("signOut")}
            </button>
          </>
        ) : (
          <Link className={styles.loginLink} href="/login">
            {t("logIn")}
          </Link>
        )}
        <LanguageSwitcher />
        <button
          className={styles.themeButton}
          type="button"
          onClick={toggleTheme}
          aria-label={theme === "light" ? t("enableDarkTheme") : t("enableLightTheme")}
        >
          <span aria-hidden="true">{theme === "light" ? "◐" : "◑"}</span>
        </button>
      </div>
    </header>
  );
}
