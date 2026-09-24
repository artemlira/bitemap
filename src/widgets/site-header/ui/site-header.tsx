"use client";

import Link from "next/link";
import { useAuth } from "@/shared/lib/auth";
import { useTheme } from "@/shared/lib/theme";
import styles from "./site-header.module.scss";

const navigation = [
  { href: "/spots", label: "Водойми" },
  { href: "/#how-it-works", label: "Як це працює" },
];

export function SiteHeader() {
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const userName = user?.displayName ?? user?.email?.split("@")[0];
  const navigationItems = user ? [...navigation, { href: "/favorites", label: "Мої водойми" }] : navigation;

  return (
    <header className={styles.header}>
      <Link className={styles.logo} href="/" aria-label="BiteMap — на головну">
        Bite<span>Map</span>
      </Link>

      <nav className={styles.navigation} aria-label="Основна навігація">
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
              Вийти
            </button>
          </>
        ) : (
          <Link className={styles.loginLink} href="/login">
            Увійти
          </Link>
        )}
        <button
          className={styles.themeButton}
          type="button"
          onClick={toggleTheme}
          aria-label={theme === "light" ? "Увімкнути темну тему" : "Увімкнути світлу тему"}
        >
          <span aria-hidden="true">{theme === "light" ? "◐" : "◑"}</span>
        </button>
      </div>
    </header>
  );
}
