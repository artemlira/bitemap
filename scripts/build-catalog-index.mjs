#!/usr/bin/env node
/**
 * Cleans src/entities/fishing-spot/data/water-bodies.json and builds the compact
 * public index used by the catalog list: public/data/water-bodies-index.json.
 * Run after scripts/import-water-bodies.mjs (it is idempotent).
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";

const FULL = new URL("../src/entities/fishing-spot/data/water-bodies.json", import.meta.url);
const INDEX = new URL("../public/data/water-bodies-index.json", import.meta.url);

const dataset = JSON.parse(await readFile(FULL, "utf8"));

// Wikidata also holds numbered park features ("3.1. ...") and unnamed placeholders.
const isJunk = (record) => /^\d+([.\d]*)\s/.test(record.name.uk) || /^[\d\s.,-]+$/.test(record.name.uk);
// Long rivers are stored with a source or mouth point that may lie outside Ukraine.
// For the biggest ones we pin a well-known stretch inside the country instead;
// every other record outside Ukraine's bounds is dropped.
const PIN_OVERRIDES = {
  dnieper: { latitude: 50.4501, longitude: 30.5589, region: { uk: "Київ", en: "Kyiv" } },
  desna: { latitude: 51.4946, longitude: 31.2886, region: { uk: "Чернігівська область", en: "Chernihiv Oblast" } },
  "western-bug": { latitude: 50.8505, longitude: 24.3184, region: { uk: "Волинська область", en: "Volyn Oblast" } },
  donets: { latitude: 49.2078, longitude: 37.2625, region: { uk: "Харківська область", en: "Kharkiv Oblast" } },
};
const inUkraine = ({ latitude, longitude }) => latitude >= 44.3 && latitude <= 52.4 && longitude >= 22.1 && longitude <= 40.3;

const records = dataset.records
  .filter((record) => !isJunk(record))
  .map((record) => (PIN_OVERRIDES[record.id] ? { ...record, ...PIN_OVERRIDES[record.id] } : record))
  .filter(inUkraine);

const types = ["lake", "reservoir", "river", "canal", "pond"];
const regions = [];
const regionIndex = (region) => {
  let index = regions.findIndex((item) => item.uk === region.uk);
  if (index === -1) index = regions.push(region) - 1;
  return index;
};

const items = records.map((record) => [
  record.id,
  record.name.uk,
  record.name.en ?? "",
  types.indexOf(record.type),
  regionIndex(record.region),
  record.latitude,
  record.longitude,
]);

await writeFile(FULL, `${JSON.stringify({ importedAt: dataset.importedAt, records })}\n`);
await mkdir(new URL("../public/data/", import.meta.url), { recursive: true });
await writeFile(INDEX, `${JSON.stringify({ importedAt: dataset.importedAt, types, regions, items })}\n`);
console.log(`Kept ${records.length} of ${dataset.records.length}; index ${JSON.stringify({ types, regions, items }).length} bytes`);
