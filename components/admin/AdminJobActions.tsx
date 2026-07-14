"use client";

import { useTransition } from "react";
import { Check, X } from "lucide-react";
import { useToast } from "@/lib/toast-context";
import { approveJobAction, rejectJobAction } from "@/lib/actions/admin";

export function AdminJobActions({ jobId, status }: { jobId: string; status: string }) {
  const { showToast } = useToast();
  const [pending, startTransition] = useTransition();

  if (status !== "pending_review") return null;

  function handle(action: (id: string) => Promise<{ ok: boolean }>, message: string) {
    startTransition(async () => {
      const result = await action(jobId);
      showToast(result.ok ? message : "Nie udało się zaktualizować oferty");
    });
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={() => handle(approveJobAction, "Oferta zatwierdzona")}
        className="inline-flex items-center gap-1.5 rounded-xl border border-success/30 bg-green-50 px-3 py-1.5 text-xs font-bold text-success transition-colors duration-150 hover:bg-green-100 disabled:opacity-60"
      >
        <Check size={12} aria-hidden="true" />
        Zatwierdź
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => handle(rejectJobAction, "Oferta odrzucona")}
        className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 transition-colors duration-150 hover:bg-red-100 disabled:opacity-60"
      >
        <X size={12} aria-hidden="true" />
        Odrzuć
      </button>
    </div>
  );
}
