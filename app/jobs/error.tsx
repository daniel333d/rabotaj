"use client";

import { AlertTriangle } from "lucide-react";

export default function JobsError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="container-page flex min-h-[50vh] flex-col items-center justify-center gap-4 py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
        <AlertTriangle size={24} aria-hidden="true" />
      </span>
      <h1 className="font-heading text-xl font-bold text-ink">Nie udało się wczytać ofert</h1>
      <p className="max-w-sm text-sm text-muted">
        Wystąpił problem podczas pobierania ofert pracy. Spróbuj ponownie za chwilę.
      </p>
      <button
        type="button"
        onClick={reset}
        className="rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-blue-700"
      >
        Spróbuj ponownie
      </button>
    </div>
  );
}
