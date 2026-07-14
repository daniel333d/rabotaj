"use client";

import { useActionState, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { RabotajScoreDetails } from "@/components/rabotaj-score/RabotajScoreDetails";
import { calculateRabotajScore, getMissingCriteriaSorted, type RabotajScoreInput } from "@/lib/rabotaj-score";
import { createJobAction, updateJobAction } from "@/lib/actions/employer";
import type { ContractType, WorkModel } from "@/lib/data/jobs";
import type { ContractType as DbContractType, ExperienceLevel as DbExperienceLevel, JobStatus } from "@/lib/supabase/database.types";

type WizardState = {
  title: string;
  slug: string;
  country: string;
  city: string;
  workMode: WorkModel | "";
  contractType: DbContractType | "";
  salaryMin: string;
  salaryMax: string;
  salaryCurrency: string;
  salaryPeriod: "month" | "year" | "hour";
  experienceLevel: DbExperienceLevel | "";
  workLanguage: string;
  requirements: string;
  niceToHave: string;
  noExperienceRequired: boolean;
  skills: string;
  description: string;
  responsibilities: string;
  benefits: string;
  accommodationProvided: boolean;
  recruitmentProcess: string;
  responseTimeDays: string;
  startDate: string;
};

const CONTRACT_UI_LABEL: Record<DbContractType, ContractType> = {
  employment: "Umowa o pracę",
  b2b: "B2B",
  mandate: "Umowa zlecenie",
  temporary: "Praca tymczasowa"
};

function toLines(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

const STEPS = [
  "Podstawowe informacje",
  "Lokalizacja i model pracy",
  "Wynagrodzenie i umowa",
  "Wymagania",
  "Opis",
  "Benefity",
  "Proces rekrutacji",
  "Podgląd"
];

export function JobWizard({
  mode,
  jobId,
  initialValues,
  initialStatus
}: {
  mode: "create" | "edit";
  jobId?: string;
  initialValues?: Partial<WizardState>;
  initialStatus?: JobStatus;
}) {
  const { t } = useI18n();
  const [step, setStep] = useState(0);
  const [state, setState] = useState<WizardState>({
    title: "",
    slug: "",
    country: "",
    city: "",
    workMode: "",
    contractType: "",
    salaryMin: "",
    salaryMax: "",
    salaryCurrency: "PLN",
    salaryPeriod: "month",
    experienceLevel: "",
    workLanguage: "",
    requirements: "",
    niceToHave: "",
    noExperienceRequired: false,
    skills: "",
    description: "",
    responsibilities: "",
    benefits: "",
    accommodationProvided: false,
    recruitmentProcess: "",
    responseTimeDays: "",
    startDate: "",
    ...initialValues
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
      contractType: state.contractType ? CONTRACT_UI_LABEL[state.contractType] : ("" as ContractType),
      workModel: (state.workMode || "onsite") as WorkModel,
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

  const boundAction = mode === "edit" && jobId ? updateJobAction.bind(null, jobId) : createJobAction;
  const [actionState, formAction, pending] = useActionState(boundAction, {});

  function buildFormData(submitForReview: boolean): FormData {
    const fd = new FormData();
    fd.set("title", state.title);
    fd.set("slug", state.slug);
    fd.set("country", state.country);
    fd.set("city", state.city);
    fd.set("workMode", state.workMode);
    fd.set("contractType", state.contractType);
    fd.set("salaryMin", state.salaryMin);
    fd.set("salaryMax", state.salaryMax);
    fd.set("salaryCurrency", state.salaryCurrency);
    fd.set("salaryPeriod", state.salaryPeriod);
    fd.set("experienceLevel", state.experienceLevel);
    fd.set("workLanguage", state.workLanguage);
    fd.set("requirements", state.requirements);
    fd.set("niceToHave", state.niceToHave);
    if (state.noExperienceRequired) fd.set("noExperienceRequired", "on");
    fd.set("skills", state.skills);
    fd.set("description", state.description);
    fd.set("responsibilities", state.responsibilities);
    fd.set("benefits", state.benefits);
    if (state.accommodationProvided) fd.set("accommodationProvided", "on");
    fd.set("recruitmentProcess", state.recruitmentProcess);
    fd.set("responseTimeDays", state.responseTimeDays);
    fd.set("startDate", state.startDate);
    if (submitForReview) fd.set("submitForReview", "on");
    return fd;
  }

  const isLast = step === STEPS.length - 1;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_340px] lg:items-start">
      <div>
        <div className="flex flex-wrap gap-2">
          {STEPS.map((label, index) => (
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
          {actionState.error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">
              {actionState.error}
            </div>
          )}

          {step === 0 && (
            <div className="flex flex-col gap-4">
              <Text label="Tytuł stanowiska" value={state.title} onChange={(v) => update("title", v)} />
              <Text label="Slug (adres URL oferty)" value={state.slug} onChange={(v) => update("slug", v)} placeholder="np. senior-frontend-developer" />
            </div>
          )}

          {step === 1 && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <Text label="Kraj" value={state.country} onChange={(v) => update("country", v)} />
                <Text label="Miasto" value={state.city} onChange={(v) => update("city", v)} />
              </div>
              <Select
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
                label="Rodzaj umowy"
                value={state.contractType}
                onChange={(v) => update("contractType", v as WizardState["contractType"])}
                options={[
                  { value: "employment", label: "Umowa o pracę" },
                  { value: "b2b", label: "B2B" },
                  { value: "mandate", label: "Umowa zlecenie" },
                  { value: "temporary", label: "Praca tymczasowa" }
                ]}
              />
              <div className="grid grid-cols-2 gap-3">
                <Text label="Wynagrodzenie od" value={state.salaryMin} onChange={(v) => update("salaryMin", v)} type="number" />
                <Text label="Wynagrodzenie do" value={state.salaryMax} onChange={(v) => update("salaryMax", v)} type="number" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Text label="Waluta" value={state.salaryCurrency} onChange={(v) => update("salaryCurrency", v)} />
                <Select
                  label="Okres"
                  value={state.salaryPeriod}
                  onChange={(v) => update("salaryPeriod", v as WizardState["salaryPeriod"])}
                  options={[
                    { value: "month", label: "Miesięcznie" },
                    { value: "year", label: "Rocznie" },
                    { value: "hour", label: "Godzinowo" }
                  ]}
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-4">
              <Select
                label="Poziom doświadczenia"
                value={state.experienceLevel}
                onChange={(v) => update("experienceLevel", v as WizardState["experienceLevel"])}
                options={[
                  { value: "no_experience", label: "Bez doświadczenia" },
                  { value: "junior", label: "Junior" },
                  { value: "mid", label: "Mid" },
                  { value: "senior", label: "Senior" }
                ]}
              />
              <Text label="Język pracy" value={state.workLanguage} onChange={(v) => update("workLanguage", v)} placeholder="np. polski / angielski" />
              <TextArea label="Wymagania (jedna linia = jeden punkt)" value={state.requirements} onChange={(v) => update("requirements", v)} />
              <TextArea label="Mile widziane" value={state.niceToHave} onChange={(v) => update("niceToHave", v)} />
              <Text label="Umiejętności (oddzielone przecinkiem)" value={state.skills} onChange={(v) => update("skills", v.replace(/,/g, "\n"))} placeholder="np. React, TypeScript" />
              <Checkbox label="Nie wymagamy doświadczenia" checked={state.noExperienceRequired} onChange={(v) => update("noExperienceRequired", v)} />
            </div>
          )}

          {step === 4 && (
            <div className="flex flex-col gap-4">
              <TextArea label="Opis stanowiska" value={state.description} onChange={(v) => update("description", v)} rows={5} />
              <TextArea label="Zakres obowiązków (jedna linia = jeden punkt)" value={state.responsibilities} onChange={(v) => update("responsibilities", v)} />
            </div>
          )}

          {step === 5 && (
            <div className="flex flex-col gap-4">
              <TextArea label="Benefity (jedna linia = jeden punkt)" value={state.benefits} onChange={(v) => update("benefits", v)} />
              <Checkbox label="Zapewniamy zakwaterowanie" checked={state.accommodationProvided} onChange={(v) => update("accommodationProvided", v)} />
            </div>
          )}

          {step === 6 && (
            <div className="flex flex-col gap-4">
              <TextArea label="Etapy rekrutacji (jedna linia = jeden etap)" value={state.recruitmentProcess} onChange={(v) => update("recruitmentProcess", v)} />
              <div className="grid grid-cols-2 gap-3">
                <Text label="Przewidywany czas odpowiedzi (dni)" value={state.responseTimeDays} onChange={(v) => update("responseTimeDays", v)} type="number" />
                <Text label="Data rozpoczęcia pracy" value={state.startDate} onChange={(v) => update("startDate", v)} type="date" />
              </div>
            </div>
          )}

          {step === 7 && (
            <div className="flex flex-col gap-3 text-sm">
              <h3 className="font-heading text-base font-bold text-ink">{state.title || "(bez tytułu)"}</h3>
              <p className="text-muted">
                {state.city}, {state.country} · {state.workMode} · {state.contractType}
              </p>
              <p className="text-ink/80">{state.description}</p>
              <p className="text-xs text-muted">
                Rabotaj Score tej oferty: <span className="font-bold text-ink">{result.score}/100</span> ({t.rabotajScore.levels[result.level]})
              </p>
              <div className="mt-2 flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => formAction(buildFormData(false))}
                  className="rounded-xl border border-border px-5 py-3 text-sm font-bold text-ink transition-colors duration-200 hover:border-brand hover:text-brand disabled:opacity-60"
                >
                  Zapisz jako szkic
                </button>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => formAction(buildFormData(true))}
                  className="rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white transition-colors duration-200 hover:bg-blue-700 disabled:opacity-60"
                >
                  Wyślij do moderacji
                </button>
              </div>
              {initialStatus && <p className="text-xs text-muted">Obecny status: {initialStatus}</p>}
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
                onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
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
            <ul className="mt-3 flex flex-col gap-2">
              {suggestions.map((c) => (
                <li key={c.id} className="flex items-center justify-between text-xs">
                  <span className="text-ink/80">{t.rabotajScore.criteriaMissing[c.id]}</span>
                  <span className="font-bold text-brand">+{c.points}</span>
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
  label,
  value,
  onChange,
  type = "text",
  placeholder
}: {
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
  label,
  value,
  onChange,
  rows = 3
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-ink">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="rounded-xl border border-border bg-white px-4 py-3 text-sm text-ink focus:outline-none focus-visible:outline-2 focus-visible:outline-brand"
      />
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-ink">{label}</span>
      <select
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

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 text-xs font-semibold text-ink">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-brand" />
      {label}
    </label>
  );
}
