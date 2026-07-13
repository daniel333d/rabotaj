"use client";

import { CheckCircle2, Mail, Phone, Plane, Languages, Wrench, Wallet, MapPin, ShieldCheck, Zap } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { SectionHeading } from "@/components/home/SectionHeading";
import { Button } from "@/components/ui/Button";

export default function CareerPassportPage() {
  const { t } = useI18n();

  const perks = [
    { icon: Zap, title: "Aplikuj jednym kliknięciem", text: "Nie wypełniaj tego samego formularza dla każdej oferty." },
    { icon: ShieldCheck, title: "Zweryfikowany profil", text: "Potwierdzony e-mail i telefon budują zaufanie pracodawców." },
    { icon: Plane, title: "Gotowość do relokacji", text: "Zaznacz kraje, do których jesteś gotowa/-y wyjechać do pracy." }
  ];

  return (
    <div className="bg-white">
      <section className="border-b border-border bg-surface">
        <div className="container-page py-16 text-center sm:py-20">
          <SectionHeading kicker={t.careerPassport.kicker} title={t.careerPassport.title} intro={t.careerPassport.text} align="center" />
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button href="/register" variant="primary">
              {t.careerPassport.createCta}
            </Button>
            <Button href="#example" variant="outline">
              {t.careerPassport.exampleCta}
            </Button>
          </div>
        </div>
      </section>

      <section className="container-page py-16 sm:py-20">
        <div className="grid gap-5 sm:grid-cols-3">
          {perks.map((perk) => (
            <div key={perk.title} className="rounded-2xl border border-border bg-white p-6 shadow-soft">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-light text-brand">
                <perk.icon size={20} aria-hidden="true" />
              </span>
              <h3 className="mt-4 font-heading text-base font-bold text-ink">{perk.title}</h3>
              <p className="mt-1.5 text-sm leading-6 text-muted">{perk.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="example" className="scroll-mt-24 bg-surface">
        <div className="container-page grid gap-10 py-16 sm:py-20 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-brand">Przykładowy profil</p>
            <h2 className="mt-3 font-heading text-2xl font-extrabold text-ink sm:text-3xl">
              Tak wygląda gotowy Career Passport
            </h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-muted">
              Jeden profil zawiera wszystko, czego potrzebuje pracodawca — doświadczenie, umiejętności, języki i
              oczekiwania finansowe. Wystarczy go uzupełnić raz.
            </p>
            <Button href="/register" variant="primary" className="mt-7">
              {t.careerPassport.createCta}
            </Button>
          </div>

          <div className="animate-fade-in mx-auto w-full max-w-md rounded-2xl border border-border bg-white p-7 shadow-elevated">
            <div className="flex items-center gap-4">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-navy font-heading text-xl font-bold text-white">
                AK
              </span>
              <div>
                <p className="font-heading text-lg font-bold text-ink">Anna Kowalska</p>
                <p className="text-sm text-muted">UX/UI Designer</p>
                <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted">
                  <MapPin size={12} aria-hidden="true" /> Kraków, Polska
                </p>
              </div>
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-border pt-5 text-sm">
              <Field icon={Plane} label={t.careerPassport.relocation} value="Tak, cała UE" />
              <Field icon={Languages} label={t.careerPassport.languages} value="PL, EN, UA" />
              <Field icon={Wrench} label={t.careerPassport.skills} value="Figma, Design systems" />
              <Field icon={Wallet} label={t.careerPassport.expectedSalary} value="14 000–18 000 PLN" />
            </dl>

            <div className="mt-6 border-t border-border pt-5">
              <div className="flex items-center justify-between text-xs font-semibold text-ink">
                <span>{t.careerPassport.completeness}</span>
                <span className="text-success">85%</span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-border">
                <div className="h-full w-[85%] rounded-full bg-success" />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-success">
              <span className="inline-flex items-center gap-1.5">
                <Mail size={13} aria-hidden="true" />
                {t.careerPassport.emailVerified}
                <CheckCircle2 size={13} aria-hidden="true" />
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Phone size={13} aria-hidden="true" />
                {t.careerPassport.phoneVerified}
                <CheckCircle2 size={13} aria-hidden="true" />
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Field({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value: string }) {
  return (
    <div>
      <dt className="inline-flex items-center gap-1.5 text-xs text-muted">
        <Icon size={13} aria-hidden="true" />
        {label}
      </dt>
      <dd className="mt-1 font-semibold text-ink">{value}</dd>
    </div>
  );
}
