#!/usr/bin/env node
/**
 * Adds real water geometry from OpenStreetMap (ODbL, © OpenStreetMap contributors) to
 * src/entities/fishing-spot/data/water-bodies.json. OSM objects are matched through their
 * `wikidata` tag, so a record is only changed when the match is exact.
 *
 * For each matched record it stores a simplified outline/line (`shape`) and moves the pin onto
 * the water itself (the Wikidata point of a river is often a source or a mouth in a field).
 * Records without a match keep their coordinates and are flagged `locationApprox`.
 *
 * Usage: node scripts/import-water-geometry.mjs   (then node scripts/build-catalog-index.mjs)
 */
import { readFile, writeFile } from "node:fs/promises";

const FULL = new URL("../src/entities/fishing-spot/data/water-bodies.json", import.meta.url);
const ENDPOINTS = ["https://overpass-api.de/api/interpreter", "https://overpass.kumi.systems/api/interpreter"];
const UA = { "User-Agent": "BiteMap/1.0 (https://bitemap.artemlira.com)", "Content-Type": "application/x-www-form-urlencoded" };
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function overpass(query) {
  for (let attempt = 0; attempt < 6; attempt += 1) {
    const endpoint = ENDPOINTS[attempt % ENDPOINTS.length];
    try {
      const response = await fetch(endpoint, { method: "POST", headers: UA, body: `data=${encodeURIComponent(query)}` });
      if (response.ok) return (await response.json()).elements;
    } catch {
      /* try the next endpoint */
    }
    await sleep(8000 * (attempt + 1));
  }
  return null;
}

// ---- geometry helpers -------------------------------------------------------------------

const key = (point) => `${point.lat.toFixed(6)},${point.lon.toFixed(6)}`;

/** Joins way fragments that share end points into longer chains (rings for lakes). */
function chain(fragments) {
  const pieces = fragments.filter((piece) => piece.length > 1).map((piece) => piece.slice());
  const result = [];
  while (pieces.length) {
    let current = pieces.pop();
    let merged = true;
    while (merged) {
      merged = false;
      for (let i = 0; i < pieces.length; i += 1) {
        const other = pieces[i];
        const start = key(current[0]);
        const end = key(current[current.length - 1]);
        if (key(other[0]) === end) current = current.concat(other.slice(1));
        else if (key(other[other.length - 1]) === end) current = current.concat(other.slice(0, -1).reverse());
        else if (key(other[other.length - 1]) === start) current = other.concat(current.slice(1));
        else if (key(other[0]) === start) current = other.slice(1).reverse().concat(current);
        else continue;
        pieces.splice(i, 1);
        merged = true;
        break;
      }
    }
    result.push(current);
  }
  return result;
}

function simplify(points, epsilon) {
  if (points.length < 3) return points;
  const [a, b] = [points[0], points[points.length - 1]];
  let index = 0;
  let max = 0;
  for (let i = 1; i < points.length - 1; i += 1) {
    const distance = perpendicular(points[i], a, b);
    if (distance > max) {
      max = distance;
      index = i;
    }
  }
  if (max <= epsilon) return [a, b];
  return [...simplify(points.slice(0, index + 1), epsilon).slice(0, -1), ...simplify(points.slice(index), epsilon)];
}

function perpendicular(p, a, b) {
  const dx = b.lon - a.lon;
  const dy = b.lat - a.lat;
  const length = Math.hypot(dx, dy);
  if (length === 0) return Math.hypot(p.lon - a.lon, p.lat - a.lat);
  return Math.abs(dy * p.lon - dx * p.lat + b.lon * a.lat - b.lat * a.lon) / length;
}

function lengthOf(points) {
  let total = 0;
  for (let i = 1; i < points.length; i += 1) total += Math.hypot(points[i].lat - points[i - 1].lat, points[i].lon - points[i - 1].lon);
  return total;
}

function midpoint(points) {
  const half = lengthOf(points) / 2;
  let walked = 0;
  for (let i = 1; i < points.length; i += 1) {
    const step = Math.hypot(points[i].lat - points[i - 1].lat, points[i].lon - points[i - 1].lon);
    if (walked + step >= half && step > 0) {
      const ratio = (half - walked) / step;
      return { lat: points[i - 1].lat + (points[i].lat - points[i - 1].lat) * ratio, lon: points[i - 1].lon + (points[i].lon - points[i - 1].lon) * ratio };
    }
    walked += step;
  }
  return points[Math.floor(points.length / 2)];
}

function insideRing(point, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i, i += 1) {
    const crosses = ring[i].lat > point.lat !== ring[j].lat > point.lat &&
      point.lon < ((ring[j].lon - ring[i].lon) * (point.lat - ring[i].lat)) / (ring[j].lat - ring[i].lat) + ring[i].lon;
    if (crosses) inside = !inside;
  }
  return inside;
}

function ringCentroid(ring) {
  let lat = 0;
  let lon = 0;
  for (const point of ring) {
    lat += point.lat;
    lon += point.lon;
  }
  return { lat: lat / ring.length, lon: lon / ring.length };
}

function buildShape(element, type, wikidataPoint) {
  const fragments = element.type === "way"
    ? [element.geometry ?? []]
    : (element.members ?? []).filter((member) => member.type === "way" && member.geometry && member.role !== "inner").map((member) => member.geometry);
  const lines = chain(fragments);
  if (lines.length === 0) return null;

  const all = lines.flat();
  const lats = all.map((point) => point.lat);
  const lons = all.map((point) => point.lon);
  const diagonal = Math.hypot(Math.max(...lats) - Math.min(...lats), Math.max(...lons) - Math.min(...lons));
  const epsilon = diagonal / 140;
  const isArea = type !== "river" && type !== "canal";

  const kept = lines
    .map((line) => ({ line, size: lengthOf(line) }))
    .sort((a, b) => b.size - a.size)
    .slice(0, isArea ? 3 : 6)
    .map(({ line }) => simplify(line, epsilon));

  const main = kept[0];
  let pin;
  if (isArea) {
    const centroid = ringCentroid(main);
    pin = wikidataPoint && insideRing(wikidataPoint, main) ? wikidataPoint : insideRing(centroid, main) ? centroid : main[0];
  } else {
    pin = midpoint(main);
  }

  const round = (value) => Number(value.toFixed(4));
  return {
    pin: { latitude: round(pin.lat), longitude: round(pin.lon) },
    shape: { kind: isArea ? "area" : "line", lines: kept.map((line) => line.map((point) => [round(point.lat), round(point.lon)])) },
  };
}

// ---- run ---------------------------------------------------------------------------------

const dataset = JSON.parse(await readFile(FULL, "utf8"));
const records = dataset.records;

const groups = [
  { filter: (record) => record.type !== "river", size: 40 },
  { filter: (record) => record.type === "river", size: 12 },
];

let matched = 0;
for (const group of groups) {
  const todo = records.filter(group.filter).filter((record) => !record.shape && !record.geometryChecked);
  for (let i = 0; i < todo.length; i += group.size) {
    const batch = todo.slice(i, i + group.size);
    const pattern = batch.map((record) => record.qid).join("|");
    const elements = await overpass(`[out:json][timeout:180][maxsize:536870912];(rel["wikidata"~"^(${pattern})$"];way["wikidata"~"^(${pattern})$"];);out geom;`);
    if (elements) {
      const best = new Map();
      for (const element of elements) {
        const qid = element.tags?.wikidata;
        const size = element.type === "relation" ? (element.members ?? []).length : (element.geometry ?? []).length;
        if (qid && (!best.has(qid) || size > best.get(qid).size)) best.set(qid, { element, size });
      }
      for (const record of batch) {
        record.geometryChecked = true;
        const found = best.get(record.qid);
        if (!found) continue;
        const built = buildShape(found.element, record.type, { lat: record.latitude, lon: record.longitude });
        if (!built) continue;
        record.shape = built.shape;
        record.latitude = built.pin.latitude;
        record.longitude = built.pin.longitude;
        matched += 1;
      }
    }
    console.log(`${group.size === 12 ? "rivers" : "areas"} ${Math.min(i + group.size, todo.length)} / ${todo.length}, matched ${matched}`);
    await writeFile(FULL, `${JSON.stringify(dataset)}\n`); // checkpoint so a long run can resume
    await sleep(6000);
  }
}

for (const record of records) {
  if (!record.shape) record.locationApprox = true;
  delete record.geometryChecked;
}
await writeFile(FULL, `${JSON.stringify(dataset)}\n`);
console.log(`Done. shapes ${records.filter((record) => record.shape).length}, approximate ${records.filter((record) => record.locationApprox).length}`);
