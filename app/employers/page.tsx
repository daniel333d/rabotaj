"use client";

import { useState, type FormEvent } from "react";
import { Zap, LayoutGrid, ListChecks, ShieldCheck, BarChart3, CheckCircle2 } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { useToast } from "@/lib/toast-context";
import { SectionHeading } from "@/components/home/SectionHeading";

export default function EmployersPage() {
  const { t } = useI18n();
  const { showToast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [title, setTitle] = useState("");

  const benefits = [
    { icon: Zap, label: t.employersSection.benefit1 },
    { icon: LayoutGrid, label: t.employersSection.benefit2 },
    { icon: ListChecks, label: t.employersSection.benefit3 },
    { icon: ShieldCheck, label: t.employersSection.benefit4 },
    { icon: BarChart3, label: t.employersSection.benefit5 }
  ];

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!title.trim()) return;
    setSubmitted(true);
    showToast("Ogłoszenie zostało dodane (wersja demonstracyjna)");
  }

  return (
    <div className="bg-white">
      <section className="border-b border-border bg-[linear-gradient(135deg,#0B1220_0%,#132449_100%)]">
        <div className="container-page py-16 sm:py-20">
          <SectionHeading kicker={t.employersSection.kicker} title={t.employersSection.title} light />
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit) => (
              <div key={benefit.label} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5">
                <benefit.icon size={18} className="shrink-0 text-blue-300" aria-hidden="true" />
                <span className="text-sm font-semibold text-white">{benefit.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16 sm:py-20">
        <div className="mx-auto max-w-xl">
          <h2 className="font-heading text-xl font-extrabold text-ink">{t.employersSection.postJob}</h2>
          <p className="mt-2 text-sm text-muted">
            Wersja demonstracyjna formularza — wysłane dane nie trafiają do żadnego backendu.
          </p>

          {submitted ? (
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-success/30 bg-green-50 p-6">
              <CheckCircle2 size={22} className="mt-0.5 shrink-0 text-success" aria-hidden="true" />
              <div>
                <p className="font-heading text-sm font-bold text-ink">Ogłoszenie „{title}” zostało dodane</p>
                <p className="mt-1 text-sm text-ink/70">
                  W wersji produkcyjnej trafiłoby ono do publikacji po weryfikacji przez zespół Rabotaj.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
              <Field label="Stanowisko" value={title} onChange={setTitle} placeholder="np. Kierowca C+E" required />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Miasto" placeholder="np. Warszawa" />
                <Field label="Widełki wynagrodzenia" placeholder="np. 7000–9000 PLN" />
              </div>
              <button
                type="submit"
                className="mt-2 rounded-xl bg-brand px-6 py-3.5 text-sm font-bold text-white transition-colors duration-200 hover:bg-blue-700"
              >
                {t.employersSection.postJob}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  required
}: {
  label: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-ink">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        required={required}
        className="rounded-xl border border-border bg-white px-4 py-3 text-sm text-ink placeholder:text-muted focus:outline-none focus-visible:outline-2 focus-visible:outline-brand"
      />
    </label>
  );
}
