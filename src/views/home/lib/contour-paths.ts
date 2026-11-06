const POINTS = 140;

/**
 * Builds deterministic bathymetric-style isolines (closed wobbly rings).
 * Values are rounded so the server and the browser serialize identical paths.
 */
export function createContourPaths(rings = 15, centerX = 760, centerY = 410): string[] {
  return Array.from({ length: rings }, (_, ring) => {
    const baseRadius = 34 + ring * 41;
    const commands: string[] = [];

    for (let point = 0; point <= POINTS; point += 1) {
      const angle = (point / POINTS) * Math.PI * 2;
      const wobble =
        1 +
        0.13 * Math.sin(3 * angle + ring * 0.42) +
        0.07 * Math.sin(5 * angle - ring * 0.7) +
        0.035 * Math.sin(8 * angle + ring * 1.1);
      const radius = baseRadius * wobble;
      const x = (centerX + Math.cos(angle) * radius * 1.18).toFixed(1);
      const y = (centerY + Math.sin(angle) * radius * 0.86).toFixed(1);
      commands.push(`${point === 0 ? "M" : "L"}${x} ${y}`);
    }

    return `${commands.join(" ")}Z`;
  });
}
