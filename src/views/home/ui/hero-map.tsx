"use client";

import { useRef, type CSSProperties } from "react";
import styles from "./hero-map.module.scss";

type HeroMapProps = {
  paths: readonly string[];
  readoutLabel: string;
};

// Rough bounding box of Ukraine, used to turn the pointer position into coordinates.
const BOUNDS = { north: 52.4, south: 44.4, west: 22.1, east: 40.2 };

function formatCoordinate(value: number, positive: string, negative: string) {
  return `${Math.abs(value).toFixed(4)}° ${value >= 0 ? positive : negative}`;
}

export function HeroMap({ paths, readoutLabel }: HeroMapProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const crosshairRef = useRef<HTMLDivElement>(null);
  const readoutRef = useRef<HTMLSpanElement>(null);

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const root = rootRef.current;
    const crosshair = crosshairRef.current;
    const readout = readoutRef.current;
    if (!root || !crosshair || !readout) return;

    const bounds = root.getBoundingClientRect();
    const x = Math.min(Math.max((event.clientX - bounds.left) / bounds.width, 0), 1);
    const y = Math.min(Math.max((event.clientY - bounds.top) / bounds.height, 0), 1);
    const latitude = BOUNDS.north - y * (BOUNDS.north - BOUNDS.south);
    const longitude = BOUNDS.west + x * (BOUNDS.east - BOUNDS.west);

    crosshair.style.transform = `translate3d(${x * bounds.width}px, ${y * bounds.height}px, 0)`;
    crosshair.dataset.active = "true";
    readout.textContent = `${formatCoordinate(latitude, "N", "S")}  ${formatCoordinate(longitude, "E", "W")}`;
  }

  function handlePointerLeave() {
    if (crosshairRef.current) crosshairRef.current.dataset.active = "false";
  }

  return (
    <div
      ref={rootRef}
      className={styles.map}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <svg className={styles.svg} viewBox="0 0 1200 820" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <g className={styles.contours}>
          {paths.map((path, index) => (
            <path
              key={index}
              d={path}
              pathLength={1}
              className={index % 4 === 0 ? styles.contourMajor : styles.contour}
              style={{ "--i": index } as CSSProperties}
            />
          ))}
        </g>
        <g className={styles.sonar} transform="translate(760 410)">
          <circle r="10" className={styles.sonarRing} />
          <circle r="10" className={styles.sonarRing} style={{ animationDelay: "1.3s" }} />
          <circle r="10" className={styles.sonarRing} style={{ animationDelay: "2.6s" }} />
          <circle r="5" className={styles.sonarCore} />
        </g>
      </svg>

      <div ref={crosshairRef} className={styles.crosshair} data-active="false" aria-hidden="true">
        <span />
      </div>

      <p className={styles.readout} aria-hidden="true">
        <span className={styles.readoutLabel}>{readoutLabel}</span>
        <span ref={readoutRef}>50.4501° N  30.5234° E</span>
      </p>
    </div>
  );
}
