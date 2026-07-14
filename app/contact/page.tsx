"use client";

import { Mail } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

export default function ContactPage() {
  const { t } = useI18n();

  return (
    <div className="bg-surface">
      <div className="container-page max-w-2xl py-16 sm:py-20">
        <h1 className="font-heading text-2xl font-extrabold text-ink sm:text-3xl">{t.footer.contact}</h1>
        <p className="mt-4 text-sm leading-7 text-muted">{t.legalPages.contactIntro}</p>

        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-border bg-white p-5 shadow-soft">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-light text-brand">
            <Mail size={18} aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs font-semibold text-muted">{t.legalPages.contactEmailLabel}</p>
            <p className="text-sm font-bold text-ink">hello@rabotaj.com</p>
          </div>
        </div>

        <p className="mt-6 text-xs text-muted">{t.legalPages.contactNote}</p>
      </div>
    </div>
  );
}
