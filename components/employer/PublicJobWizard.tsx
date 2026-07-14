"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { useToast } from "@/lib/toast-context";
import { RabotajScoreDetails } from "@/components/rabotaj-score/RabotajScoreDetails";
import {
  calculateRabotajScore,
  getMissingCriteriaSorted,
  type RabotajScoreCriterionId,
  type RabotajScoreInput
} from "@/lib/rabotaj-score";
import type { ContractType, WorkModel } from "@/lib/data/jobs";

type WizardState = {
  title: string;
  country: string;
  city: string;
  workMode: WorkModel | "";
  contractType: ContractType | "";
  salaryMin: string;
  salaryMax: string;
  experienceLevel: string;
  workLanguage: string;
  requirements: string;
  responsibilities: string;
  benefits: string;
  recruitmentProcess: string;
  responseTimeDays: string;
  startDate: string;
};

function toLines(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

const STEP_LABELS_PL = [
  "Stanowisko",
  "Lokalizacja i model pracy",
  "Wynagrodzenie i umowa",
  "Wymagania",
  "Obowiązki",
  "Benefity",
  "Proces rekrutacji",
  "Podgląd"
];

/** Which step each Rabotaj Score criterion's field lives on — drives the "Uzupełnij" jump-to-step + scroll. */
const CRITERION_STEP: Partial<Record<RabotajScoreCriterionId, number>> = {
  contractType: 2,
  salaryRange: 2,
  workModel: 1,
  location: 1,
  workLanguage: 3,
  requirements: 3,
  responsibilities: 4,
  benefits: 5,
  recruitmentProcess: 6,
  expectedResponseTime: 6,
  startDate: 6
};

const FIELD_IDS: Partial<Record<RabotajScoreCriterionId, string>> = {
  salaryRange: "field-salary",
  contractType: "field-contractType",
  workModel: "field-workMode",
  location: "field-location",
  workLanguage: "field-language",
  requirements: "field-requirements",
  responsibilities: "field-responsibilities",
  benefits: "field-benefits",
  recruitmentProcess: "field-process",
  expectedResponseTime: "field-responseTime",
  startDate: "field-startDate"
};

export function PublicJobWizard() {
  const { t } = useI18n();
  const { showToast } = useToast();
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [state, setState] = useState<WizardState>({
    title: "",
    country: "Polska",
    city: "",
    workMode: "",
    contractType: "",
    salaryMin: "",
    salaryMax: "",
    experienceLevel: "",
    workLanguage: "",
    requirements: "",
    responsibilities: "",
    benefits: "",
    recruitmentProcess: "",
    responseTimeDays: "",
    startDate: ""
  });

  function update<K extends keyof WizardState>(key: K, value: WizardState[K]) {
    setState((prev) => ({ ...prev, [key]: value }));
  }

  const scoreInput: RabotajScoreInput = useMemo(() => {
    const min = Number(state.salaryMin) || 0;
    const max = Number(state.salaryMax) || 0;
    return {
      salaryDisclosed: min > 0 && max > 0,
      salaryMin: min,
      salaryMax: max,
      verifiedEmployer: false,
      contractType: (state.contractType || "") as ContractType,
      workModel: (state.workMode || "") as WorkModel,
      city: state.city,
      country: state.country,
      language: state.workLanguage,
      responsibilities: toLines(state.responsibilities),
      requirements: toLines(state.requirements),
      benefits: toLines(state.benefits),
      process: toLines(state.recruitmentProcess),
      expectedResponseTime: state.responseTimeDays.trim() || undefined,
      startDate: state.startDate.trim() || undefined
    };
  }, [state]);

  const result = calculateRabotajScore(scoreInput);
  const suggestions = getMissingCriteriaSorted(result).filter((c) => c.id !== "verifiedEmployer");

  function jumpToField(criterionId: RabotajScoreCriterionId) {
    const targetStep = CRITERION_STEP[criterionId];
    const fieldId = FIELD_IDS[criterionId];
    if (targetStep === undefined) return;
    setStep(targetStep);
    window.setTimeout(() => {
      const el = fieldId ? document.getElementById(fieldId) : null;
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      el?.focus({ preventScroll: true });
    }, 50);
  }

  function handleSubmit() {
    if (!state.title.trim()) return;
    setSubmitted(true);
    showToast("Ogłoszenie zostało dodane (wersja demonstracyjna)");
  }

  if (submitted) {
    return (
      <div className="mx-auto flex max-w-xl items-start gap-3 rounded-2xl border border-success/30 bg-green-50 p-6">
        <CheckCircle2 size={22} className="mt-0.5 shrink-0 text-success" aria-hidden="true" />
        <div>
          <p className="font-heading text-sm font-bold text-ink">Ogłoszenie „{state.title}” zostało dodane</p>
          <p className="mt-1 text-sm text-ink/70">
            Rabotaj Score tej oferty: {result.score}/100 ({t.rabotajScore.levels[result.level]}). W wersji produkcyjnej
            trafiłoby ono do publikacji po weryfikacji przez zespół Rabotaj.
          </p>
        </div>
      </div>
    );
  }

  const isLast = step === STEP_LABELS_PL.length - 1;

  return (
    <div id="post-job" className="scroll-mt-24 grid gap-8 lg:grid-cols-[1fr_340px] lg:items-start">
      <div>
        <div className="flex flex-wrap gap-2">
          {STEP_LABELS_PL.map((label, index) => (
            <button
              key={label}
              type="button"
              onClick={() => setStep(index)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors duration-150 ${
                index === step
                  ? "border-brand bg-brand-light text-brand"
                  : "border-border bg-white text-muted hover:border-brand hover:text-brand"
              }`}
            >
              {index + 1}. {label}
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-border bg-white p-6 shadow-soft">
          {step === 0 && (
            <div className="flex flex-col gap-4">
              <Text label="Stanowisko" value={state.title} onChange={(v) => update("title", v)} placeholder="np. Kierowca C+E" />
            </div>
          )}

          {step === 1 && (
            <div id={FIELD_IDS.location} tabIndex={-1} className="flex flex-col gap-4 outline-none">
              <div className="grid grid-cols-2 gap-3">
                <Text label="Miasto" value={state.city} onChange={(v) => update("city", v)} placeholder="np. Warszawa" />
                <Text label="Kraj" value={state.country} onChange={(v) => update("country", v)} placeholder="np. Polska" />
              </div>
              <Select
                id={FIELD_IDS.workModel}
                label="Model pracy"
                value={state.workMode}
                onChange={(v) => update("workMode", v as WizardState["workMode"])}
                options={[
                  { value: "remote", label: "Zdalna" },
                  { value: "hybrid", label: "Hybrydowa" },
                  { value: "onsite", label: "Stacjonarna" }
                ]}
              />
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-4">
              <Select
                id={FIELD_IDS.contractType}
                label="Rodzaj umowy"
                value={state.contractType}
                onChange={(v) => update("contractType", v as WizardState["contractType"])}
                options={[
                  { value: "Umowa o pracę", label: "Umowa o pracę" },
                  { value: "B2B", label: "B2B" },
                  { value: "Umowa zlecenie", label: "Umowa zlecenie" },
                  { value: "Praca tymczasowa", label: "Praca tymczasowa" }
                ]}
              />
              <div id={FIELD_IDS.salaryRange} tabIndex={-1} className="grid grid-cols-2 gap-3 outline-none">
                <Text label="Wynagrodzenie od" value={state.salaryMin} onChange={(v) => update("salaryMin", v)} type="number" />
                <Text label="Wynagrodzenie do" value={state.salaryMax} onChange={(v) => update("salaryMax", v)} type="number" />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-4">
              <Select
                label="Poziom doświadczenia"
                value={state.experienceLevel}
                onChange={(v) => update("experienceLevel", v)}
                options={[
                  { value: "Bez doświadczenia", label: "Bez doświadczenia" },
                  { value: "Junior", label: "Junior" },
                  { value: "Mid", label: "Mid" },
                  { value: "Senior", label: "Senior" }
                ]}
              />
              <Text
                id={FIELD_IDS.workLanguage}
                label="Język pracy"
                value={state.workLanguage}
                onChange={(v) => update("workLanguage", v)}
                placeholder="np. polski / angielski"
              />
              <TextArea
                id={FIELD_IDS.requirements}
                label="Wymagania (jedna linia = jeden punkt)"
                value={state.requirements}
                onChange={(v) => update("requirements", v)}
              />
            </div>
          )}

          {step === 4 && (
            <div className="flex flex-col gap-4">
              <TextArea
                id={FIELD_IDS.responsibilities}
                label="Zakres obowiązków (jedna linia = jeden punkt)"
                value={state.responsibilities}
                onChange={(v) => update("responsibilities", v)}
              />
            </div>
          )}

          {step === 5 && (
            <div className="flex flex-col gap-4">
              <TextArea
                id={FIELD_IDS.benefits}
                label="Benefity (jedna linia = jeden punkt)"
                value={state.benefits}
                onChange={(v) => update("benefits", v)}
              />
            </div>
          )}

          {step === 6 && (
            <div className="flex flex-col gap-4">
              <TextArea
                id={FIELD_IDS.recruitmentProcess}
                label="Etapy rekrutacji (jedna linia = jeden etap)"
                value={state.recruitmentProcess}
                onChange={(v) => update("recruitmentProcess", v)}
              />
              <div className="grid grid-cols-2 gap-3">
                <Text
                  id={FIELD_IDS.expectedResponseTime}
                  label="Przewidywany czas odpowiedzi"
                  value={state.responseTimeDays}
                  onChange={(v) => update("responseTimeDays", v)}
                  placeholder="np. Zwykle w ciągu 2 dni roboczych"
                />
                <Text
                  id={FIELD_IDS.startDate}
                  label="Data rozpoczęcia pracy"
                  value={state.startDate}
                  onChange={(v) => update("startDate", v)}
                  placeholder="np. Od zaraz"
                />
              </div>
            </div>
          )}

          {step === 7 && (
            <div className="flex flex-col gap-3 text-sm">
              <h3 className="font-heading text-base font-bold text-ink">{state.title || "(bez tytułu)"}</h3>
              <p className="text-muted">
                {[state.city, state.country].filter(Boolean).join(", ")}
                {state.workMode ? ` · ${state.workMode}` : ""}
                {state.contractType ? ` · ${state.contractType}` : ""}
              </p>
              <p className="text-xs text-muted">
                Rabotaj Score tej oferty: <span className="font-bold text-ink">{result.score}/100</span> (
                {t.rabotajScore.levels[result.level]})
              </p>
              <button
                type="button"
                onClick={handleSubmit}
                className="mt-2 w-fit rounded-xl bg-brand px-6 py-3.5 text-sm font-bold text-white transition-colors duration-200 hover:bg-blue-700"
              >
                {t.employersSection.postJob}
              </button>
            </div>
          )}

          <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-ink transition-colors duration-150 hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={15} aria-hidden="true" />
              Wstecz
            </button>
            {!isLast && (
              <button
                type="button"
                onClick={() => setStep((s) => Math.min(STEP_LABELS_PL.length - 1, s + 1))}
                className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-blue-700"
              >
                Dalej
                <ChevronRight size={15} aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      </div>

      <aside className="flex flex-col gap-4 lg:sticky lg:top-24">
        <RabotajScoreDetails result={result} showBreakdown={false} showHowWeCalculate={false} />
        {suggestions.length > 0 && (
          <div className="rounded-2xl border border-border bg-white p-6 shadow-soft">
            <h3 className="font-heading text-sm font-bold text-ink">{t.rabotajScore.whatToImprove}</h3>
            <ul className="mt-4 flex flex-col gap-3">
              {suggestions.map((criterion) => (
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
                  <button
                    type="button"
                    onClick={() => jumpToField(criterion.id)}
                    className="shrink-0 rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-semibold text-ink transition-colors duration-150 hover:border-brand hover:text-brand"
                  >
                    {t.rabotajScore.fillField}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>
    </div>
  );
}

function Text({
  id,
  label,
  value,
  onChange,
  type = "text",
  placeholder
}: {
  id?: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-ink">{label}</span>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="rounded-xl border border-border bg-white px-4 py-3 text-sm text-ink placeholder:text-muted focus:outline-none focus-visible:outline-2 focus-visible:outline-brand"
      />
    </label>
  );
}

function TextArea({
  id,
  label,
  value,
  onChange,
  rows = 3
}: {
  id?: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-ink">{label}</span>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="rounded-xl border border-border bg-white px-4 py-3 text-sm text-ink focus:outline-none focus-visible:outline-2 focus-visible:outline-brand"
      />
    </label>
  );
}

function Select({
  id,
  label,
  value,
  onChange,
  options
}: {
  id?: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-ink">{label}</span>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border border-border bg-white px-4 py-3 text-sm text-ink focus:outline-none focus-visible:outline-2 focus-visible:outline-brand"
      >
        <option value="">—</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
