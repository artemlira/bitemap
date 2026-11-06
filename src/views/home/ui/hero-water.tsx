"use client";

import { useRef, type CSSProperties } from "react";
import styles from "./hero-water.module.scss";

const FISH = [
  { top: 64, size: 1.0, duration: 38, delay: -4, reverse: false },
  { top: 72, size: 0.7, duration: 52, delay: -22, reverse: true },
  { top: 80, size: 1.35, duration: 64, delay: -40, reverse: false },
  { top: 88, size: 0.55, duration: 44, delay: -12, reverse: true },
  { top: 68, size: 0.45, duration: 30, delay: -18, reverse: false },
];

/**
 * Interactive calm-water scene: a float bobbing on layered waves, fish passing underneath
 * and ripples that follow the pointer. All motion is CSS; JavaScript only places ripples
 * and writes two CSS variables for the parallax.
 */
export function HeroWater() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const ripplesRef = useRef<HTMLDivElement>(null);
  const lastRipple = useRef(0);
  const frame = useRef(0);

  function spawnRipple(x: number, y: number, large: boolean) {
    const layer = ripplesRef.current;
    if (!layer || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (layer.childElementCount > 14) layer.firstElementChild?.remove();

    const ripple = document.createElement("span");
    ripple.className = large ? styles.rippleLarge : styles.ripple;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
    layer.append(ripple);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const scene = sceneRef.current;
    if (!scene || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const bounds = scene.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;

    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      scene.style.setProperty("--px", ((x / bounds.width - 0.5) * 2).toFixed(3));
      scene.style.setProperty("--py", ((y / bounds.height - 0.5) * 2).toFixed(3));
    });

    const now = performance.now();
    if (now - lastRipple.current > 160 && y > bounds.height * 0.5) {
      lastRipple.current = now;
      spawnRipple(x, y, false);
    }
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    const scene = sceneRef.current;
    if (!scene) return;
    const bounds = scene.getBoundingClientRect();
    spawnRipple(event.clientX - bounds.left, event.clientY - bounds.top, true);
  }

  return (
    <div
      ref={sceneRef}
      className={styles.scene}
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
    >
      <div className={styles.glow} aria-hidden="true" />

      <svg className={styles.fishLayer} aria-hidden="true" focusable="false">
        <defs>
          <symbol id="hero-fish" viewBox="0 0 56 22">
            <path d="M0 11C11 0 28 0 40 11 28 22 11 22 0 11Zm38 0 16-10v20Z" />
          </symbol>
        </defs>
      </svg>
      {FISH.map((fish, index) => (
        <svg
          key={index}
          className={styles.fish}
          data-reverse={fish.reverse}
          aria-hidden="true"
          focusable="false"
          style={
            {
              top: `${fish.top}%`,
              width: `${3.6 * fish.size}rem`,
              animationDuration: `${fish.duration}s`,
              animationDelay: `${fish.delay}s`,
            } as CSSProperties
          }
        >
          <use href="#hero-fish" />
        </svg>
      ))}

      <div className={styles.waterline} aria-hidden="true">
        <svg className={styles.waveBack} viewBox="0 0 2400 60" preserveAspectRatio="none">
          <path d="M0 30C100 10 200 10 300 30S500 50 600 30 800 10 900 30 1100 50 1200 30V60H0Z" />
          <path d="M1200 30C1300 10 1400 10 1500 30S1700 50 1800 30 2000 10 2100 30 2300 50 2400 30V60H1200Z" />
        </svg>
        <svg className={styles.waveFront} viewBox="0 0 2400 60" preserveAspectRatio="none">
          <path d="M0 34C120 18 240 18 360 34S600 50 720 34 960 18 1080 34 1140 40 1200 34V60H0Z" />
          <path d="M1200 34C1320 18 1440 18 1560 34S1800 50 1920 34 2160 18 2280 34 2340 40 2400 34V60H1200Z" />
        </svg>
      </div>

      <div className={styles.floatWrap} aria-hidden="true">
        <div className={styles.line} />
        <div className={styles.float}>
          <span className={styles.floatTip} />
          <span className={styles.floatBody} />
        </div>
        <span className={styles.biteRing} />
        <span className={styles.biteRing} style={{ animationDelay: "0.35s" }} />
        <span className={styles.biteRing} style={{ animationDelay: "0.7s" }} />
      </div>

      <div ref={ripplesRef} className={styles.ripples} aria-hidden="true" />
    </div>
  );
}
