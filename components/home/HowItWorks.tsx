"use client";

import { UserCircle2, Send, Radar } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { SectionHeading } from "@/components/home/SectionHeading";

const icons = [UserCircle2, Send, Radar];

export function HowItWorks() {
  const { t } = useI18n();

  return (
    <section className="bg-white">
      <div className="container-page py-16 sm:py-20">
        <SectionHeading kicker={t.howItWorks.kicker} title={t.howItWorks.title} align="center" />

        <div className="relative mt-12 grid gap-8 sm:grid-cols-3">
          <div className="pointer-events-none absolute left-0 right-0 top-8 hidden h-px bg-border sm:block" aria-hidden="true" />
          {t.howItWorks.steps.map((step, index) => {
            const Icon = icons[index];
            return (
              <div key={step.title} className="relative flex flex-col items-center text-center">
                <span className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-white text-brand shadow-soft">
                  <Icon size={26} aria-hidden="true" />
                </span>
                <span className="mt-4 font-heading text-xs font-bold uppercase tracking-widest text-muted">
                  Krok {index + 1}
                </span>
                <h3 className="mt-1.5 font-heading text-lg font-bold text-ink">{step.title}</h3>
                <p className="mt-2 max-w-xs text-sm leading-6 text-muted">{step.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
