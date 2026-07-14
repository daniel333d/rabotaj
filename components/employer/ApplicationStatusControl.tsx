"use client";

import { useState, useTransition } from "react";
import { useToast } from "@/lib/toast-context";
import { updateApplicationStatusAction } from "@/lib/actions/employer";
import type { ApplicationStatus } from "@/lib/supabase/database.types";

const OPTIONS: { value: ApplicationStatus; label: string }[] = [
  { value: "submitted", label: "Aplikacja wysłana" },
  { value: "viewed", label: "Profil wyświetlony" },
  { value: "shortlisted", label: "Kandydat zakwalifikowany" },
  { value: "interview", label: "Zaproszenie na rozmowę" },
  { value: "offer", label: "Oferta zatrudnienia" },
  { value: "hired", label: "Zatrudniony" },
  { value: "rejected", label: "Odrzucona" }
];

export function ApplicationStatusControl({ applicationId, status }: { applicationId: string; status: string }) {
  const { showToast } = useToast();
  const [value, setValue] = useState(status);
  const [pending, startTransition] = useTransition();
  const isWithdrawn = status === "withdrawn";

  function handleChange(next: string) {
    setValue(next);
    startTransition(async () => {
      const result = await updateApplicationStatusAction(applicationId, next);
      showToast(result.ok ? "Status zaktualizowany" : "Nie udało się zaktualizować statusu");
    });
  }

  if (isWithdrawn) {
    return <span className="rounded-full bg-surface px-3 py-1.5 text-xs font-bold text-muted">Wycofana przez kandydata</span>;
  }

  return (
    <select
      value={value}
      onChange={(e) => handleChange(e.target.value)}
      disabled={pending}
      className="rounded-xl border border-border bg-white px-3 py-2 text-xs font-semibold text-ink focus:outline-none focus-visible:outline-2 focus-visible:outline-brand disabled:opacity-60"
    >
      {OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
