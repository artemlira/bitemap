import { expect, test } from "@playwright/test";

const password = "Bitemap-E2E-Only-2026!";

async function registerAngler(page: import("@playwright/test").Page) {
  const email = `bitemap-e2e-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.test`;

  await page.goto("/uk/register");
  await page.getByRole("textbox", { name: "Електронна пошта" }).fill(email);
  await page.getByRole("textbox", { name: "Пароль", exact: true }).fill(password);
  await page.getByRole("textbox", { name: "Повтори пароль" }).fill(password);
  await page.getByRole("button", { name: "Створити акаунт" }).click();
  await expect(page.getByRole("status")).toContainText("Акаунт");
}

function blockProductionFirebase(page: import("@playwright/test").Page) {
  return page.route(
    /https:\/\/(identitytoolkit|securetoken|firestore)\.googleapis\.com\//,
    (route) => route.abort(),
  );
}

test("рибалки публікують звіт, коментують його та бачать у стрічці підписок", async ({ page, browser }) => {
  await blockProductionFirebase(page);
  await registerAngler(page);

  const spotName = `E2E Pond ${Date.now()}`;

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

  const reportText = `E2E fishing report ${Date.now()}`;
  await page.goto("/uk/spots/blue-lake");
  await page.getByRole("button", { name: "Додати звіт" }).click();
  await page.getByLabel("Враження та умови").fill(reportText);
  await page.getByLabel("Що вдалося зловити").fill("Короп");
  await page.getByLabel("На що ловилося").fill("Фідер");
  await page.getByRole("button", { name: "Опублікувати звіт" }).click();
  await expect(page.getByText("Звіт опубліковано.", { exact: true })).toBeVisible();

  const reportCard = page.getByRole("article").filter({ hasText: reportText });
  await expect(reportCard).toBeVisible();
  const authorProfilePath = await reportCard.getByRole("link").first().getAttribute("href");

  if (!authorProfilePath) {
    throw new Error("У створеному звіті немає посилання на профіль автора.");
  }

  const followerContext = await browser.newContext();
  try {
    const followerPage = await followerContext.newPage();
    await blockProductionFirebase(followerPage);
    await registerAngler(followerPage);
    await followerPage.goto(authorProfilePath);

    await followerPage.getByRole("button", { name: "Стежити" }).click();
    await expect(followerPage.getByRole("button", { name: "Не стежити" })).toBeVisible();

    const profileReport = followerPage.getByRole("article").filter({ hasText: reportText });
    await profileReport.getByRole("button", { name: "Коментарі" }).click();
    await followerPage.getByLabel("Твій коментар").fill("Дякую за звіт! Візьму цю водойму до уваги.");
    await profileReport.getByRole("button", { name: "Надіслати" }).click();
    await expect(profileReport.getByRole("status")).toContainText("Коментар додано.");

    await followerPage.goto("/uk/feed");
    const feed = followerPage.getByRole("list", { name: "Оновлення рибалок, на яких ви підписані" });
    await expect(feed.locator(":scope > li > article").filter({ hasText: reportText })).toBeVisible();
  } finally {
    await followerContext.close();
  }
});
