import type { Metadata } from "next";
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
    "Znajdź pracę w Polsce i całej Europie. Utwórz jeden profil zawodowy, aplikuj szybciej i śledź każdy etap rekrutacji."
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
