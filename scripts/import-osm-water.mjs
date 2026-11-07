#!/usr/bin/env node
/**
 * Adds named lakes, ponds and reservoirs from OpenStreetMap (ODbL, © OpenStreetMap contributors)
 * that Wikidata does not know about: src/entities/fishing-spot/data/osm-water.json.
 *
 * - One Overpass query per oblast, so every record gets its region from the boundary, not a guess.
 * - OSM `fee` / `access` tags become the access category (fee=yes -> paid, fee=no -> free,
 *   access=private -> restricted). Nothing is inferred when the tags are absent.
 * - Objects already in the Wikidata dataset (same wikidata id, or same name within 2 km) are skipped.
 *
 * Usage: node scripts/import-osm-water.mjs [oblastCode ...]   (then node scripts/build-catalog-index.mjs)
 */
import { readFile, writeFile } from "node:fs/promises";

const OUT = new URL("../src/entities/fishing-spot/data/osm-water.json", import.meta.url);
const MAIN = new URL("../src/entities/fishing-spot/data/water-bodies.json", import.meta.url);
const ENDPOINTS = ["https://overpass-api.de/api/interpreter", "https://overpass.kumi.systems/api/interpreter"];
const HEADERS = { "User-Agent": "BiteMap/1.0 (https://bitemap.artemlira.com)", "Content-Type": "application/x-www-form-urlencoded" };
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const OBLASTS = {
  "UA-05": ["Вінницька область", "Vinnytsia Oblast"], "UA-07": ["Волинська область", "Volyn Oblast"],
  "UA-12": ["Дніпропетровська область", "Dnipropetrovsk Oblast"], "UA-14": ["Донецька область", "Donetsk Oblast"],
  "UA-18": ["Житомирська область", "Zhytomyr Oblast"], "UA-21": ["Закарпатська область", "Zakarpattia Oblast"],
  "UA-23": ["Запорізька область", "Zaporizhzhia Oblast"], "UA-26": ["Івано-Франківська область", "Ivano-Frankivsk Oblast"],
  "UA-30": ["Київ", "Kyiv"], "UA-32": ["Київська область", "Kyiv Oblast"], "UA-35": ["Кіровоградська область", "Kirovohrad Oblast"],
  "UA-09": ["Луганська область", "Luhansk Oblast"], "UA-46": ["Львівська область", "Lviv Oblast"],
  "UA-48": ["Миколаївська область", "Mykolaiv Oblast"], "UA-51": ["Одеська область", "Odesa Oblast"],
  "UA-53": ["Полтавська область", "Poltava Oblast"], "UA-56": ["Рівненська область", "Rivne Oblast"],
  "UA-59": ["Сумська область", "Sumy Oblast"], "UA-61": ["Тернопільська область", "Ternopil Oblast"],
  "UA-63": ["Харківська область", "Kharkiv Oblast"], "UA-65": ["Херсонська область", "Kherson Oblast"],
  "UA-68": ["Хмельницька область", "Khmelnytskyi Oblast"], "UA-71": ["Черкаська область", "Cherkasy Oblast"],
  "UA-73": ["Чернівецька область", "Chernivtsi Oblast"], "UA-74": ["Чернігівська область", "Chernihiv Oblast"],
};

const CYR = { а: "a", б: "b", в: "v", г: "h", ґ: "g", д: "d", е: "e", є: "ie", ж: "zh", з: "z", и: "y", і: "i", ї: "i", й: "i", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "kh", ц: "ts", ч: "ch", ш: "sh", щ: "shch", ь: "", ю: "iu", я: "ia", "'": "", "’": "" };
const slugify = (text) => [...text.toLowerCase()].map((c) => CYR[c] ?? c).join("").normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

async function overpass(query) {
  for (let attempt = 0; attempt < 6; attempt += 1) {
    try {
      const response = await fetch(ENDPOINTS[attempt % ENDPOINTS.length], { method: "POST", headers: HEADERS, body: `data=${encodeURIComponent(query)}` });
      if (response.ok) return (await response.json()).elements;
    } catch {
      /* next endpoint */
    }
    await sleep(10000 * (attempt + 1));
  }
  return null;
}

function typeOf(tags) {
  const water = tags.water;
  if (water === "pond" || water === "basin") return "pond";
  if (water === "reservoir") return "reservoir";
  if (["lake", "oxbow", "lagoon"].includes(water)) return "lake";
  if (["river", "canal", "stream", "ditch", "drain", "wastewater"].includes(water)) return null;
  return /став|ставок/i.test(tags.name ?? "") ? "pond" : "lake";
}

function accessOf(tags) {
  if (tags.access === "private" || tags.access === "no") return "restricted";
  if (tags.fee === "yes") return "paid";
  if (tags.fee === "no") return "free";
  return "unknown";
}

const km = (a, b) => {
  const toRad = (v) => (v * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
};

const main = JSON.parse(await readFile(MAIN, "utf8")).records;
const knownQids = new Set(main.map((record) => record.qid));
const byName = new Map();
for (const record of main) {
  const list = byName.get(record.name.uk.toLowerCase()) ?? [];
  list.push({ lat: record.latitude, lon: record.longitude });
  byName.set(record.name.uk.toLowerCase(), list);
}

const wanted = process.argv.slice(2);
const codes = wanted.length ? wanted : Object.keys(OBLASTS);
let existing = { importedAt: "", records: [] };
try {
  existing = JSON.parse(await readFile(OUT, "utf8"));
} catch {
  /* first run */
}
const records = existing.records.filter((record) => !codes.includes(record.oblast));
const used = new Set(records.map((record) => record.id));

for (const code of codes) {
  const query = `[out:json][timeout:300][maxsize:1073741824];area["ISO3166-2"="${code}"]->.a;(way["natural"="water"]["name"](area.a);relation["natural"="water"]["name"](area.a););out center tags;`;
  const elements = await overpass(query);
  if (!elements) {
    console.log(code, "failed");
    continue;
  }
  let added = 0;
  for (const element of elements) {
    const tags = element.tags ?? {};
    const center = element.center ?? (element.lat ? { lat: element.lat, lon: element.lon } : null);
    const type = typeOf(tags);
    const name = (tags["name:uk"] ?? tags.name ?? "").trim();
    if (!center || !type || name.length < 2) continue;
    if (tags.wikidata && knownQids.has(tags.wikidata)) continue;
    if ((byName.get(name.toLowerCase()) ?? []).some((point) => km(point, center) < 2)) continue;

    const osmRef = `${element.type}/${element.id}`;
    let id = `${slugify(name) || "water"}-${element.type[0]}${element.id}`;
    if (used.has(id)) id = `${id}-x`;
    used.add(id);
    records.push({
      id,
      osm: osmRef,
      oblast: code,
      type,
      name: { uk: name, en: tags["name:en"] ?? null },
      region: { uk: OBLASTS[code][0], en: OBLASTS[code][1] },
      latitude: Number(center.lat.toFixed(5)),
      longitude: Number(center.lon.toFixed(5)),
      accessCategory: accessOf(tags),
    });
    added += 1;
  }
  console.log(code, OBLASTS[code][0], `${elements.length} found, ${added} added`);
  await writeFile(OUT, `${JSON.stringify({ importedAt: new Date().toISOString().slice(0, 10), records })}\n`);
  await sleep(8000);
}
console.log("Done:", records.length, "records");
