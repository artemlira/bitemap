import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";

const require = createRequire(import.meta.url);
const dataset = require("../src/entities/fishing-spot/data/water-bodies.json");
const index = require("../public/data/water-bodies-index.json");
const osm = require("../src/entities/fishing-spot/data/osm-water.json");
const { buildFishingSpot } = require("../node_modules/.cache/bitemap-catalog-tests/entities/fishing-spot/model/catalog-mapping.js");
const { validateFishingSpot } = require("../node_modules/.cache/bitemap-catalog-tests/entities/fishing-spot/model/validation.js");
const { isWithinUkraine } = require("../node_modules/.cache/bitemap-catalog-tests/shared/lib/geo/ukraine-bounds.js");

test("imported catalog is large enough and ids are unique", () => {
  assert.ok(dataset.records.length > 1000);
  assert.equal(new Set(dataset.records.map((record) => record.id)).size, dataset.records.length);
});

test("every imported record meets the publication standard", () => {
  const issues = dataset.records.flatMap((record) =>
    validateFishingSpot(buildFishingSpot(record, dataset.importedAt, record)),
  );
  assert.deepEqual(issues.slice(0, 5), []);
});

test("public index contains the Wikidata records first, then the OpenStreetMap ones", () => {
  assert.equal(index.items.length, dataset.records.length + osm.records.length);
  assert.deepEqual(index.items.slice(0, dataset.records.length).map((item) => item[0]), dataset.records.map((record) => record.id));
});

test("OpenStreetMap records have unique ids, valid access categories and Ukrainian coordinates", () => {
  const ids = new Set(osm.records.map((record) => record.id));
  assert.equal(ids.size, osm.records.length);
  for (const record of osm.records) {
    assert.ok(["unknown", "free", "paid", "restricted"].includes(record.accessCategory), record.id);
    assert.ok(isWithinUkraine(record.latitude, record.longitude), record.id);
  }
});

test("every photo carries author and license", () => {
  for (const record of dataset.records.filter((item) => item.photo)) {
    assert.ok(record.photo.creator && record.photo.license && record.photo.licenseUrl, record.id);
  }
});

test("Ukraine bounds reject swapped coordinates and foreign points", () => {
  assert.equal(isWithinUkraine(50.45, 30.52), true);
  assert.equal(isWithinUkraine(30.52, 50.45), false);
  assert.equal(isWithinUkraine(52.52, 13.4), false);
  assert.equal(isWithinUkraine(Number.NaN, 30), false);
});
