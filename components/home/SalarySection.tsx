"use client";

import { TrendingUp } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { SectionHeading } from "@/components/home/SectionHeading";
import { Button } from "@/components/ui/Button";

const rows = [
  { role: "Frontend Developer", city: "Warszawa", min: 12000, max: 22000 },
  { role: "Operator CNC", city: "Gdynia", min: 6000, max: 8500 },
  { role: "Kierowca C+E", city: "Gdańsk", min: 7000, max: 10500 },
  { role: "UX/UI Designer", city: "Kraków", min: 10000, max: 18000 }
];

export function SalarySection() {
  const { t } = useI18n();

  return (
    <section className="bg-surface">
      <div className="container-page grid gap-10 py-16 sm:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <SectionHeading kicker={t.salary.kicker} title={t.salary.title} intro={t.salary.text} />
          <Button href="/salary" variant="primary" className="mt-7">
            {t.salary.cta}
          </Button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-card">
          {rows.map((row, index) => (
            <div
              key={row.role}
              className={`flex items-center justify-between gap-4 px-6 py-4 ${index !== rows.length - 1 ? "border-b border-border" : ""}`}
            >
              <div>
                <p className="text-sm font-bold text-ink">{row.role}</p>
                <p className="text-xs text-muted">{row.city}</p>
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-success">
                <TrendingUp size={15} aria-hidden="true" />
                {new Intl.NumberFormat("pl-PL").format(row.min)}–{new Intl.NumberFormat("pl-PL").format(row.max)} PLN
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
