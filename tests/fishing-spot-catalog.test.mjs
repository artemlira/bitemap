import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";

const require = createRequire(import.meta.url);
const { fishingSpots } = require("../node_modules/.cache/bitemap-catalog-tests/entities/fishing-spot/model/spot-data.js");
const { validateFishingSpot } = require("../node_modules/.cache/bitemap-catalog-tests/entities/fishing-spot/model/validation.js");
const { isWithinUkraine } = require("../node_modules/.cache/bitemap-catalog-tests/shared/lib/geo/ukraine-bounds.js");

test("every curated spot meets the publication standard", () => {
  const issues = fishingSpots.flatMap((spot) => validateFishingSpot(spot));
  assert.deepEqual(issues, []);
});

test("spot ids and slugs are unique", () => {
  assert.equal(new Set(fishingSpots.map((spot) => spot.id)).size, fishingSpots.length);
  assert.equal(new Set(fishingSpots.map((spot) => spot.slug)).size, fishingSpots.length);
});

test("unverified records never claim a verification date", () => {
  for (const spot of fishingSpots) {
    if (spot.verificationStatus !== "verified") assert.equal(spot.verifiedAt, undefined, spot.id);
  }
});

test("Ukraine bounds reject swapped coordinates and foreign points", () => {
  assert.equal(isWithinUkraine(50.45, 30.52), true);
  assert.equal(isWithinUkraine(30.52, 50.45), false);
  assert.equal(isWithinUkraine(52.52, 13.4), false);
  assert.equal(isWithinUkraine(Number.NaN, 30), false);
});
