"use client";

import Link from "next/link";
import { ShieldCheck, Sparkles, MessageCircle, CheckCircle2 } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { SearchBar } from "@/components/jobs/SearchBar";
import { MatchRing } from "@/components/ui/MatchRing";
import { CompanyLogo } from "@/components/ui/CompanyLogo";

export function HeroSection() {
  const { t } = useI18n();

  const popular = [
    { label: t.popularSearches.remote, href: "/jobs?remote=1" },
    { label: t.popularSearches.noExperience, href: "/jobs?experience=Bez%20do%C5%9Bwiadczenia" },
    { label: t.popularSearches.accommodation, href: "/jobs?accommodation=1" },
    { label: t.popularSearches.ukraine, href: "/jobs?q=ukrain" },
    { label: t.popularSearches.it, href: "/jobs?industry=IT" },
    { label: t.popularSearches.production, href: "/jobs?industry=Produkcja" },
    { label: t.popularSearches.transport, href: "/jobs?industry=Transport" },
    { label: t.popularSearches.construction, href: "/jobs?industry=Budownictwo" }
  ];

  return (
    <section className="relative overflow-hidden bg-white">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[560px] bg-[radial-gradient(circle_at_15%_10%,rgba(37,99,235,0.10),transparent_45%),radial-gradient(circle_at_85%_25%,rgba(22,163,106,0.08),transparent_40%)]"
        aria-hidden="true"
      />
      <div className="container-page relative grid gap-14 py-16 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-28">
        <div>
          <h1 className="text-balance font-heading text-[2.5rem] font-extrabold leading-[1.08] tracking-tight text-ink sm:text-6xl lg:text-[3.6rem]">
            {t.hero.headline}
          </h1>
          <p className="mt-6 max-w-xl text-balance text-base leading-7 text-muted sm:text-lg">
            {t.hero.subtitle}
          </p>

          <SearchBar className="mt-9" />

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-muted">
              {t.hero.popularLabel}:
            </span>
            {popular.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-full border border-border bg-white px-3.5 py-1.5 text-xs font-semibold text-ink transition-colors duration-150 hover:border-brand hover:text-brand"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="relative mx-auto hidden w-full max-w-md pt-6 sm:block lg:mx-0">
          <div className="animate-fade-in relative rounded-2xl border border-border bg-white p-5 pb-6 shadow-elevated">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <CompanyLogo initials="TN" color="#2563EB" size={44} />
                <div>
                  <p className="font-heading text-sm font-bold text-ink">Senior Frontend Developer</p>
                  <p className="mt-0.5 text-xs text-muted">TechNova · Warszawa, hybrydowo</p>
                </div>
              </div>
              <MatchRing percent={92} size={40} />
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5">
              <span className="rounded-full bg-brand-light px-2.5 py-1 text-[11px] font-semibold text-brand">React</span>
              <span className="rounded-full bg-brand-light px-2.5 py-1 text-[11px] font-semibold text-brand">TypeScript</span>
              <span className="rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-semibold text-success">18 000–24 000 PLN</span>
            </div>

            <div className="mt-5 flex items-center gap-2 border-t border-border pt-4">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-light text-brand">
                <ShieldCheck size={14} aria-hidden="true" />
              </span>
              <span className="text-xs font-bold text-ink">{t.hero.verifiedEmployer}</span>
            </div>
          </div>

          <div className="animate-fade-in absolute -right-4 -top-6 w-48 rounded-xl border border-border bg-white p-3.5 shadow-elevated [animation-delay:250ms] sm:-right-8">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-brand" aria-hidden="true" />
              <span className="text-[11px] font-bold uppercase tracking-wide text-muted">{t.hero.passportPreview}</span>
            </div>
            <p className="mt-2 text-xs font-bold text-ink">Anna Kowalska</p>
            <p className="text-[11px] text-muted">UX/UI Designer · Kraków</p>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-border">
              <div className="h-full w-[85%] rounded-full bg-success" />
            </div>
            <p className="mt-1 text-[10px] font-semibold text-success">85% profilu uzupełnione</p>
          </div>

          <div className="animate-fade-in absolute -bottom-6 right-4 flex items-center gap-2.5 rounded-xl border border-success/30 bg-white px-4 py-3 shadow-elevated [animation-delay:350ms] sm:right-10">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-50 text-success">
              <MessageCircle size={16} aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-bold text-ink">{t.hero.interviewInvite}</p>
              <p className="inline-flex items-center gap-1 text-[11px] text-success">
                <CheckCircle2 size={11} aria-hidden="true" /> NordCargo
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
