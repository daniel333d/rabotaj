"use client";

import { Bookmark } from "lucide-react";
import { useSavedJobs } from "@/lib/saved-jobs-context";
import { useToast } from "@/lib/toast-context";
import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

export function SaveButton({ slug, className }: { slug: string; className?: string }) {
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
