"use client";

import { useI18n } from "@/lib/i18n/context";

const DEMO_COUNTS = [148, 96, 42, 18, 6];

export function RecruitmentFunnelPreview() {
  const { t } = useI18n();
  const max = DEMO_COUNTS[0];

  return (
    <section className="bg-navy">
      <div className="container-page py-16 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-wide text-blue-300">Lejek rekrutacji</p>
          <h2 className="mt-3 font-heading text-2xl font-extrabold text-white sm:text-3xl">
            Zobacz, na jakim etapie są Twoi kandydaci
          </h2>
          <p className="mt-3 text-sm text-white/70">
            Przykładowe dane dla jednej oferty — od wysłania aplikacji po ofertę zatrudnienia.
          </p>
        </div>

        <div className="mx-auto mt-10 flex max-w-2xl flex-col gap-3">
          {t.applicationStatus.steps.map((step, index) => {
            const count = DEMO_COUNTS[index] ?? 0;
            const widthPercent = Math.max(12, (count / max) * 100);
            return (
              <div key={step} className="flex items-center gap-4">
                <span className="w-40 shrink-0 text-right text-xs font-semibold text-white/80 sm:w-56 sm:text-sm">{step}</span>
                <div className="h-8 flex-1 overflow-hidden rounded-lg bg-white/10">
                  <div
                    className="flex h-full items-center justify-end rounded-lg bg-brand px-3 text-xs font-bold text-white transition-[width] duration-500"
                    style={{ width: `${widthPercent}%` }}
                  >
                    {count}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
