"use client";

import { useActionState } from "react";
import { useToast } from "@/lib/toast-context";
import { upsertCompanyAction } from "@/lib/actions/employer";
import type { ActionState } from "@/lib/actions/auth";
import type { EmployerCompany } from "@/lib/data/db-employer";

const initialState: ActionState = {};

export function CompanyForm({ company }: { company: EmployerCompany | null }) {
  const { showToast } = useToast();
  const [state, formAction, pending] = useActionState(upsertCompanyAction, initialState);

  if (state.success) showToast("Zapisano profil firmy");

  return (
    <form action={formAction} className="flex flex-col gap-4 rounded-2xl border border-border bg-white p-6 shadow-soft">
      {state.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">
          {state.error}
        </div>
      )}
      <Field label="Nazwa firmy" name="name" defaultValue={company?.name ?? ""} required />
      <Field label="Slug (adres URL)" name="slug" defaultValue={company?.slug ?? ""} placeholder="np. moja-firma" required />
      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold text-ink">Opis firmy</span>
        <textarea
          name="description"
          rows={4}
          defaultValue={company?.description ?? ""}
          className="rounded-xl border border-border bg-white px-4 py-3 text-sm text-ink focus:outline-none focus-visible:outline-2 focus-visible:outline-brand"
        />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Branża" name="industry" defaultValue={company?.industry ?? ""} />
        <Field label="Strona internetowa" name="website" defaultValue={company?.website ?? ""} placeholder="https://" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Kraj" name="country" defaultValue={company?.country ?? ""} />
        <Field label="Miasto" name="city" defaultValue={company?.city ?? ""} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Wielkość firmy" name="employeeCount" defaultValue={company?.employee_count ?? ""} placeholder="np. 50-120 pracowników" />
        <Field label="Rok założenia" name="foundedYear" type="number" defaultValue={company?.founded_year?.toString() ?? ""} />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white transition-colors duration-200 hover:bg-blue-700 disabled:opacity-60"
      >
        {pending ? "Zapisywanie…" : "Zapisz profil firmy"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  placeholder,
  required
}: {
  label: string;
  name: string;
  defaultValue?: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-ink">{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className="rounded-xl border border-border bg-white px-4 py-3 text-sm text-ink placeholder:text-muted focus:outline-none focus-visible:outline-2 focus-visible:outline-brand"
      />
    </label>
  );
}
