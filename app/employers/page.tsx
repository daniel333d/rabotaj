"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Zap, LayoutGrid, ListChecks, ShieldCheck, BarChart3, CheckCircle2 } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { useToast } from "@/lib/toast-context";
import { SectionHeading } from "@/components/home/SectionHeading";
import { RabotajScoreDetails } from "@/components/rabotaj-score/RabotajScoreDetails";
import {
  calculateRabotajScore,
  getMissingCriteriaSorted,
  type RabotajScoreCriterionId,
  type RabotajScoreInput
} from "@/lib/rabotaj-score";
import type { ContractType, WorkModel } from "@/lib/data/jobs";

const FIELD_IDS: Partial<Record<RabotajScoreCriterionId, string>> = {
  salaryRange: "field-salary",
  contractType: "field-contractType",
  workModel: "field-workModel",
  location: "field-location",
  workLanguage: "field-language",
  responsibilities: "field-responsibilities",
  requirements: "field-requirements",
  benefits: "field-benefits",
  recruitmentProcess: "field-process",
  expectedResponseTime: "field-responseTime",
  startDate: "field-startDate"
};

function toLines(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function scrollToField(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "center" });
  el.focus({ preventScroll: true });
}

export default function EmployersPage() {
  const { t } = useI18n();
  const { showToast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  const [title, setTitle] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("Polska");
  const [contractType, setContractType] = useState<ContractType | "">("");
  const [workModel, setWorkModel] = useState<WorkModel | "">("");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [language, setLanguage] = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const [requirements, setRequirements] = useState("");
  const [benefits, setBenefits] = useState("");
  const [process, setProcess] = useState("");
  const [expectedResponseTime, setExpectedResponseTime] = useState("");
  const [startDate, setStartDate] = useState("");

  const draftJob: RabotajScoreInput = useMemo(() => {
    const min = Number(salaryMin) || 0;
    const max = Number(salaryMax) || 0;
    return {
      salaryDisclosed: min > 0 && max > 0,
      salaryMin: min,
      salaryMax: max,
      verifiedEmployer: false,
      contractType: (contractType || "") as ContractType,
      workModel: (workModel || "") as WorkModel,
      city,
      country,
      language,
      responsibilities: toLines(responsibilities),
      requirements: toLines(requirements),
      benefits: toLines(benefits),
      process: toLines(process),
      expectedResponseTime: expectedResponseTime.trim() || undefined,
      startDate: startDate.trim() || undefined
    };
  }, [
    salaryMin,
    salaryMax,
    contractType,
    workModel,
    city,
    country,
    language,
    responsibilities,
    requirements,
    benefits,
    process,
    expectedResponseTime,
    startDate
  ]);

  const result = calculateRabotajScore(draftJob);
  const suggestions = getMissingCriteriaSorted(result).filter((c) => c.id !== "verifiedEmployer");

  const benefitsList = [
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
            {benefitsList.map((benefit) => (
              <div key={benefit.label} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5">
                <benefit.icon size={18} className="shrink-0 text-blue-300" aria-hidden="true" />
                <span className="text-sm font-semibold text-white">{benefit.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16 sm:py-20">
        <h2 className="font-heading text-xl font-extrabold text-ink">{t.employersSection.postJob}</h2>
        <p className="mt-2 max-w-xl text-sm text-muted">
          Wersja demonstracyjna formularza — wysłane dane nie trafiają do żadnego backendu. Pola wpływają na Rabotaj Score
          widoczny obok w czasie rzeczywistym.
        </p>

        {submitted ? (
          <div className="mt-8 flex max-w-xl items-start gap-3 rounded-2xl border border-success/30 bg-green-50 p-6">
            <CheckCircle2 size={22} className="mt-0.5 shrink-0 text-success" aria-hidden="true" />
            <div>
              <p className="font-heading text-sm font-bold text-ink">Ogłoszenie „{title}” zostało dodane</p>
              <p className="mt-1 text-sm text-ink/70">
                Rabotaj Score tego ogłoszenia: {result.score}/100 ({t.rabotajScore.levels[result.level]}). W wersji
                produkcyjnej trafiłoby ono do publikacji po weryfikacji przez zespół Rabotaj.
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
            <form onSubmit={handleSubmit} className="order-2 flex flex-col gap-8 lg:order-1">
              <FormSection title="Podstawowe informacje">
                <Field label="Stanowisko" value={title} onChange={setTitle} placeholder="np. Kierowca C+E" required />
                <div id={FIELD_IDS.location} tabIndex={-1} className="grid gap-4 outline-none sm:grid-cols-2">
                  <Field label="Miasto" value={city} onChange={setCity} placeholder="np. Warszawa" />
                  <Field label="Kraj" value={country} onChange={setCountry} placeholder="np. Polska" />
                </div>
                <div id={FIELD_IDS.salaryRange} tabIndex={-1} className="grid gap-4 outline-none sm:grid-cols-2">
                  <Field label="Wynagrodzenie od" value={salaryMin} onChange={setSalaryMin} placeholder="np. 7000" type="number" />
                  <Field label="Wynagrodzenie do" value={salaryMax} onChange={setSalaryMax} placeholder="np. 9000" type="number" />
                </div>
              </FormSection>

              <FormSection title="Szczegóły zatrudnienia">
                <div className="grid gap-4 sm:grid-cols-2">
                  <SelectField
                    id={FIELD_IDS.contractType}
                    label={t.jobsPage.filterContract}
                    value={contractType}
                    onChange={(v) => setContractType(v as ContractType)}
                    options={["Umowa o pracę", "B2B", "Umowa zlecenie", "Praca tymczasowa"]}
                  />
                  <SelectField
                    id={FIELD_IDS.workModel}
                    label="Model pracy"
                    value={workModel}
                    onChange={(v) => setWorkModel(v as WorkModel)}
                    options={["remote", "hybrid", "onsite"]}
                    optionLabels={{ remote: "Zdalna", hybrid: "Hybrydowa", onsite: "Stacjonarna" }}
                  />
                </div>
                <Field
                  id={FIELD_IDS.workLanguage}
                  label="Język pracy"
                  value={language}
                  onChange={setLanguage}
                  placeholder="np. polski / angielski"
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    id={FIELD_IDS.expectedResponseTime}
                    label="Przewidywany czas odpowiedzi"
                    value={expectedResponseTime}
                    onChange={setExpectedResponseTime}
                    placeholder="np. Zwykle w ciągu 2 dni roboczych"
                  />
                  <Field
                    id={FIELD_IDS.startDate}
                    label="Data rozpoczęcia pracy"
                    value={startDate}
                    onChange={setStartDate}
                    placeholder="np. Od zaraz"
                  />
                </div>
              </FormSection>

              <FormSection title="Opis stanowiska">
                <TextAreaField
                  id={FIELD_IDS.responsibilities}
                  label="Zakres obowiązków (jedna linia = jeden punkt)"
                  value={responsibilities}
                  onChange={setResponsibilities}
                  placeholder={"np. Obsługa klientów\nRealizacja zamówień"}
                />
                <TextAreaField
                  id={FIELD_IDS.requirements}
                  label="Wymagania (jedna linia = jeden punkt)"
                  value={requirements}
                  onChange={setRequirements}
                  placeholder={"np. Min. 2 lata doświadczenia\nPrawo jazdy kat. B"}
                />
                <TextAreaField
                  id={FIELD_IDS.benefits}
                  label="Benefity (jedna linia = jeden punkt)"
                  value={benefits}
                  onChange={setBenefits}
                  placeholder={"np. Prywatna opieka medyczna\nKarta sportowa"}
                />
              </FormSection>

              <FormSection title="Proces rekrutacji">
                <TextAreaField
                  id={FIELD_IDS.recruitmentProcess}
                  label="Etapy rekrutacji (jedna linia = jeden etap)"
                  value={process}
                  onChange={setProcess}
                  placeholder={"np. Rozmowa telefoniczna\nSpotkanie w biurze\nOferta"}
                />
              </FormSection>

              <button
                type="submit"
                className="self-start rounded-xl bg-brand px-6 py-3.5 text-sm font-bold text-white transition-colors duration-200 hover:bg-blue-700"
              >
                {t.employersSection.postJob}
              </button>
            </form>

            <aside className="order-1 flex flex-col gap-4 lg:order-2 lg:sticky lg:top-24">
              <RabotajScoreDetails result={result} showBreakdown={false} showHowWeCalculate={false} />

              {suggestions.length > 0 && (
                <div className="rounded-2xl border border-border bg-white p-6 shadow-soft">
                  <h3 className="font-heading text-sm font-bold text-ink">{t.rabotajScore.whatToImprove}</h3>
                  <ul className="mt-4 flex flex-col gap-3">
                    {suggestions.map((criterion) => {
                      const fieldId = FIELD_IDS[criterion.id];
                      return (
                        <li
                          key={criterion.id}
                          className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface/60 px-3.5 py-3"
                        >
                          <div>
                            <p className="text-sm font-semibold text-ink">{t.rabotajScore.criteriaMissing[criterion.id]}</p>
                            <p className="mt-0.5 text-xs font-bold text-brand">
                              +{criterion.points} {t.rabotajScore.points}
                            </p>
                          </div>
                          {fieldId && (
                            <button
                              type="button"
                              onClick={() => scrollToField(fieldId)}
                              className="shrink-0 rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-semibold text-ink transition-colors duration-150 hover:border-brand hover:text-brand"
                            >
                              {t.rabotajScore.fillField}
                            </button>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </aside>
          </div>
        )}
      </section>
    </div>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h3 className="font-heading text-sm font-bold text-ink">{title}</h3>
      {children}
    </section>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
  required,
  type = "text"
}: {
  id?: string;
  label: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-ink">{label}</span>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        required={required}
        className="rounded-xl border border-border bg-white px-4 py-3 text-sm text-ink placeholder:text-muted focus:outline-none focus-visible:outline-2 focus-visible:outline-brand"
      />
    </label>
  );
}

function TextAreaField({
  id,
  label,
  value,
  onChange,
  placeholder
}: {
  id?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-ink">{label}</span>
      <textarea
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={3}
        className="rounded-xl border border-border bg-white px-4 py-3 text-sm text-ink placeholder:text-muted focus:outline-none focus-visible:outline-2 focus-visible:outline-brand"
      />
    </label>
  );
}

function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  optionLabels
}: {
  id?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  optionLabels?: Record<string, string>;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-ink">{label}</span>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-xl border border-border bg-white px-4 py-3 text-sm text-ink focus:outline-none focus-visible:outline-2 focus-visible:outline-brand"
      >
        <option value="">—</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {optionLabels?.[option] ?? option}
          </option>
        ))}
      </select>
    </label>
  );
}
