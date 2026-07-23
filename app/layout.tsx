import type { Metadata, Viewport } from "next";
import { Manrope, Inter } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n/context";
import { ToastProvider } from "@/lib/toast-context";
import { SavedJobsProvider } from "@/lib/saved-jobs-context";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getSessionProfile } from "@/lib/auth/session";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700", "800"]
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"]
});

export const metadata: Metadata = {
  title: "Rabotaj.com — Pracuj bez granic",
  description:
    "Znajdź pracę w Polsce i całej Europie. Utwórz jeden profil zawodowy, aplikuj szybciej i śledź każdy etap rekrutacji.",
  icons: {
    icon: [
      { url: "/brand/icons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/brand/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/icons/favicon.ico" }
    ],
    apple: [{ url: "/brand/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }]
  }
};

export const viewport: Viewport = {
  themeColor: "#0B0F19"
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const profile = await getSessionProfile();

  return (
    <html lang="pl" className={`${manrope.variable} ${inter.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-surface font-sans text-ink antialiased">
        <I18nProvider>
          <ToastProvider>
            <SavedJobsProvider>
              <Navbar profile={profile} />
              <main className="flex-1">{children}</main>
              <Footer />
            </SavedJobsProvider>
          </ToastProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
