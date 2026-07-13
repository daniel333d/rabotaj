"use client";

import { useState, type FormEvent } from "react";
import { Mail } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { useToast } from "@/lib/toast-context";

export function Newsletter() {
  const { t } = useI18n();
  const { showToast } = useToast();
  const [email, setEmail] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!email.trim()) return;
    showToast("Dziękujemy! Sprawdź swoją skrzynkę e-mail.");
    setEmail("");
  }

  return (
    <section className="bg-white">
      <div className="container-page py-16 sm:py-20">
        <div className="flex flex-col items-center gap-6 rounded-2xl border border-border bg-brand-light px-6 py-12 text-center sm:px-16">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-brand shadow-soft">
            <Mail size={22} aria-hidden="true" />
          </span>
          <div>
            <h2 className="font-heading text-2xl font-extrabold text-ink sm:text-3xl">{t.newsletter.title}</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-ink/70">{t.newsletter.text}</p>
          </div>

          <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-2.5 sm:flex-row">
            <label className="sr-only" htmlFor="newsletter-email">
              {t.newsletter.placeholder}
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={t.newsletter.placeholder}
              className="w-full flex-1 rounded-xl border border-border bg-white px-4 py-3 text-sm text-ink placeholder:text-muted focus:outline-none focus-visible:outline-2 focus-visible:outline-brand"
            />
            <button
              type="submit"
              className="shrink-0 rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white transition-colors duration-200 hover:bg-blue-700"
            >
              {t.newsletter.cta}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
