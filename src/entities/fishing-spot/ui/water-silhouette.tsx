import type { FishingSpotShape } from "../model/types";
import styles from "./water-silhouette.module.scss";

type WaterSilhouetteProps = {
  shape: FishingSpotShape;
  className?: string;
};

const WIDTH = 240;
const HEIGHT = 150;
const PADDING = 14;

/** Draws the real outline (lake) or course (river) as an SVG, scaled to fit and not distorted. */
export function WaterSilhouette({ shape, className }: WaterSilhouetteProps) {
  const points = shape.lines.flat();
  if (points.length < 2) return null;

  const lats = points.map(([lat]) => lat);
  const lons = points.map(([, lon]) => lon);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLon = Math.min(...lons);
  const maxLon = Math.max(...lons);
  const lonScale = Math.cos((((minLat + maxLat) / 2) * Math.PI) / 180);
  const spanX = Math.max((maxLon - minLon) * lonScale, 1e-6);
  const spanY = Math.max(maxLat - minLat, 1e-6);
  const scale = Math.min((WIDTH - PADDING * 2) / spanX, (HEIGHT - PADDING * 2) / spanY);
  const offsetX = (WIDTH - spanX * scale) / 2;
  const offsetY = (HEIGHT - spanY * scale) / 2;

  const project = ([lat, lon]: [number, number]) =>
    `${(offsetX + (lon - minLon) * lonScale * scale).toFixed(1)} ${(offsetY + (maxLat - lat) * scale).toFixed(1)}`;

  const isArea = shape.kind === "area";
  const paths = shape.lines.map((line) => `M${line.map(project).join("L")}${isArea ? "Z" : ""}`);

  return (
    <svg className={[styles.silhouette, className].filter(Boolean).join(" ")} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} aria-hidden="true" focusable="false">
      {paths.map((d, index) => (
        <path key={index} d={d} className={isArea ? styles.area : styles.line} pathLength={1} />
      ))}
    </svg>
  );
}
