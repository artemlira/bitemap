"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/shared/lib/i18n";
import { useAuth } from "@/shared/lib/auth";
import { useAdminStatus } from "@/entities/admin";
import { useTheme } from "@/shared/lib/theme";
import { LanguageSwitcher } from "@/widgets/language-switcher";
import styles from "./site-header.module.scss";

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdminStatus();
  const t = useTranslations("navigation");
  const userName = user?.displayName ?? user?.email?.split("@")[0];
  const navigation = [
    { href: "/spots", label: t("spots") },
    { href: "/community", label: t("community") },
    { href: "/articles", label: t("articles") },
    { href: "/#how-it-works", label: t("howItWorks") },
  ];
  const navigationItems = [
        ...navigation,
        ...(user ? [{ href: "/feed", label: t("feed") }] : []),
        ...(isAdmin ? [{ href: "/admin/articles", label: t("manageArticles") }] : []),
        ...(user ? [
        { href: "/favorites", label: t("favorites") },
        { href: "/my-spots", label: t("mySpots") },
        ] : []),
      ];

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
            <Link className={styles.userName} href={`/anglers/${user.uid}`}>{userName}</Link>
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

      <button
        className={styles.menuButton}
        type="button"
        aria-label={isMenuOpen ? t("closeMenu") : t("openMenu")}
        aria-expanded={isMenuOpen}
        aria-controls="site-header-menu"
        onClick={() => setIsMenuOpen((open) => !open)}
      >
        <span aria-hidden="true" className={isMenuOpen ? styles.menuIconOpen : styles.menuIcon}>
          <span />
          <span />
          <span />
        </span>
      </button>

      <div className={styles.mobileMenu} id="site-header-menu" hidden={!isMenuOpen}>
          <nav className={styles.mobileNavigation} aria-label={t("main")}>
            {navigationItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setIsMenuOpen(false)}>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className={styles.mobileControls}>
            {user ? (
              <>
                <Link className={styles.userName} href={`/anglers/${user.uid}`} onClick={() => setIsMenuOpen(false)}>
                  {userName}
                </Link>
                <button className={styles.signOutButton} type="button" onClick={() => { setIsMenuOpen(false); void signOut(); }}>
                  {t("signOut")}
                </button>
              </>
            ) : (
              <Link className={styles.loginLink} href="/login" onClick={() => setIsMenuOpen(false)}>
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
      </div>
    </header>
  );
}
