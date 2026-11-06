#!/usr/bin/env node
/**
 * Adds facts (length, area, depth, elevation, basin, mouth, district), better descriptions and
 * fish species to src/entities/fishing-spot/data/water-bodies.json.
 *
 * - Facts: Wikidata (CC0).
 * - Description and fish: Wikipedia article text (CC BY-SA 4.0). A fish is listed only when the
 *   article names it; it is never guessed. The page links back to the article.
 *
 * Usage: node scripts/enrich-water-bodies.mjs   (then node scripts/build-catalog-index.mjs)
 */
import { readFile, writeFile } from "node:fs/promises";

const UA = { "User-Agent": "BiteMap/1.0 (https://bitemap.artemlira.com)" };
const FULL = new URL("../src/entities/fishing-spot/data/water-bodies.json", import.meta.url);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const FISH = [
  ["Щука", ["щук"]], ["Короп", ["короп", "коропа", "коропи"]], ["Сазан", ["сазан"]], ["Лящ", ["лящ"]],
  ["Плітка", ["плітк", "плотв"]], ["Окунь", ["окун"]], ["Судак", ["судак"]], ["Сом", ["сом", "сома", "сому", "сомі", "сомів"]],
  ["Карась", ["карас"]], ["Лин", ["лин", "лина", "лині"]], ["Жерех", ["жерех"]], ["Голавль", ["голавл", "головен"]],
  ["Краснопірка", ["краснопірк"]], ["Білий амур", ["амур"]], ["Товстолоб", ["товстолоб"]], ["Форель", ["форел"]],
  ["Харіус", ["харіус"]], ["Марена", ["марен"]], ["Уклея", ["уклей", "уклії"]], ["Йорж", ["йорж"]], ["В'юн", ["в'юн"]],
  ["Бичок", ["бичк"]], ["Осетер", ["осетр", "осетер"]], ["Вугор", ["вугор", "вугр"]], ["Підуст", ["підуст"]],
  ["Чехоня", ["чехон"]], ["Білизна", ["білизн"]], ["Гольян", ["гольян"]], ["Лосось", ["лосос"]], ["Кефаль", ["кефал"]],
  ["Бабець", ["бабц", "бабка"]], ["Пічкур", ["пічкур"]], ["Скумбрія", ["скумбр"]], ["Тарань", ["тарань", "тарані"]],
];

function detectFish(text) {
  const tokens = new Set(text.toLowerCase().split(/[^а-яіїєґ'’]+/u).filter(Boolean).map((token) => token.replaceAll("’", "'")));
  const found = [];
  for (const [name, stems] of FISH) {
    const exact = ["Сом", "Лин"].includes(name);
    const hit = [...tokens].some((token) =>
      exact ? stems.includes(token) : stems.some((stem) => token.startsWith(stem) && token.length <= stem.length + 5),
    );
    if (hit) found.push(name);
  }
  return found;
}

async function fetchJson(url, headers = UA) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const response = await fetch(url, { headers });
    if (response.ok) return response.json();
    if (response.status === 404) return null;
    await sleep(1500 * (attempt + 1));
  }
  return null;
}

async function pool(items, size, worker) {
  let next = 0;
  await Promise.all(
    Array.from({ length: size }, async () => {
      while (next < items.length) {
        const index = next;
        next += 1;
        await worker(items[index], index).catch(() => undefined);
      }
    }),
  );
}

function trimSentences(text, max = 300) {
  const clean = text.replace(/\s+/g, " ").replace(/\s*\([^)]*\)/g, "").replace(/\s*\[[^\]]*\]/g, "").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const end = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("! "));
  return end > 80 ? cut.slice(0, end + 1) : `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

const dataset = JSON.parse(await readFile(FULL, "utf8"));
const records = dataset.records;
const byQid = new Map(records.map((record) => [record.qid, record]));

// 1. Facts from Wikidata, in batches.
const qids = records.map((record) => record.qid);
for (let i = 0; i < qids.length; i += 120) {
  const values = qids.slice(i, i + 120).map((qid) => `wd:${qid}`).join(" ");
  const query = `SELECT ?i ?len ?area ?depth ?elev ?basinUk ?basinEn ?mouthUk ?mouthEn ?adminUk ?adminEn WHERE {
    VALUES ?i { ${values} }
    OPTIONAL { ?i wdt:P2043 ?len } OPTIONAL { ?i wdt:P2046 ?area } OPTIONAL { ?i wdt:P4511 ?depth } OPTIONAL { ?i wdt:P2044 ?elev }
    OPTIONAL { ?i wdt:P4614 ?b. ?b rdfs:label ?basinUk. FILTER(lang(?basinUk)="uk") OPTIONAL { ?b rdfs:label ?basinEn. FILTER(lang(?basinEn)="en") } }
    OPTIONAL { ?i wdt:P403 ?m. ?m rdfs:label ?mouthUk. FILTER(lang(?mouthUk)="uk") OPTIONAL { ?m rdfs:label ?mouthEn. FILTER(lang(?mouthEn)="en") } }
    OPTIONAL { ?i wdt:P131 ?a. ?a rdfs:label ?adminUk. FILTER(lang(?adminUk)="uk") OPTIONAL { ?a rdfs:label ?adminEn. FILTER(lang(?adminEn)="en") } }
  }`;
  const data = await fetchJson(`https://query.wikidata.org/sparql?query=${encodeURIComponent(query)}`, { ...UA, Accept: "application/sparql-results+json" });
  for (const row of data?.results.bindings ?? []) {
    const record = byQid.get(row.i.value.split("/").pop());
    if (!record) continue;
    const facts = (record.facts ??= {});
    const num = (cell, digits = 1) => (cell && Number.isFinite(Number(cell.value)) ? Number(Number(cell.value).toFixed(digits)) : undefined);
    facts.lengthKm ??= num(row.len);
    facts.areaKm2 ??= num(row.area);
    facts.maxDepthM ??= num(row.depth);
    facts.elevationM ??= num(row.elev, 0);
    const pair = (uk, en) => (uk ? { uk: uk.value, en: en?.value ?? uk.value } : undefined);
    facts.basin ??= pair(row.basinUk, row.basinEn);
    facts.flowsInto ??= pair(row.mouthUk, row.mouthEn);
    facts.district ??= pair(row.adminUk, row.adminEn);
  }
  console.log("facts", Math.min(i + 120, qids.length), "/", qids.length);
  await sleep(1200);
}
for (const record of records) {
  if (record.facts) for (const key of Object.keys(record.facts)) if (record.facts[key] === undefined) delete record.facts[key];
  if (record.facts && Object.keys(record.facts).length === 0) delete record.facts;
}

// 2. Article text: description (when missing) and fish mentioned in the article.
const withArticle = records.filter((record) => record.wikipedia.uk);
let done = 0;
await pool(withArticle, 4, async (record) => {
  const title = decodeURIComponent(record.wikipedia.uk.split("/wiki/").pop()).replaceAll("_", " ");
  const data = await fetchJson(`https://uk.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext=1&redirects=1&format=json&titles=${encodeURIComponent(title)}`);
  const page = Object.values(data?.query?.pages ?? {})[0];
  const text = page?.extract;
  if (text) {
    if (!record.description.uk) {
      const intro = text.split("\n").find((line) => line.trim().length > 60);
      if (intro) record.description.uk = trimSentences(intro);
    }
    const fish = detectFish(text);
    if (fish.length > 0) record.fish = fish;
  }
  done += 1;
  if (done % 200 === 0) console.log("articles", done, "/", withArticle.length);
});

// 3. English descriptions that are still missing.
const needEn = records.filter((record) => record.wikipedia.en && !record.description.en);
await pool(needEn, 4, async (record) => {
  const title = decodeURIComponent(record.wikipedia.en.split("/wiki/").pop());
  const data = await fetchJson(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`);
  if (data?.type === "standard" && data.extract) record.description.en = trimSentences(data.extract);
});

await writeFile(FULL, `${JSON.stringify(dataset)}\n`);
console.log(
  `facts ${records.filter((r) => r.facts).length}, fish ${records.filter((r) => r.fish).length}, uk descriptions ${records.filter((r) => r.description.uk).length}, en ${records.filter((r) => r.description.en).length}`,
);
