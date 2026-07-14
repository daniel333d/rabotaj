"use client";

import { useActionState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { useToast } from "@/lib/toast-context";
import type { ActionState } from "@/lib/actions/auth";
import type { CandidateProfileFull } from "@/lib/data/db-candidate";
import {
  addEducationAction,
  addExperienceAction,
  addLanguageAction,
  addSkillAction,
  deleteEducationAction,
  deleteExperienceAction,
  deleteLanguageAction,
  deleteSkillAction,
  updateCandidateBasicsAction,
  updateCandidatePreferencesAction
} from "@/lib/actions/candidate";

const initialState: ActionState = {};

export function CareerPassportEditor({ data, origin }: { data: CandidateProfileFull; origin: string }) {
  const { t } = useI18n();

  return (
    <div className="bg-surface">
      <div className="container-page py-10 sm:py-14">
        <h1 className="font-heading text-2xl font-extrabold text-ink sm:text-3xl">{t.careerPassport.title}</h1>

        <div className="mt-6 rounded-2xl border border-border bg-white p-6 shadow-soft">
          <div className="flex items-center justify-between text-sm font-semibold text-ink">
            <span>{t.careerPassport.completeness}</span>
            <span className="text-success">{data.profileCompletion}%</span>
          </div>
          <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-success transition-[width] duration-500"
              style={{ width: `${data.profileCompletion}%` }}
            />
          </div>
          {data.candidate?.isPublic && data.candidate.publicSlug && (
            <p className="mt-3 text-xs text-muted">
              Publiczny profil: <span className="font-semibold text-brand">{origin}/profile/{data.candidate.publicSlug}</span>
            </p>
          )}
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <BasicsForm data={data} />
          <PreferencesForm data={data} />
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <ExperienceSection experience={data.experience} />
          <EducationSection education={data.education} />
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <SkillsSection skills={data.skills} />
          <LanguagesSection languages={data.languages} />
        </div>
      </div>
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-white p-6 shadow-soft">
      <h2 className="font-heading text-base font-bold text-ink">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function TextField({
  label,
  name,
  defaultValue,
  type = "text",
  placeholder
}: {
  label: string;
  name: string;
  defaultValue?: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-ink">{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="rounded-xl border border-border bg-white px-4 py-3 text-sm text-ink placeholder:text-muted focus:outline-none focus-visible:outline-2 focus-visible:outline-brand"
      />
    </label>
  );
}

function BasicsForm({ data }: { data: CandidateProfileFull }) {
  const { t } = useI18n();
  const { showToast } = useToast();
  const [state, formAction, pending] = useActionState(updateCandidateBasicsAction, initialState);
  if (state.success) showToast(t.dashboard.settingsSaved);

  return (
    <SectionCard title="Dane podstawowe">
      <form action={formAction} className="flex flex-col gap-4">
        <TextField label="Tytuł zawodowy" name="professionalTitle" defaultValue={data.candidate?.professionalTitle ?? ""} />
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-ink">O mnie</span>
          <textarea
            name="summary"
            rows={4}
            defaultValue={data.candidate?.summary ?? ""}
            className="rounded-xl border border-border bg-white px-4 py-3 text-sm text-ink focus:outline-none focus-visible:outline-2 focus-visible:outline-brand"
          />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <TextField label="Miasto" name="city" defaultValue={data.profile.city ?? ""} />
          <TextField label="Kraj" name="country" defaultValue={data.profile.country ?? ""} />
        </div>
        <TextField label="Telefon" name="phone" type="tel" defaultValue={data.profile.phone ?? ""} placeholder="+48 600 000 000" />
        <button type="submit" disabled={pending} className="self-start rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white transition-colors duration-200 hover:bg-blue-700 disabled:opacity-60">
          {pending ? t.common.loading : t.common.save}
        </button>
      </form>
    </SectionCard>
  );
}

function PreferencesForm({ data }: { data: CandidateProfileFull }) {
  const { t } = useI18n();
  const { showToast } = useToast();
  const [state, formAction, pending] = useActionState(updateCandidatePreferencesAction, initialState);
  if (state.success) showToast(t.dashboard.settingsSaved);

  return (
    <SectionCard title="Preferencje">
      <form action={formAction} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <TextField label="Wynagrodzenie od" name="expectedSalaryMin" type="number" defaultValue={data.candidate?.expectedSalaryMin?.toString() ?? ""} />
          <TextField label="Wynagrodzenie do" name="expectedSalaryMax" type="number" defaultValue={data.candidate?.expectedSalaryMax?.toString() ?? ""} />
        </div>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-ink">Preferowany model pracy</span>
          <select
            name="preferredWorkMode"
            defaultValue={data.candidate?.preferredWorkMode ?? ""}
            className="rounded-xl border border-border bg-white px-4 py-3 text-sm text-ink focus:outline-none focus-visible:outline-2 focus-visible:outline-brand"
          >
            <option value="">—</option>
            <option value="remote">Zdalna</option>
            <option value="hybrid">Hybrydowa</option>
            <option value="onsite">Stacjonarna</option>
          </select>
        </label>
        <TextField label="Dostępność od" name="availabilityDate" type="date" defaultValue={data.candidate?.availabilityDate ?? ""} />
        <label className="flex cursor-pointer items-center justify-between gap-3">
          <span className="text-sm font-semibold text-ink">{t.careerPassport.relocation}</span>
          <input type="checkbox" name="relocationReady" defaultChecked={data.candidate?.relocationReady} className="h-5 w-5 accent-brand" />
        </label>
        <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-border bg-surface/60 px-4 py-3">
          <span className="text-sm font-semibold text-ink">Profil publiczny</span>
          <input type="checkbox" name="isPublic" defaultChecked={data.candidate?.isPublic} className="h-5 w-5 accent-brand" />
        </label>
        <button type="submit" disabled={pending} className="self-start rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white transition-colors duration-200 hover:bg-blue-700 disabled:opacity-60">
          {pending ? t.common.loading : t.common.save}
        </button>
      </form>
    </SectionCard>
  );
}

function ExperienceSection({ experience }: { experience: CandidateProfileFull["experience"] }) {
  const [state, formAction, pending] = useActionState(addExperienceAction, initialState);
  const [, startTransition] = useTransition();

  return (
    <SectionCard title="Doświadczenie zawodowe">
      <ul className="flex flex-col gap-3">
        {experience.map((item) => (
          <li key={item.id} className="flex items-start justify-between gap-3 rounded-xl border border-border bg-surface/60 p-3.5">
            <div>
              <p className="text-sm font-bold text-ink">{item.position}</p>
              <p className="text-xs text-muted">
                {item.companyName} · {item.startDate.slice(0, 7)} – {item.isCurrent ? "obecnie" : item.endDate?.slice(0, 7) ?? ""}
              </p>
            </div>
            <button
              type="button"
              onClick={() => startTransition(() => deleteExperienceAction(item.id))}
              aria-label="Usuń"
              className="shrink-0 rounded-lg p-1.5 text-muted transition-colors duration-150 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 size={15} aria-hidden="true" />
            </button>
          </li>
        ))}
        {experience.length === 0 && <p className="text-sm text-muted">Brak wpisów.</p>}
      </ul>

      <form action={formAction} className="mt-4 flex flex-col gap-3 border-t border-border pt-4">
        <div className="grid grid-cols-2 gap-3">
          <TextField label="Firma" name="companyName" />
          <TextField label="Stanowisko" name="position" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <TextField label="Data rozpoczęcia" name="startDate" type="date" />
          <TextField label="Data zakończenia" name="endDate" type="date" />
        </div>
        <label className="flex items-center gap-2 text-xs font-semibold text-ink">
          <input type="checkbox" name="isCurrent" className="h-4 w-4 accent-brand" />
          Nadal tu pracuję
        </label>
        {state.error && <p className="text-xs text-red-600">{state.error}</p>}
        <button type="submit" disabled={pending} className="self-start rounded-xl border border-border px-4 py-2.5 text-xs font-bold text-ink transition-colors duration-150 hover:border-brand hover:text-brand disabled:opacity-60">
          + Dodaj doświadczenie
        </button>
      </form>
    </SectionCard>
  );
}

function EducationSection({ education }: { education: CandidateProfileFull["education"] }) {
  const [state, formAction, pending] = useActionState(addEducationAction, initialState);
  const [, startTransition] = useTransition();

  return (
    <SectionCard title="Wykształcenie">
      <ul className="flex flex-col gap-3">
        {education.map((item) => (
          <li key={item.id} className="flex items-start justify-between gap-3 rounded-xl border border-border bg-surface/60 p-3.5">
            <div>
              <p className="text-sm font-bold text-ink">{item.institution}</p>
              <p className="text-xs text-muted">{[item.degree, item.field].filter(Boolean).join(" · ")}</p>
            </div>
            <button
              type="button"
              onClick={() => startTransition(() => deleteEducationAction(item.id))}
              aria-label="Usuń"
              className="shrink-0 rounded-lg p-1.5 text-muted transition-colors duration-150 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 size={15} aria-hidden="true" />
            </button>
          </li>
        ))}
        {education.length === 0 && <p className="text-sm text-muted">Brak wpisów.</p>}
      </ul>

      <form action={formAction} className="mt-4 flex flex-col gap-3 border-t border-border pt-4">
        <TextField label="Uczelnia / szkoła" name="institution" />
        <div className="grid grid-cols-2 gap-3">
          <TextField label="Kierunek" name="field" />
          <TextField label="Stopień" name="degree" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <TextField label="Data rozpoczęcia" name="startDate" type="date" />
          <TextField label="Data zakończenia" name="endDate" type="date" />
        </div>
        {state.error && <p className="text-xs text-red-600">{state.error}</p>}
        <button type="submit" disabled={pending} className="self-start rounded-xl border border-border px-4 py-2.5 text-xs font-bold text-ink transition-colors duration-150 hover:border-brand hover:text-brand disabled:opacity-60">
          + Dodaj wykształcenie
        </button>
      </form>
    </SectionCard>
  );
}

function SkillsSection({ skills }: { skills: CandidateProfileFull["skills"] }) {
  const { t } = useI18n();
  const [state, formAction, pending] = useActionState(addSkillAction, initialState);
  const [, startTransition] = useTransition();

  return (
    <SectionCard title={t.careerPassport.skills}>
      <div className="flex flex-wrap gap-2">
        {skills.map((item) => (
          <span key={item.id} className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1.5 text-xs font-semibold text-ink">
            {item.skillName}
            <button type="button" onClick={() => startTransition(() => deleteSkillAction(item.id))} aria-label="Usuń" className="text-muted hover:text-red-600">
              <Trash2 size={12} aria-hidden="true" />
            </button>
          </span>
        ))}
        {skills.length === 0 && <p className="text-sm text-muted">Brak wpisów.</p>}
      </div>

      <form action={formAction} className="mt-4 flex items-end gap-3 border-t border-border pt-4">
        <div className="flex-1">
          <TextField label="Umiejętność" name="skillName" placeholder="np. React" />
        </div>
        {state.error && <p className="text-xs text-red-600">{state.error}</p>}
        <button type="submit" disabled={pending} className="rounded-xl border border-border px-4 py-3 text-xs font-bold text-ink transition-colors duration-150 hover:border-brand hover:text-brand disabled:opacity-60">
          + Dodaj
        </button>
      </form>
    </SectionCard>
  );
}

function LanguagesSection({ languages }: { languages: CandidateProfileFull["languages"] }) {
  const { t } = useI18n();
  const [state, formAction, pending] = useActionState(addLanguageAction, initialState);
  const [, startTransition] = useTransition();

  return (
    <SectionCard title={t.careerPassport.languages}>
      <ul className="flex flex-col gap-2">
        {languages.map((item) => (
          <li key={item.id} className="flex items-center justify-between rounded-xl border border-border bg-surface/60 px-3.5 py-2.5 text-sm">
            <span className="font-semibold text-ink">
              {item.languageCode.toUpperCase()} · {item.level}
            </span>
            <button type="button" onClick={() => startTransition(() => deleteLanguageAction(item.id))} aria-label="Usuń" className="text-muted hover:text-red-600">
              <Trash2 size={14} aria-hidden="true" />
            </button>
          </li>
        ))}
        {languages.length === 0 && <p className="text-sm text-muted">Brak wpisów.</p>}
      </ul>

      <form action={formAction} className="mt-4 flex items-end gap-3 border-t border-border pt-4">
        <TextField label="Kod języka" name="languageCode" placeholder="np. en" />
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-ink">Poziom</span>
          <select name="level" className="rounded-xl border border-border bg-white px-4 py-3 text-sm text-ink focus:outline-none focus-visible:outline-2 focus-visible:outline-brand">
            {["A1", "A2", "B1", "B2", "C1", "C2", "native"].map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </label>
        {state.error && <p className="text-xs text-red-600">{state.error}</p>}
        <button type="submit" disabled={pending} className="rounded-xl border border-border px-4 py-3 text-xs font-bold text-ink transition-colors duration-150 hover:border-brand hover:text-brand disabled:opacity-60">
          + Dodaj
        </button>
      </form>
    </SectionCard>
  );
}
