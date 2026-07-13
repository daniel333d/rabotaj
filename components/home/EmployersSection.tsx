"use client";

import { Zap, LayoutGrid, ListChecks, ShieldCheck, BarChart3 } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { SectionHeading } from "@/components/home/SectionHeading";
import { Button } from "@/components/ui/Button";

export function EmployersSection() {
  const { t } = useI18n();

  const benefits = [
    { icon: Zap, label: t.employersSection.benefit1 },
    { icon: LayoutGrid, label: t.employersSection.benefit2 },
    { icon: ListChecks, label: t.employersSection.benefit3 },
    { icon: ShieldCheck, label: t.employersSection.benefit4 },
    { icon: BarChart3, label: t.employersSection.benefit5 }
  ];

  return (
    <section className="bg-white">
      <div className="container-page overflow-hidden rounded-2xl border border-border bg-[linear-gradient(135deg,#0B1220_0%,#132449_100%)] px-6 py-14 sm:px-10 sm:py-16 lg:px-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
          <SectionHeading kicker={t.employersSection.kicker} title={t.employersSection.title} light />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {benefits.map((benefit) => (
              <div key={benefit.label} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5">
                <benefit.icon size={18} className="shrink-0 text-blue-300" aria-hidden="true" />
                <span className="text-sm font-semibold text-white">{benefit.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button href="/employers" variant="primary">
            {t.employersSection.postJob}
          </Button>
          <Button href="/employers" variant="outline" className="border-white/20 bg-transparent text-white hover:border-white hover:text-white">
            {t.employersSection.learnMore}
          </Button>
        </div>
      </div>
    </section>
  );
}
