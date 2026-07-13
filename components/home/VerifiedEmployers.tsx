"use client";

import { ShieldCheck, Eye, Clock3, Heart } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { SectionHeading } from "@/components/home/SectionHeading";

export function VerifiedEmployers() {
  const { t } = useI18n();

  const badges = [
    { icon: ShieldCheck, label: t.verifiedEmployers.badge1 },
    { icon: Eye, label: t.verifiedEmployers.badge2 },
    { icon: Clock3, label: t.verifiedEmployers.badge3 },
    { icon: Heart, label: t.verifiedEmployers.badge4 }
  ];

  return (
    <section className="bg-navy">
      <div className="container-page grid gap-10 py-16 sm:py-20 lg:grid-cols-[1fr_1fr] lg:items-center">
        <SectionHeading kicker={t.verifiedEmployers.kicker} title={t.verifiedEmployers.title} intro={t.verifiedEmployers.text} light />

        <div className="grid grid-cols-2 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.label}
              className="flex flex-col items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-5"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/20 text-blue-300">
                <badge.icon size={20} aria-hidden="true" />
              </span>
              <p className="text-sm font-semibold text-white">{badge.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
