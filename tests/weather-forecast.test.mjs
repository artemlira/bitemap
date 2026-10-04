import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";

const require = createRequire(import.meta.url);
const { getFishingActivity, getWeatherConditionKey } = require("../node_modules/.cache/bitemap-tests/fishing-activity.js");

function day(overrides = {}) {
  return {
    date: "2026-05-15",
    precipitationProbability: 10,
    temperatureMax: 20,
    temperatureMin: 12,
    weatherCode: 0,
    windSpeedMax: 10,
    ...overrides,
  };
}

test("scores mild, calm, dry spring weather as a favorable index, not a probability", () => {
  assert.deepEqual(getFishingActivity(day()), { level: "excellent", score: 73 });
});

test("caps thunderstorm conditions at the lowest index level", () => {
  const storm = getFishingActivity(day({ date: "2026-11-10", weatherCode: 95 }));

  assert.equal(storm.score, 30);
  assert.equal(storm.level, "low");
});

test("keeps every computed score within the documented 0–100 range", () => {
  const scenarios = [
    day({ date: "2026-01-10", temperatureMax: -25, temperatureMin: -35, windSpeedMax: 110, precipitationProbability: 100, weatherCode: 99 }),
    day({ date: "2026-07-10", temperatureMax: 50, temperatureMin: 45, windSpeedMax: 0, precipitationProbability: 0 }),
  ];

  for (const scenario of scenarios) {
    const result = getFishingActivity(scenario);
    assert.ok(result.score >= 0 && result.score <= 100);
  }
});

test("maps snow showers and blizzards to snow", () => {
  assert.equal(getWeatherConditionKey(85), "snow");
  assert.equal(getWeatherConditionKey(86), "snow");
});

test("maps thunderstorm WMO codes explicitly and unknown codes safely", () => {
  for (const code of [95, 96, 99]) assert.equal(getWeatherConditionKey(code), "thunderstorm");
  assert.equal(getWeatherConditionKey(999), "cloudy");
});
