"use client";

import { FileText, Scale, MessagesSquare, GraduationCap, Globe2, Briefcase } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

const articles = [
  { icon: FileText, tag: "Poradnik", title: "Jak napisać CV, które zauważą rekruterzy", time: "6 min czytania" },
  { icon: Scale, tag: "Prawo pracy", title: "Legalne zatrudnienie cudzoziemców w Polsce", time: "9 min czytania" },
  { icon: MessagesSquare, tag: "Rekrutacja", title: "Jak przygotować się do rozmowy rekrutacyjnej", time: "5 min czytania" },
  { icon: GraduationCap, tag: "Rozwój", title: "Certyfikaty i kursy, które podnoszą Twoją wartość", time: "7 min czytania" },
  { icon: Globe2, tag: "Praca za granicą", title: "Co warto wiedzieć przed wyjazdem do pracy w Niemczech", time: "8 min czytania" },
  { icon: Briefcase, tag: "Kariera", title: "Zmiana branży — od czego zacząć", time: "6 min czytania" }
];

export default function CareerCenterPage() {
  const { t } = useI18n();

  return (
    <div className="bg-surface">
      <div className="container-page py-10 sm:py-14">
        <h1 className="font-heading text-2xl font-extrabold text-ink sm:text-3xl">{t.careerCenter.title}</h1>
        <p className="mt-2 max-w-xl text-sm text-muted">{t.careerCenter.text}</p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <article
              key={article.title}
              className="flex flex-col rounded-2xl border border-border bg-white p-6 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-light text-brand">
                <article.icon size={20} aria-hidden="true" />
              </span>
              <p className="mt-4 text-xs font-bold uppercase tracking-wide text-muted">{article.tag}</p>
              <h2 className="mt-1.5 font-heading text-base font-bold leading-snug text-ink">{article.title}</h2>
              <p className="mt-auto pt-4 text-xs text-muted">{article.time}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
