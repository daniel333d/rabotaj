"use client";

import { Zap, LayoutGrid, ListChecks, ShieldCheck, BarChart3 } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { SectionHeading } from "@/components/home/SectionHeading";
import { CandidatePanelPreview } from "@/components/employer/CandidatePanelPreview";
import { RecruitmentFunnelPreview } from "@/components/employer/RecruitmentFunnelPreview";
import { PricingPackages } from "@/components/employer/PricingPackages";
import { PublicJobWizard } from "@/components/employer/PublicJobWizard";

export default function EmployersPage() {
  const { t } = useI18n();

  const benefitsList = [
    { icon: Zap, label: t.employersSection.benefit1 },
    { icon: LayoutGrid, label: t.employersSection.benefit2 },
    { icon: ListChecks, label: t.employersSection.benefit3 },
    { icon: ShieldCheck, label: t.employersSection.benefit4 },
    { icon: BarChart3, label: t.employersSection.benefit5 }
  ];

  return (
    <div className="bg-white">
      <section className="border-b border-border bg-[linear-gradient(135deg,#0B1220_0%,#132449_100%)]">
        <div className="container-page py-16 sm:py-20">
          <SectionHeading kicker={t.employersSection.kicker} title={t.employersSection.title} light />
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {benefitsList.map((benefit) => (
              <div key={benefit.label} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5">
                <benefit.icon size={18} className="shrink-0 text-blue-300" aria-hidden="true" />
                <span className="text-sm font-semibold text-white">{benefit.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CandidatePanelPreview />
      <RecruitmentFunnelPreview />
      <PricingPackages />

      <section className="border-t border-border bg-surface">
        <div className="container-page py-16 sm:py-20">
          <h2 className="font-heading text-xl font-extrabold text-ink">{t.employersSection.postJob}</h2>
          <p className="mt-2 max-w-xl text-sm text-muted">
            Wersja demonstracyjna formularza — wysłane dane nie trafiają do żadnego backendu. Pola wpływają na Rabotaj
            Score widoczny obok w czasie rzeczywistym.
          </p>

          <div className="mt-8">
            <PublicJobWizard />
          </div>
        </div>
      </section>
    </div>
  );
}
