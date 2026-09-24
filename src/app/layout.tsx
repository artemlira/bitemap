import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { AuthProvider } from "@/shared/lib/auth";
import { ThemeProvider } from "@/shared/lib/theme";
import "@/app/styles/main.scss";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BiteMap — риболовля ближче до природи",
  description: "Знаходьте водойми, ведіть щоденник уловів і плануйте риболовлю.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="uk"
      className={geistSans.variable}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body>
        <AuthProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
