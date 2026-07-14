import type { Job } from "@/lib/data/jobs";
import type { Dictionary } from "@/lib/i18n/locales/pl";

const INTL_LOCALE_MAP: Record<string, string> = { ua: "uk" };

export function toIntlLocale(locale: string) {
  return INTL_LOCALE_MAP[locale] ?? locale;
}

export function formatSalary(job: Job) {
  const format = (value: number) => new Intl.NumberFormat("pl-PL").format(value);
  return `${format(job.salaryMin)}–${format(job.salaryMax)} ${job.currency}`;
}

export function formatDate(iso: string, locale: string = "pl-PL") {
  const date = new Date(iso);
  return new Intl.DateTimeFormat(toIntlLocale(locale), { day: "numeric", month: "short" }).format(date);
}

export function workModelLabel(model: Job["workModel"], t: Dictionary) {
  return t.workModel[model];
}
