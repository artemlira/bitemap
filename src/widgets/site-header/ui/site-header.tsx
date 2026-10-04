"use client";

import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { Link } from "@/shared/lib/i18n";
import { useAuth } from "@/shared/lib/auth";
import { useAdminStatus } from "@/entities/admin";
import { useTheme } from "@/shared/lib/theme";
import { LanguageSwitcher } from "@/widgets/language-switcher";
import styles from "./site-header.module.scss";

const subscribeToDocument = () => () => {};
const getPortalRoot = () => document.body;
const getServerPortalRoot = () => null;

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const portalRoot = useSyncExternalStore(subscribeToDocument, getPortalRoot, getServerPortalRoot);
  const [menuPosition, setMenuPosition] = useState({ left: 0, top: 0, width: 0 });
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
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
        ...(isAdmin ? [{ href: "/admin/moderation", label: t("moderation") }] : []),
        ...(user ? [
        { href: "/favorites", label: t("favorites") },
        { href: "/my-spots", label: t("mySpots") },
        ] : []),
      ];

  useLayoutEffect(() => {
    if (!isMenuOpen) return;

    function updateMenuPosition() {
      if (window.innerWidth > 1040) {
        setIsMenuOpen(false);
        return;
      }

      const header = headerRef.current;
      if (!header) return;

      const bounds = header.getBoundingClientRect();
      setMenuPosition({
        left: bounds.left,
        top: bounds.bottom + 12,
        width: bounds.width,
      });
    }

    updateMenuPosition();
    window.addEventListener("resize", updateMenuPosition);
    window.addEventListener("scroll", updateMenuPosition, true);

    return () => {
      window.removeEventListener("resize", updateMenuPosition);
      window.removeEventListener("scroll", updateMenuPosition, true);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) return;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setIsMenuOpen(false);
      menuButtonRef.current?.focus();
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isMenuOpen]);

  const mobileMenuStyle = {
    "--mobile-menu-left": `${menuPosition.left}px`,
    "--mobile-menu-top": `${menuPosition.top}px`,
    "--mobile-menu-width": `${menuPosition.width}px`,
  } as CSSProperties;

  return (
    <header className={styles.header} ref={headerRef}>
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
        ref={menuButtonRef}
        type="button"
        aria-label={isMenuOpen ? t("closeMenu") : t("openMenu")}
        aria-expanded={isMenuOpen}
        aria-controls={portalRoot ? "site-header-menu" : undefined}
        onClick={() => setIsMenuOpen((open) => !open)}
      >
        <span aria-hidden="true" className={isMenuOpen ? styles.menuIconOpen : styles.menuIcon}>
          <span />
          <span />
          <span />
        </span>
      </button>

      {portalRoot ? createPortal(
        <div className={styles.mobileMenu} id="site-header-menu" hidden={!isMenuOpen} style={mobileMenuStyle}>
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
        </div>,
        portalRoot,
      ) : null}
    </header>
  );
}
