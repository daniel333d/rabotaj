"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Bookmark } from "lucide-react";
import { useSavedJobs } from "@/lib/saved-jobs-context";
import { useToast } from "@/lib/toast-context";
import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";
import { toggleSavedJobAction } from "@/lib/actions/jobs";

type SaveButtonProps = {
  slug: string;
  className?: string;
  /** DB job id — when present, saves go through Supabase instead of the local demo store. */
  jobId?: string;
  isLoggedIn?: boolean;
  initialSaved?: boolean;
};

export function SaveButton({ slug, className, jobId, isLoggedIn, initialSaved }: SaveButtonProps) {
  if (jobId) {
    return <DbSaveButton jobId={jobId} className={className} isLoggedIn={Boolean(isLoggedIn)} initialSaved={Boolean(initialSaved)} />;
  }
  return <LocalSaveButton slug={slug} className={className} />;
}

function DbSaveButton({
  jobId,
  className,
  isLoggedIn,
  initialSaved
}: {
  jobId: string;
  className?: string;
  isLoggedIn: boolean;
  initialSaved: boolean;
}) {
  const { t } = useI18n();
  const { showToast } = useToast();
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);
  const [pending, startTransition] = useTransition();

  function handleClick() {
    if (!isLoggedIn) {
      showToast(t.jobDetail.loginToSave);
      router.push("/login");
      return;
    }
    startTransition(async () => {
      const result = await toggleSavedJobAction(jobId);
      if ("error" in result) {
        if (result.error === "login-required") router.push("/login");
        return;
      }
      setSaved(result.saved);
      showToast(result.saved ? t.toast.jobSaved : t.toast.jobUnsaved);
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      aria-pressed={saved}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl border px-6 py-3.5 text-sm font-bold transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-70",
        saved ? "border-brand bg-brand-light text-brand" : "border-border text-ink hover:border-brand hover:text-brand",
        className
      )}
    >
      <Bookmark size={16} fill={saved ? "currentColor" : "none"} aria-hidden="true" />
      {saved ? t.common.saved : t.common.save}
    </button>
  );
}

function LocalSaveButton({ slug, className }: { slug: string; className?: string }) {
  const { isSaved, toggleSaved } = useSavedJobs();
  const { showToast } = useToast();
  const { t } = useI18n();
  const saved = isSaved(slug);

  return (
    <button
      type="button"
      onClick={() => {
        const nowSaved = toggleSaved(slug);
        showToast(nowSaved ? t.toast.jobSaved : t.toast.jobUnsaved);
      }}
      aria-pressed={saved}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl border px-6 py-3.5 text-sm font-bold transition-colors duration-200",
        saved ? "border-brand bg-brand-light text-brand" : "border-border text-ink hover:border-brand hover:text-brand",
        className
      )}
    >
      <Bookmark size={16} fill={saved ? "currentColor" : "none"} aria-hidden="true" />
      {saved ? t.common.saved : t.common.save}
    </button>
  );
}
