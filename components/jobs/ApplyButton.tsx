"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2, X } from "lucide-react";
import { useToast } from "@/lib/toast-context";
import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";
import { createApplicationAction, type ApplicationActionState } from "@/lib/actions/jobs";

type ApplyButtonProps = {
  className?: string;
  full?: boolean;
  /** DB job id — when present, applying goes through Supabase instead of the local demo simulation. */
  jobId?: string;
  isLoggedIn?: boolean;
  alreadyApplied?: boolean;
};

const initialState: ApplicationActionState = {};

export function ApplyButton({ className, full = false, jobId, isLoggedIn, alreadyApplied }: ApplyButtonProps) {
  if (jobId) {
    return (
      <DbApplyButton
        jobId={jobId}
        className={className}
        full={full}
        isLoggedIn={Boolean(isLoggedIn)}
        alreadyApplied={Boolean(alreadyApplied)}
      />
    );
  }
  return <LocalApplyButton className={className} full={full} />;
}

function DbApplyButton({
  jobId,
  className,
  full,
  isLoggedIn,
  alreadyApplied
}: {
  jobId: string;
  className?: string;
  full: boolean;
  isLoggedIn: boolean;
  alreadyApplied: boolean;
}) {
  const { t } = useI18n();
  const { showToast } = useToast();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [applied, setApplied] = useState(alreadyApplied);
  const [state, formAction, pending] = useActionState(createApplicationAction, initialState);

  useEffect(() => {
    if (!state.success) return;
    setApplied(true);
    showToast(t.toast.applicationSent);
    const timeout = window.setTimeout(() => setOpen(false), 1200);
    return () => window.clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.success]);

  function handleOpen() {
    if (applied) return;
    if (!isLoggedIn) {
      showToast(t.jobDetail.loginToApply);
      router.push("/login");
      return;
    }
    setOpen(true);
  }

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        disabled={applied}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold text-white transition-colors duration-200 disabled:cursor-not-allowed",
          applied ? "bg-success" : "bg-brand hover:bg-blue-700",
          full && "w-full",
          className
        )}
      >
        {applied ? (
          <>
            <CheckCircle2 size={16} aria-hidden="true" />
            {t.jobDetail.alreadyApplied}
          </>
        ) : (
          t.common.applyFast
        )}
      </button>

      {open && <ApplyModal jobId={jobId} formAction={formAction} pending={pending} state={state} onClose={() => setOpen(false)} />}
    </>
  );
}

function ApplyModal({
  jobId,
  formAction,
  pending,
  state,
  onClose
}: {
  jobId: string;
  formAction: (formData: FormData) => void;
  pending: boolean;
  state: ApplicationActionState;
  onClose: () => void;
}) {
  const { t } = useI18n();

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-navy/50" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="apply-modal-title"
        className="animate-fade-in relative w-full max-w-md rounded-2xl border border-border bg-white p-6 shadow-elevated"
      >
        <div className="flex items-center justify-between">
          <h2 id="apply-modal-title" className="font-heading text-lg font-bold text-ink">
            {t.jobDetail.applyModalTitle}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.common.close}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-ink"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {state.success ? (
          <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-success/30 bg-green-50 p-4 text-sm text-ink" role="status">
            <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-success" aria-hidden="true" />
            {t.toast.applicationSent}
          </div>
        ) : (
          <form action={formAction} className="mt-5 flex flex-col gap-4">
            <input type="hidden" name="jobId" value={jobId} />
            {state.error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">
                {state.error === "already-applied" ? t.jobDetail.alreadyApplied : t.auth.genericError}
              </div>
            )}
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-ink">{t.jobDetail.messageLabel}</span>
              <textarea
                name="message"
                rows={3}
                autoFocus
                className="rounded-xl border border-border bg-white px-4 py-3 text-sm text-ink focus:outline-none focus-visible:outline-2 focus-visible:outline-brand"
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-ink">{t.jobDetail.expectedSalaryLabel}</span>
                <input
                  type="number"
                  name="expectedSalary"
                  min={0}
                  className="rounded-xl border border-border bg-white px-4 py-3 text-sm text-ink focus:outline-none focus-visible:outline-2 focus-visible:outline-brand"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-ink">{t.jobDetail.availabilityLabel}</span>
                <input
                  type="date"
                  name="availabilityDate"
                  className="rounded-xl border border-border bg-white px-4 py-3 text-sm text-ink focus:outline-none focus-visible:outline-2 focus-visible:outline-brand"
                />
              </label>
            </div>
            <button
              type="submit"
              disabled={pending}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white transition-colors duration-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
              {t.jobDetail.sendApplication}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function LocalApplyButton({ className, full }: { className?: string; full: boolean }) {
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
