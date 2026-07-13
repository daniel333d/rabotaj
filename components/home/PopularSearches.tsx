"use client";

import Link from "next/link";
import { Home, GraduationCap, BedDouble, Flag, Code2, Factory, Truck, HardHat, ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

export function PopularSearches() {
  const { t } = useI18n();

  const items = [
    { icon: Home, label: t.popularSearches.remote, href: "/jobs?remote=1", count: "3 oferty" },
    { icon: GraduationCap, label: t.popularSearches.noExperience, href: "/jobs?experience=Bez%20do%C5%9Bwiadczenia", count: "4 oferty" },
    { icon: BedDouble, label: t.popularSearches.accommodation, href: "/jobs?accommodation=1", count: "3 oferty" },
    { icon: Flag, label: t.popularSearches.ukraine, href: "/jobs?q=ukrain", count: "wybrane oferty" },
    { icon: Code2, label: t.popularSearches.it, href: "/jobs?industry=IT", count: "4 oferty" },
    { icon: Factory, label: t.popularSearches.production, href: "/jobs?industry=Produkcja", count: "3 oferty" },
    { icon: Truck, label: t.popularSearches.transport, href: "/jobs?industry=Transport", count: "2 oferty" },
    { icon: HardHat, label: t.popularSearches.construction, href: "/jobs?industry=Budownictwo", count: "1 oferta" }
  ];

  return (
    <section className="border-t border-border bg-surface">
      <div className="container-page py-16 sm:py-20">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="group flex items-center justify-between gap-4 rounded-2xl border border-border bg-white p-5 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-card"
            >
              <div className="flex items-center gap-3.5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-light text-brand">
                  <item.icon size={20} aria-hidden="true" />
                </span>
                <div>
                  <p className="font-heading text-sm font-bold text-ink">{item.label}</p>
                  <p className="text-xs text-muted">{item.count}</p>
                </div>
              </div>
              <ArrowRight
                size={16}
                className="shrink-0 text-muted transition-transform duration-200 group-hover:translate-x-1 group-hover:text-brand"
                aria-hidden="true"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
