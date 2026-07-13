"use client";

import { MapPin, Plane, Languages, Wrench, Wallet, Mail, Phone, CheckCircle2 } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { SectionHeading } from "@/components/home/SectionHeading";
import { Button } from "@/components/ui/Button";

export function CareerPassportSection() {
  const { t } = useI18n();

  return (
    <section id="career-passport-preview" className="bg-surface">
      <div className="container-page grid gap-14 py-16 sm:py-20 lg:grid-cols-2 lg:items-center">
        <div>
          <SectionHeading kicker={t.careerPassport.kicker} title={t.careerPassport.title} intro={t.careerPassport.text} />
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/career-passport" variant="primary">
              {t.careerPassport.createCta}
            </Button>
            <Button href="/career-passport#example" variant="outline">
              {t.careerPassport.exampleCta}
            </Button>
          </div>
        </div>

        <div className="animate-fade-in mx-auto w-full max-w-md rounded-2xl border border-border bg-white p-6 shadow-elevated sm:p-7">
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
            <PassportField icon={Plane} label={t.careerPassport.relocation} value="Tak, cała UE" />
            <PassportField icon={Languages} label={t.careerPassport.languages} value="PL, EN, UA" />
            <PassportField icon={Wrench} label={t.careerPassport.skills} value="Figma, Design systems" />
            <PassportField icon={Wallet} label={t.careerPassport.expectedSalary} value="14 000–18 000 PLN" />
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
  );
}

function PassportField({
  icon: Icon,
  label,
  value
}: {
  icon: typeof Plane;
  label: string;
  value: string;
}) {
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
