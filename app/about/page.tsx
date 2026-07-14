"use client";

import { useI18n } from "@/lib/i18n/context";

export default function AboutPage() {
  const { t } = useI18n();

  return (
    <div className="bg-surface">
      <div className="container-page max-w-2xl py-16 sm:py-20">
        <h1 className="font-heading text-2xl font-extrabold text-ink sm:text-3xl">{t.footer.about}</h1>
        <p className="mt-4 text-base font-semibold text-ink">{t.legalPages.aboutIntro}</p>
        <p className="mt-4 text-sm leading-7 text-muted">{t.legalPages.aboutBody}</p>
      </div>
    </div>
  );
}
