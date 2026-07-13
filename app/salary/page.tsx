"use client";

import { useMemo, useState } from "react";
import { TrendingUp, Search } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { jobs } from "@/lib/data/jobs";

type SalaryRow = {
  role: string;
  city: string;
  industry: string;
  min: number;
  max: number;
  currency: string;
};

const rows: SalaryRow[] = jobs
  .filter((job) => job.currency === "PLN")
  .map((job) => ({
    role: job.title,
    city: job.city,
    industry: job.industry,
    min: job.salaryMin,
    max: job.salaryMax,
    currency: job.currency
  }));

export default function SalaryPage() {
  const { t } = useI18n();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return rows;
    return rows.filter((row) => `${row.role} ${row.city} ${row.industry}`.toLowerCase().includes(normalized));
  }, [query]);

  return (
    <div className="bg-surface">
      <div className="container-page py-10 sm:py-14">
        <h1 className="font-heading text-2xl font-extrabold text-ink sm:text-3xl">{t.salary.title}</h1>
        <p className="mt-2 max-w-xl text-sm text-muted">{t.salary.text}</p>

        <label className="mt-6 flex max-w-md items-center gap-3 rounded-xl border border-border bg-white px-4 py-3 shadow-soft">
          <Search size={17} className="text-muted" aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Stanowisko, miasto lub branża"
            className="w-full border-none bg-transparent text-sm text-ink placeholder:text-muted focus:outline-none"
          />
        </label>

        <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-white shadow-card">
          <div className="hidden grid-cols-[1.4fr_0.8fr_0.8fr_1fr] gap-4 border-b border-border bg-surface px-6 py-3 text-xs font-bold uppercase tracking-wide text-muted sm:grid">
            <span>Stanowisko</span>
            <span>Miasto</span>
            <span>Branża</span>
            <span>Widełki</span>
          </div>
          {filtered.map((row, index) => (
            <div
              key={`${row.role}-${index}`}
              className="grid grid-cols-1 gap-1.5 px-6 py-4 text-sm sm:grid-cols-[1.4fr_0.8fr_0.8fr_1fr] sm:items-center sm:gap-4 sm:py-3.5"
              style={{ borderTop: index === 0 ? undefined : "1px solid #E4E8F0" }}
            >
              <span className="font-bold text-ink">{row.role}</span>
              <span className="text-muted">{row.city}</span>
              <span className="text-muted">{row.industry}</span>
              <span className="inline-flex items-center gap-1.5 font-semibold text-success">
                <TrendingUp size={14} aria-hidden="true" />
                {new Intl.NumberFormat("pl-PL").format(row.min)}–{new Intl.NumberFormat("pl-PL").format(row.max)}{" "}
                {row.currency}
              </span>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="px-6 py-10 text-center text-sm text-muted">Brak wyników dla podanej frazy.</p>
          )}
        </div>
      </div>
    </div>
  );
}
