"use client";

import { useTransition } from "react";
import { Pause, Archive, Send } from "lucide-react";
import { useToast } from "@/lib/toast-context";
import { pauseJobAction, archiveJobAction, resubmitJobAction } from "@/lib/actions/employer";
import type { JobStatus } from "@/lib/supabase/database.types";

export function JobRowActions({ jobId, status }: { jobId: string; status: JobStatus }) {
  const { showToast } = useToast();
  const [pending, startTransition] = useTransition();

  function run(action: (id: string) => Promise<{ ok: boolean }>, successMessage: string) {
    startTransition(async () => {
      const result = await action(jobId);
      showToast(result.ok ? successMessage : "Nie udało się zaktualizować oferty");
    });
  }

  return (
    <div className="flex items-center gap-2">
      {status === "published" && (
        <button
          type="button"
          disabled={pending}
          onClick={() => run(pauseJobAction, "Oferta wstrzymana")}
          className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-1.5 text-xs font-semibold text-ink transition-colors duration-150 hover:border-brand hover:text-brand disabled:opacity-60"
        >
          <Pause size={12} aria-hidden="true" />
          Wstrzymaj
        </button>
      )}
      {status === "paused" && (
        <button
          type="button"
          disabled={pending}
          onClick={() => run(resubmitJobAction, "Wysłano do ponownej moderacji")}
          className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-1.5 text-xs font-semibold text-ink transition-colors duration-150 hover:border-brand hover:text-brand disabled:opacity-60"
        >
          <Send size={12} aria-hidden="true" />
          Wznów
        </button>
      )}
      {status !== "archived" && (
        <button
          type="button"
          disabled={pending}
          onClick={() => run(archiveJobAction, "Oferta zarchiwizowana")}
          className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-1.5 text-xs font-semibold text-ink transition-colors duration-150 hover:border-red-300 hover:text-red-600 disabled:opacity-60"
        >
          <Archive size={12} aria-hidden="true" />
          Archiwizuj
        </button>
      )}
    </div>
  );
}
