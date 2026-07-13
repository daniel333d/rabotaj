"use client";

import Link from "next/link";
import {
  MapPin,
  Briefcase,
  Wallet,
  FileText,
  ShieldCheck,
  Clock3,
  CalendarDays,
  Building2
} from "lucide-react";
import type { Job } from "@/lib/data/jobs";
import { getCompanyBySlug } from "@/lib/data/companies";
import { getSimilarJobs } from "@/lib/data/jobs";
import { formatSalary, formatDate, workModelLabel } from "@/lib/format";
import { useI18n } from "@/lib/i18n/context";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { Badge } from "@/components/ui/Badge";
import { JobCard } from "@/components/jobs/JobCard";
import { ApplyButton } from "@/components/jobs/ApplyButton";
import { SaveButton } from "@/components/jobs/SaveButton";

export function JobDetailView({ job }: { job: Job }) {
  const { t } = useI18n();
  const company = getCompanyBySlug(job.companySlug);
  const similar = getSimilarJobs(job);

  if (!company) return null;

  return (
    <div className="bg-surface pb-28 lg:pb-16">
      <div className="border-b border-border bg-white">
        <div className="container-page py-10 sm:py-12">
          <nav className="text-xs text-muted" aria-label="Ścieżka nawigacji">
            <Link href="/jobs" className="hover:text-brand">
              {t.nav.jobs}
            </Link>{" "}
            / <span className="text-ink">{job.title}</span>
          </nav>

          <div className="mt-5 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <CompanyLogo initials={company.initials} color={company.color} size={56} />
              <div>
                <h1 className="font-heading text-2xl font-extrabold leading-tight text-ink sm:text-3xl">{job.title}</h1>
                <Link href={`/companies/${company.slug}`} className="mt-1.5 inline-block text-sm font-semibold text-muted hover:text-brand">
                  {company.name}
                </Link>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={15} aria-hidden="true" /> {job.city}, {job.country}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Briefcase size={15} aria-hidden="true" /> {workModelLabel(job.workModel)}
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-bold text-ink">
                    <Wallet size={15} className="text-success" aria-hidden="true" /> {formatSalary(job)} {t.common.gross}
                  </span>
                </div>
              </div>
            </div>

            <div className="hidden shrink-0 gap-3 sm:flex">
              <SaveButton slug={job.slug} />
              <ApplyButton />
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-1.5">
            {job.verifiedEmployer && (
              <Badge tone="blue" icon={<ShieldCheck size={12} aria-hidden="true" />}>
                {t.badges.verifiedEmployer}
              </Badge>
            )}
            {job.remote && <Badge tone="green">{t.badges.remote}</Badge>}
            {job.noCv && <Badge tone="neutral">{t.badges.noCv}</Badge>}
            {job.respondsFast && (
              <Badge tone="neutral" icon={<Clock3 size={12} aria-hidden="true" />}>
                {t.badges.respondsFast}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="container-page mt-10 grid gap-10 lg:grid-cols-[1fr_340px]">
        <div className="flex flex-col gap-10">
          <DetailSection title={t.jobDetail.aboutRole}>
            <p className="text-sm leading-7 text-ink/80">{job.description}</p>
          </DetailSection>

          <DetailSection title={t.jobDetail.responsibilities}>
            <ul className="flex flex-col gap-2.5">
              {job.responsibilities.map((item) => (
                <ListItem key={item}>{item}</ListItem>
              ))}
            </ul>
          </DetailSection>

          <DetailSection title={t.jobDetail.requirements}>
            <ul className="flex flex-col gap-2.5">
              {job.requirements.map((item) => (
                <ListItem key={item}>{item}</ListItem>
              ))}
            </ul>
          </DetailSection>

          <DetailSection title={t.jobDetail.benefits}>
            <ul className="grid gap-2.5 sm:grid-cols-2">
              {job.benefits.map((item) => (
                <ListItem key={item}>{item}</ListItem>
              ))}
            </ul>
          </DetailSection>

          <DetailSection title={t.jobDetail.process}>
            <ol className="flex flex-col gap-3">
              {job.process.map((step, index) => (
                <li key={step} className="flex items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-light text-xs font-bold text-brand">
                    {index + 1}
                  </span>
                  <span className="pt-0.5 text-sm text-ink/80">{step}</span>
                </li>
              ))}
            </ol>
          </DetailSection>

          {similar.length > 0 && (
            <DetailSection title={t.jobDetail.similarJobs}>
              <div className="grid gap-5 sm:grid-cols-2">
                {similar.map((similarJob) => (
                  <JobCard key={similarJob.slug} job={similarJob} />
                ))}
              </div>
            </DetailSection>
          )}
        </div>

        <aside className="flex flex-col gap-6">
          <div className="rounded-2xl border border-border bg-white p-6 shadow-soft">
            <h2 className="font-heading text-sm font-bold text-ink">Szczegóły oferty</h2>
            <dl className="mt-4 flex flex-col gap-3.5 text-sm">
              <InfoRow icon={FileText} label={t.jobDetail.contractType} value={job.contractType} />
              <InfoRow icon={Briefcase} label={t.jobDetail.workModel} value={workModelLabel(job.workModel)} />
              <InfoRow icon={MapPin} label={t.jobDetail.location} value={`${job.city}, ${job.country}`} />
              <InfoRow icon={Wallet} label={t.jobDetail.salaryLabel} value={`${formatSalary(job)} ${t.common.gross}`} />
              <InfoRow icon={CalendarDays} label={t.jobDetail.published} value={formatDate(job.publishedAt)} />
            </dl>
          </div>

          <div className="rounded-2xl border border-border bg-white p-6 shadow-soft">
            <h2 className="font-heading text-sm font-bold text-ink">{t.jobDetail.aboutCompany}</h2>
            <div className="mt-4 flex items-center gap-3">
              <CompanyLogo initials={company.initials} color={company.color} size={44} />
              <div>
                <p className="text-sm font-bold text-ink">{company.name}</p>
                <p className="text-xs text-muted">{company.industry}</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-ink/70">{company.description}</p>
            <Link
              href={`/companies/${company.slug}`}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-brand"
            >
              <Building2 size={15} aria-hidden="true" />
              {t.common.seeCompany}
            </Link>
          </div>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-white/95 p-4 backdrop-blur-sm lg:hidden">
        <div className="flex items-center gap-3">
          <SaveButton slug={job.slug} className="flex-1" />
          <ApplyButton full className="flex-[2]" />
        </div>
      </div>
    </div>
  );
}

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-heading text-lg font-bold text-ink">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function ListItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5 text-sm leading-6 text-ink/80">
      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" aria-hidden="true" />
      {children}
    </li>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border pb-3 last:border-none last:pb-0">
      <dt className="inline-flex items-center gap-2 text-muted">
        <Icon size={15} aria-hidden="true" />
        {label}
      </dt>
      <dd className="text-right font-semibold text-ink">{value}</dd>
    </div>
  );
}
