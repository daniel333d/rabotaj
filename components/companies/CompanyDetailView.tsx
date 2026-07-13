"use client";

import Link from "next/link";
import { ShieldCheck, Clock3, Heart, Eye, MapPin, Users, CalendarRange } from "lucide-react";
import type { Company } from "@/lib/data/companies";
import { jobs } from "@/lib/data/jobs";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { Badge } from "@/components/ui/Badge";
import { JobCard } from "@/components/jobs/JobCard";
import { useI18n } from "@/lib/i18n/context";

export function CompanyDetailView({ company }: { company: Company }) {
  const { t } = useI18n();
  const companyJobs = jobs.filter((job) => job.companySlug === company.slug);

  return (
    <div className="bg-surface pb-16">
      <div
        className="h-40 w-full sm:h-56"
        style={{ background: `linear-gradient(135deg, ${company.color} 0%, #0B1220 140%)` }}
        aria-hidden="true"
      />

      <div className="container-page">
        <div className="-mt-16 flex flex-col gap-6 rounded-2xl border border-border bg-white p-6 shadow-elevated sm:-mt-20 sm:flex-row sm:items-end sm:justify-between sm:p-8">
          <div className="flex items-end gap-4">
            <CompanyLogo initials={company.initials} color={company.color} size={80} className="ring-4 ring-white" />
            <div>
              <h1 className="font-heading text-2xl font-extrabold text-ink sm:text-3xl">{company.name}</h1>
              <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-muted">
                <MapPin size={14} aria-hidden="true" />
                {company.industry} · {company.city}, {company.country}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {company.verified && (
              <Badge tone="blue" icon={<ShieldCheck size={12} aria-hidden="true" />}>
                {t.verifiedEmployers.badge1}
              </Badge>
            )}
            {company.salaryDisclosed && <Badge tone="green">{t.verifiedEmployers.badge2}</Badge>}
            {company.respondsFast && (
              <Badge tone="neutral" icon={<Clock3 size={12} aria-hidden="true" />}>
                {t.verifiedEmployers.badge3}
              </Badge>
            )}
            {company.foreignerFriendly && (
              <Badge tone="neutral" icon={<Heart size={12} aria-hidden="true" />}>
                {t.verifiedEmployers.badge4}
              </Badge>
            )}
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
          <div>
            <h2 className="font-heading text-lg font-bold text-ink">O firmie</h2>
            <p className="mt-3 text-sm leading-7 text-ink/80">{company.description}</p>

            <h2 className="mt-10 font-heading text-lg font-bold text-ink">
              Aktualne oferty ({companyJobs.length})
            </h2>
            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              {companyJobs.map((job) => (
                <JobCard key={job.slug} job={job} />
              ))}
            </div>
          </div>

          <aside className="flex flex-col gap-4 rounded-2xl border border-border bg-white p-6 shadow-soft">
            <InfoRow icon={Users} label="Wielkość firmy" value={company.size} />
            <InfoRow icon={CalendarRange} label="Rok założenia" value={String(company.founded)} />
            <InfoRow icon={Eye} label={t.companies.openJobs} value={String(company.openJobs)} />
            <InfoRow icon={Clock3} label={t.companies.responseTime} value={company.responseTime} />
            <Link
              href="/jobs"
              className="mt-2 inline-flex items-center justify-center rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white transition-colors duration-200 hover:bg-blue-700"
            >
              {t.common.seeAll} {t.nav.jobs.toLowerCase()}
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border pb-3.5 text-sm last:border-none last:pb-0">
      <span className="inline-flex items-center gap-2 text-muted">
        <Icon size={15} aria-hidden="true" />
        {label}
      </span>
      <span className="font-semibold text-ink">{value}</span>
    </div>
  );
}
