"use client";

import Link from "next/link";
import { Bookmark, MapPin, Briefcase, ShieldCheck, Wallet, Home, FileX2, Clock3 } from "lucide-react";
import type { Job } from "@/lib/data/jobs";
import { getCompanyBySlug } from "@/lib/data/companies";
import { formatSalary, formatDate, workModelLabel } from "@/lib/format";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { MatchRing } from "@/components/ui/MatchRing";
import { Badge } from "@/components/ui/Badge";
import { useSavedJobs } from "@/lib/saved-jobs-context";
import { useToast } from "@/lib/toast-context";
import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

export function JobCard({ job, className }: { job: Job; className?: string }) {
  const company = getCompanyBySlug(job.companySlug);
  const { isSaved, toggleSaved } = useSavedJobs();
  const { showToast } = useToast();
  const { t } = useI18n();
  const saved = isSaved(job.slug);

  if (!company) return null;

  function handleSave(event: React.MouseEvent) {
    event.preventDefault();
    const nowSaved = toggleSaved(job.slug);
    showToast(nowSaved ? t.toast.jobSaved : t.toast.jobUnsaved);
  }

  function handleApply(event: React.MouseEvent) {
    event.preventDefault();
    showToast(t.toast.applicationSent);
  }

  return (
    <article
      className={cn(
        "group relative flex flex-col gap-4 rounded-2xl border border-border bg-white p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-elevated sm:p-6",
        className
      )}
    >
      <Link href={`/jobs/${job.slug}`} className="absolute inset-0 z-0" aria-label={job.title} tabIndex={-1} />

      <div className="relative z-10 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <CompanyLogo initials={company.initials} color={company.color} size={48} />
          <div>
            <h3 className="font-heading text-base font-bold leading-snug text-ink group-hover:text-brand sm:text-lg">
              {job.title}
            </h3>
            <p className="mt-0.5 text-sm font-medium text-muted">{company.name}</p>
          </div>
        </div>
        <MatchRing percent={job.matchPercent} />
      </div>

      <div className="relative z-10 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted">
        <span className="inline-flex items-center gap-1.5">
          <MapPin size={15} className="shrink-0" aria-hidden="true" />
          {job.city}, {job.country}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Briefcase size={15} className="shrink-0" aria-hidden="true" />
          {workModelLabel(job.workModel)}
        </span>
        <span className="inline-flex items-center gap-1.5 font-semibold text-ink">
          <Wallet size={15} className="shrink-0 text-success" aria-hidden="true" />
          {formatSalary(job)} {t.common.gross}
        </span>
      </div>

      <div className="relative z-10 flex flex-wrap gap-1.5">
        {job.skills.slice(0, 4).map((skill) => (
          <Badge key={skill} tone="neutral">
            {skill}
          </Badge>
        ))}
      </div>

      <div className="relative z-10 flex flex-wrap gap-1.5">
        {job.verifiedEmployer && (
          <Badge tone="blue" icon={<ShieldCheck size={12} aria-hidden="true" />}>
            {t.badges.verifiedEmployer}
          </Badge>
        )}
        {job.remote && (
          <Badge tone="green" icon={<Home size={12} aria-hidden="true" />}>
            {t.badges.remote}
          </Badge>
        )}
        {job.noCv && (
          <Badge tone="neutral" icon={<FileX2 size={12} aria-hidden="true" />}>
            {t.badges.noCv}
          </Badge>
        )}
        {job.respondsFast && (
          <Badge tone="neutral" icon={<Clock3 size={12} aria-hidden="true" />}>
            {t.badges.respondsFast}
          </Badge>
        )}
      </div>

      <div className="relative z-10 mt-auto flex items-center justify-between gap-3 border-t border-border pt-4">
        <span className="text-xs text-muted">{formatDate(job.publishedAt)}</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSave}
            aria-pressed={saved}
            aria-label={saved ? t.common.saved : t.common.save}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl border transition-colors duration-200",
              saved ? "border-brand bg-brand-light text-brand" : "border-border text-muted hover:border-brand hover:text-brand"
            )}
          >
            <Bookmark size={17} fill={saved ? "currentColor" : "none"} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-blue-700"
          >
            {t.common.apply}
          </button>
        </div>
      </div>
    </article>
  );
}
