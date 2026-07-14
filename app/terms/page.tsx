"use client";

import { useI18n } from "@/lib/i18n/context";

export default function TermsPage() {
  const { t } = useI18n();

  return (
    <div className="bg-surface">
      <div className="container-page max-w-2xl py-16 sm:py-20">
        <h1 className="font-heading text-2xl font-extrabold text-ink sm:text-3xl">{t.footer.terms}</h1>
        <p className="mt-4 text-sm leading-7 text-muted">{t.legalPages.termsIntro}</p>
        <ol className="mt-6 flex flex-col gap-3">
          {t.legalPages.termsBody.map((paragraph, index) => (
            <li key={index} className="flex gap-3 text-sm leading-6 text-ink/80">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-light text-xs font-bold text-brand">
                {index + 1}
              </span>
              {paragraph}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
