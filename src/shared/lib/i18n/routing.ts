import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  defaultLocale: "uk",
  localePrefix: "always",
  locales: ["uk", "en"],
});
