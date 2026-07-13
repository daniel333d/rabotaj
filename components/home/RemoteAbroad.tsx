"use client";

import Link from "next/link";
import { Home, Plane, ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { SectionHeading } from "@/components/home/SectionHeading";

export function RemoteAbroad() {
  const { t } = useI18n();

  return (
    <section className="bg-white">
      <div className="container-page py-16 sm:py-20">
        <SectionHeading kicker={t.remoteAbroad.kicker} title={t.remoteAbroad.title} />

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <div className="flex flex-col justify-between gap-6 rounded-2xl border border-border bg-brand-light p-8">
            <div>
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-brand shadow-soft">
                <Home size={22} aria-hidden="true" />
              </span>
              <h3 className="mt-5 font-heading text-xl font-bold text-ink">{t.remoteAbroad.remoteTitle}</h3>
              <p className="mt-2 max-w-sm text-sm leading-6 text-ink/70">{t.remoteAbroad.remoteText}</p>
            </div>
            <Link
              href="/jobs?remote=1"
              className="inline-flex w-fit items-center gap-1.5 text-sm font-bold text-brand"
            >
              {t.remoteAbroad.cta}
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>

          <div className="flex flex-col justify-between gap-6 rounded-2xl border border-border bg-navy p-8">
            <div>
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-white">
                <Plane size={22} aria-hidden="true" />
              </span>
              <h3 className="mt-5 font-heading text-xl font-bold text-white">{t.remoteAbroad.abroadTitle}</h3>
              <p className="mt-2 max-w-sm text-sm leading-6 text-white/70">{t.remoteAbroad.abroadText}</p>
            </div>
            <Link href="/jobs?country=Niemcy" className="inline-flex w-fit items-center gap-1.5 text-sm font-bold text-white">
              {t.remoteAbroad.cta}
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
