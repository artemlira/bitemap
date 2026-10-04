import { expect, test } from "@playwright/test";

test("рибалка реєструється та зберігає приватну водойму", async ({ page }) => {
  await page.route(
    /https:\/\/(identitytoolkit|securetoken|firestore)\.googleapis\.com\//,
    (route) => route.abort(),
  );

  const email = `bitemap-e2e-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.test`;
  const password = "Bitemap-E2E-Only-2026!";
  const spotName = `E2E Pond ${Date.now()}`;

  await page.goto("/uk/register");
  await page.getByRole("textbox", { name: "Електронна пошта" }).fill(email);
  await page.getByRole("textbox", { name: "Пароль", exact: true }).fill(password);
  await page.getByRole("textbox", { name: "Повтори пароль" }).fill(password);
  await page.getByRole("button", { name: "Створити акаунт" }).click();
  await expect(page.getByRole("status")).toContainText("Акаунт");

  await page.goto("/uk/my-spots/new");
  await page.getByRole("textbox", { name: "Назва водойми", exact: true }).fill(spotName);
  await page.getByRole("combobox", { name: "Область" }).selectOption({ label: "Київська область" });
  await page.getByRole("combobox", { name: "Громада або місто" }).selectOption({ label: "Ірпінська територіальна громада" });
  await page.getByRole("combobox", { name: "Населений пункт" }).selectOption({ label: "село Михайлівка-Рубежівка" });
  await page.getByRole("textbox", { name: "Тип водойми", exact: true }).fill("Озеро");
  await page.getByRole("textbox", { name: "Риба", exact: true }).fill("Короп, окунь");
  await page.getByRole("textbox", { name: "Короткий опис", exact: true })
    .fill("Тестова водойма для перевірки авторизованого сценарію.");

  const map = page.locator(".leaflet-container");
  await map.scrollIntoViewIfNeeded();
  const mapBounds = await map.boundingBox();

  if (!mapBounds) {
    throw new Error("Карта водойми не відобразилася.");
  }

  await page.mouse.click(mapBounds.x + mapBounds.width / 2, mapBounds.y + mapBounds.height / 2);
  await expect(page.getByText(/Координати: \d/)).toBeVisible();
  await page.getByRole("button", { name: "Додати водойму" }).click();

  await expect(page).toHaveURL(/\/uk\/my-spots$/);
  await expect(page.getByRole("heading", { name: spotName })).toBeVisible();
  await expect(page.getByText("Приватна водойма")).toBeVisible();

  await page.reload();
  await expect(page.getByRole("heading", { name: spotName })).toBeVisible();
});
