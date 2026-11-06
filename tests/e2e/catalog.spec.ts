import { expect, test } from "@playwright/test";

// These checks only read the public catalog, so they need no signed-in user.

test("the catalog lists waters, filters them by search and opens a water page", async ({ page }) => {
  await page.goto("/uk/spots");

  // The first page of results shows the best documented waters; search finds any specific one.
  await expect(page.getByRole("heading", { level: 3 }).first()).toBeVisible();

  await page.getByRole("searchbox", { name: /Пошук/ }).fill("Синевир");
  await expect(page.getByRole("heading", { level: 3, name: "Синевир" })).toBeVisible();
  await expect(page.getByText(/Локацій: \d+/)).toBeVisible();

  await page.getByRole("link", { name: "Синевир" }).first().click();
  await expect(page).toHaveURL(/\/uk\/spots\/synevyr$/);
  await expect(page.getByRole("heading", { level: 1, name: "Синевир" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Що тут ловлять рибалки" })).toBeVisible();
});

test("the region index and a region page show the catalog by oblast", async ({ page }) => {
  await page.goto("/uk/regions");
  await expect(page.getByRole("heading", { level: 1, name: "Води України по областях" })).toBeVisible();

  await page.getByRole("link", { name: /Київська область/ }).first().click();
  await expect(page).toHaveURL(/\/uk\/regions\/kyiv-oblast$/);
  await expect(page.getByRole("heading", { level: 1, name: "Київська область" })).toBeVisible();
});

test("every page ends with the footer that credits the open data sources", async ({ page }) => {
  await page.goto("/uk");

  const footer = page.getByRole("contentinfo");
  await expect(footer.getByRole("link", { name: "OpenStreetMap" })).toBeVisible();
  await expect(footer.getByRole("link", { name: "Wikidata" })).toBeVisible();
});
