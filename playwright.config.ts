import { defineConfig, devices } from "@playwright/test";

const port = process.env.BITEMAP_E2E_PORT ?? "3000";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  webServer: {
    command: `npm run dev -- --port ${port}`,
    url: `http://localhost:${port}/uk/register`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      BITEMAP_NEXT_DIST_DIR: ".next-e2e",
      NEXT_PUBLIC_USE_FIREBASE_EMULATORS: "true",
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: "demo-bitemap",
      NEXT_PUBLIC_FIREBASE_API_KEY: "demo-api-key",
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: "demo-bitemap.firebaseapp.com",
      NEXT_PUBLIC_FIREBASE_APP_ID: "demo-app-id",
    },
  },
  use: {
    baseURL: `http://localhost:${port}`,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    ...devices["Desktop Chrome"],
  },
});
