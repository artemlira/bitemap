import type { Metadata } from "next";
import { Onest, Unbounded } from "next/font/google";
import { getLocale } from "next-intl/server";
import "leaflet/dist/leaflet.css";
import { AuthProvider } from "@/shared/lib/auth";
import { siteRobotsMetadata } from "@/shared/lib/seo";
import { ThemeProvider } from "@/shared/lib/theme";
import { PublicProfileSynchronizer } from "@/entities/user";
import { PointerEffects } from "@/shared/ui/pointer-effects";
import "@/app/styles/main.scss";

const bodyFont = Onest({
  variable: "--font-body",
  subsets: ["latin", "cyrillic"],
});

const displayFont = Unbounded({
  variable: "--font-display",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bitemap.artemlira.com"),
  title: "Мапа водойм для риболовлі в Україні — Плесо",
  description: "Знаходьте водойми, ведіть щоденник уловів і плануйте риболовлю.",
  ...siteRobotsMetadata,
  openGraph: {
    type: "website",
    siteName: "Pleso",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Плесо — мапа водойм для риболовлі" }],
  },
  twitter: {
    card: "summary_large_image",
    images: [{ url: "/opengraph-image", alt: "Плесо — мапа водойм для риболовлі" }],
  },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      className={`${bodyFont.variable} ${displayFont.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body>
        <AuthProvider>
          <PublicProfileSynchronizer />
          <PointerEffects />
          <ThemeProvider>{children}</ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
