"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import pl from "./locales/pl";
import en from "./locales/en";
import ua from "./locales/ua";
import ru from "./locales/ru";
import de from "./locales/de";
import es from "./locales/es";
import type { Dictionary } from "./locales/pl";

export type LocaleCode = "pl" | "ua" | "ru" | "en" | "de" | "es";

export const dictionaries: Record<LocaleCode, Dictionary> = { pl, ua, ru, en, de, es };

export const localeOptions: { code: LocaleCode; label: string }[] = [
  { code: "pl", label: "PL" },
  { code: "ua", label: "UA" },
  { code: "ru", label: "RU" },
  { code: "en", label: "EN" },
  { code: "de", label: "DE" },
  { code: "es", label: "ES" }
];

const STORAGE_KEY = "rabotaj-locale";

type I18nContextValue = {
  locale: LocaleCode;
  t: Dictionary;
  setLocale: (locale: LocaleCode) => void;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<LocaleCode>("pl");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as LocaleCode | null;
    if (stored && dictionaries[stored]) {
      setLocaleState(stored);
    }
  }, []);

  const setLocale = (next: LocaleCode) => {
    setLocaleState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  };

  const value = useMemo<I18nContextValue>(
    () => ({ locale, t: dictionaries[locale], setLocale }),
    [locale]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
