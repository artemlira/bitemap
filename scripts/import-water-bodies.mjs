#!/usr/bin/env node
/**
 * Builds src/entities/fishing-spot/data/water-bodies.json from Wikidata (CC0),
 * Wikipedia summaries (CC BY-SA 4.0) and Wikimedia Commons image metadata.
 *
 * Usage: node scripts/import-water-bodies.mjs
 * The output file is committed, so the app never calls these APIs at runtime.
 */
import { writeFile } from "node:fs/promises";

const UA = { "User-Agent": "BiteMap/1.0 (https://bitemap.artemlira.com)" };
const OUT = new URL("../src/entities/fishing-spot/data/water-bodies.json", import.meta.url);

const TYPES = [
  { qid: "Q23397", type: "lake", requireArticle: false },
  { qid: "Q131681", type: "reservoir", requireArticle: false },
  { qid: "Q3253281", type: "pond", requireArticle: false },
  { qid: "Q12284", type: "canal", requireArticle: false },
  { qid: "Q4022", type: "river", requireArticle: true },
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function sparql(query) {
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const response = await fetch(`https://query.wikidata.org/sparql?query=${encodeURIComponent(query)}`, {
      headers: { ...UA, Accept: "application/sparql-results+json" },
    });
    if (response.ok) return (await response.json()).results.bindings;
    await sleep(2000 * (attempt + 1));
  }
  throw new Error("SPARQL failed");
}

function query({ qid, requireArticle }) {
  return `SELECT ?item ?uk ?en ?coord ?img ?oblUk ?oblEn ?ukWiki ?enWiki WHERE {
  ?item wdt:P31 wd:${qid}; wdt:P17 wd:Q212; wdt:P625 ?coord; rdfs:label ?uk. FILTER(lang(?uk)="uk")
  OPTIONAL { ?item rdfs:label ?en. FILTER(lang(?en)="en") }
  OPTIONAL { ?item wdt:P18 ?img }
  OPTIONAL {
    ?item wdt:P131+ ?obl. { ?obl wdt:P31 wd:Q3348196 } UNION { VALUES ?obl { wd:Q1899 } }
    ?obl rdfs:label ?oblUk. FILTER(lang(?oblUk)="uk")
    ?obl rdfs:label ?oblEn. FILTER(lang(?oblEn)="en")
  }
  ${requireArticle ? "" : "OPTIONAL "}{ ?ukArt schema:about ?item; schema:isPartOf <https://uk.wikipedia.org/>; schema:name ?ukWiki }
  OPTIONAL { ?enArt schema:about ?item; schema:isPartOf <https://en.wikipedia.org/>; schema:name ?enWiki }
}`;
}

const CYR = { а: "a", б: "b", в: "v", г: "h", ґ: "g", д: "d", е: "e", є: "ie", ж: "zh", з: "z", и: "y", і: "i", ї: "i", й: "i", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "kh", ц: "ts", ч: "ch", ш: "sh", щ: "shch", ь: "", ю: "iu", я: "ia", "'": "", "’": "" };
const slugify = (text) =>
  [...text.toLowerCase()].map((char) => CYR[char] ?? char).join("").normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

async function pool(items, size, worker) {
  const results = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: size }, async () => {
      while (next < items.length) {
        const index = next;
        next += 1;
        results[index] = await worker(items[index]).catch(() => null);
      }
    }),
  );
  return results;
}

function trimSentences(text, max = 260) {
  const clean = text.replace(/\s+/g, " ").replace(/\s*\([^)]*\)/g, "").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const end = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("! "));
  return end > 80 ? cut.slice(0, end + 1) : `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

async function summary(lang, title) {
  const response = await fetch(`https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replaceAll(" ", "_"))}`, { headers: UA });
  if (!response.ok) return null;
  const data = await response.json();
  return data.type === "standard" && data.extract ? trimSentences(data.extract) : null;
}

const stripHtml = (html = "") => html.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();

async function commonsInfo(files) {
  const info = {};
  for (let i = 0; i < files.length; i += 40) {
    const titles = files.slice(i, i + 40).map((file) => `File:${file}`).join("|");
    const url = `https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=800&titles=${encodeURIComponent(titles)}`;
    const data = await (await fetch(url, { headers: UA })).json();
    for (const page of Object.values(data.query?.pages ?? {})) {
      const image = page.imageinfo?.[0];
      const meta = image?.extmetadata;
      const license = meta?.LicenseShortName?.value;
      if (!image?.thumburl || !license || /non-?free|fair use/i.test(license)) continue;
      info[page.title.replace(/^File:/, "")] = {
        src: image.thumburl,
        creator: stripHtml(meta.Artist?.value) || "Wikimedia Commons",
        pageUrl: image.descriptionurl,
        license,
        licenseUrl: meta.LicenseUrl?.value ?? image.descriptionurl,
      };
    }
    await sleep(300);
  }
  return info;
}

const byItem = new Map();
for (const definition of TYPES) {
  const rows = await sparql(query(definition));
  for (const row of rows) {
    const qid = row.item.value.split("/").pop();
    if (byItem.has(qid)) continue;
    const match = /Point\(([-\d.]+) ([-\d.]+)\)/.exec(row.coord.value);
    if (!match || !row.oblUk) continue;
    const longitude = Number(match[1]);
    const latitude = Number(match[2]);
    byItem.set(qid, {
      qid,
      type: definition.type,
      name: { uk: row.uk.value, en: row.en?.value ?? null },
      latitude: Number(latitude.toFixed(5)),
      longitude: Number(longitude.toFixed(5)),
      region: { uk: row.oblUk.value, en: row.oblEn.value },
      image: row.img ? decodeURIComponent(row.img.value.split("/Special:FilePath/").pop()) : null,
      wiki: { uk: row.ukWiki?.value ?? null, en: row.enWiki?.value ?? null },
    });
  }
  console.log(definition.type, byItem.size);
  await sleep(1500);
}

const items = [...byItem.values()];
const [imageInfo] = await Promise.all([commonsInfo([...new Set(items.map((item) => item.image).filter(Boolean))])]);

const descriptions = await pool(items, 6, async (item) => ({
  uk: item.wiki.uk ? await summary("uk", item.wiki.uk) : null,
  en: item.wiki.en ? await summary("en", item.wiki.en) : null,
}));

const used = new Set();
const records = items
  .map((item, index) => {
    const base = slugify(item.name.en ?? item.name.uk) || item.qid.toLowerCase();
    let slug = base;
    if (used.has(slug)) slug = `${base}-${item.qid.toLowerCase()}`;
    used.add(slug);
    const photo = item.image ? imageInfo[item.image] : null;
    return {
      id: slug,
      qid: item.qid,
      type: item.type,
      name: item.name,
      region: item.region,
      latitude: item.latitude,
      longitude: item.longitude,
      description: { uk: descriptions[index]?.uk ?? null, en: descriptions[index]?.en ?? null },
      wikipedia: {
        uk: item.wiki.uk ? `https://uk.wikipedia.org/wiki/${encodeURIComponent(item.wiki.uk.replaceAll(" ", "_"))}` : null,
        en: item.wiki.en ? `https://en.wikipedia.org/wiki/${encodeURIComponent(item.wiki.en.replaceAll(" ", "_"))}` : null,
      },
      photo,
    };
  })
  .sort((a, b) => a.name.uk.localeCompare(b.name.uk, "uk"));

await writeFile(OUT, `${JSON.stringify({ importedAt: new Date().toISOString().slice(0, 10), records })}\n`);
console.log(`Wrote ${records.length} records, ${records.filter((r) => r.photo).length} photos, ${records.filter((r) => r.description.uk).length} uk descriptions`);
