"use client";

import { FileText, Scale, MessagesSquare } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { SectionHeading } from "@/components/home/SectionHeading";
import { Button } from "@/components/ui/Button";

export function CareerCenterSection() {
  const { t } = useI18n();

  const cards = [
    { icon: FileText, title: "Jak napisać CV, które zauważą rekruterzy", tag: "Poradnik" },
    { icon: Scale, title: "Legalne zatrudnienie cudzoziemców w Polsce", tag: "Prawo pracy" },
    { icon: MessagesSquare, title: "Jak przygotować się do rozmowy rekrutacyjnej", tag: "Rekrutacja" }
  ];

  return (
    <section className="bg-surface">
      <div className="container-page py-16 sm:py-20">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading kicker={t.careerCenter.kicker} title={t.careerCenter.title} intro={t.careerCenter.text} />
          <Button href="/career-center" variant="outline" className="hidden shrink-0 sm:inline-flex">
            {t.careerCenter.cta}
          </Button>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {cards.map((card) => (
            <div key={card.title} className="rounded-2xl border border-border bg-white p-6 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-light text-brand">
                <card.icon size={20} aria-hidden="true" />
              </span>
              <p className="mt-4 text-xs font-bold uppercase tracking-wide text-muted">{card.tag}</p>
              <h3 className="mt-1.5 font-heading text-base font-bold leading-snug text-ink">{card.title}</h3>
            </div>
          ))}
        </div>

        <Button href="/career-center" variant="outline" className="mt-8 flex sm:hidden">
          {t.careerCenter.cta}
        </Button>
      </div>
    </section>
  );
}
