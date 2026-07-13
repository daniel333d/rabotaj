"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useToast } from "@/lib/toast-context";
import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

export function ApplyButton({ className, full = false }: { className?: string; full?: boolean }) {
  const { showToast } = useToast();
  const { t } = useI18n();
  const [state, setState] = useState<"idle" | "loading" | "sent">("idle");

  function handleApply() {
    if (state !== "idle") return;
    setState("loading");
    window.setTimeout(() => {
      setState("sent");
      showToast(t.toast.applicationSent);
    }, 700);
  }

  return (
    <button
      type="button"
      onClick={handleApply}
      disabled={state !== "idle"}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold text-white transition-colors duration-200 disabled:cursor-not-allowed",
        state === "sent" ? "bg-success" : "bg-brand hover:bg-blue-700",
        full && "w-full",
        className
      )}
    >
      {state === "idle" && t.common.applyFast}
      {state === "loading" && (
        <>
          <Loader2 size={16} className="animate-spin" aria-hidden="true" />
          Wysyłanie…
        </>
      )}
      {state === "sent" && (
        <>
          <CheckCircle2 size={16} aria-hidden="true" />
          {t.toast.applicationSent}
        </>
      )}
    </button>
  );
}
