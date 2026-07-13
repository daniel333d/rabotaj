import type { Job } from "@/lib/data/jobs";

export function formatSalary(job: Job) {
  const format = (value: number) => new Intl.NumberFormat("pl-PL").format(value);
  return `${format(job.salaryMin)}–${format(job.salaryMax)} ${job.currency}`;
}

export function formatDate(iso: string, locale: string = "pl-PL") {
  const date = new Date(iso);
  return new Intl.DateTimeFormat(locale, { day: "numeric", month: "short" }).format(date);
}

export function workModelLabel(model: Job["workModel"]) {
  switch (model) {
    case "remote":
      return "Praca zdalna";
    case "hybrid":
      return "Praca hybrydowa";
    case "onsite":
      return "Praca stacjonarna";
  }
}
