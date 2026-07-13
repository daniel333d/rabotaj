"use client";

import { useState } from "react";
import { FileText, Eye, CalendarCheck, Gauge, ChevronRight, RotateCw } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { useToast } from "@/lib/toast-context";
import { jobs } from "@/lib/data/jobs";
import { getCompanyBySlug } from "@/lib/data/companies";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { JobCard } from "@/components/jobs/JobCard";

type Application = {
  jobSlug: string;
  statusIndex: number;
};

export default function DashboardPage() {
  const { t } = useI18n();
  const { showToast } = useToast();

  const [applications, setApplications] = useState<Application[]>([
    { jobSlug: jobs[0].slug, statusIndex: 3 },
    { jobSlug: jobs[4].slug, statusIndex: 2 },
    { jobSlug: jobs[5].slug, statusIndex: 1 },
    { jobSlug: jobs[8].slug, statusIndex: 0 }
  ]);

  const stats = [
    { icon: Gauge, label: t.dashboard.newMatches, value: "6" },
    { icon: FileText, label: t.dashboard.activeApplications, value: String(applications.length) },
    { icon: Eye, label: t.dashboard.profileViews, value: "24" },
    { icon: CalendarCheck, label: t.dashboard.interviews, value: "2" }
  ];

  function advanceStatus(jobSlug: string) {
    setApplications((prev) =>
      prev.map((app) =>
        app.jobSlug === jobSlug
          ? { ...app, statusIndex: Math.min(app.statusIndex + 1, t.applicationStatus.steps.length - 1) }
          : app
      )
    );
    showToast(t.toast.statusUpdated);
  }

  const recommended = jobs.slice(9, 12);

  return (
    <div className="bg-surface">
      <div className="container-page py-10 sm:py-14">
        <h1 className="font-heading text-2xl font-extrabold text-ink sm:text-3xl">
          {t.dashboard.welcome}, Anna
        </h1>
        <p className="mt-1.5 text-sm text-muted">Oto podsumowanie Twojej aktywności na Rabotaj.</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-border bg-white p-5 shadow-soft">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-light text-brand">
                <stat.icon size={18} aria-hidden="true" />
              </span>
              <p className="mt-3 font-heading text-2xl font-extrabold text-ink">{stat.value}</p>
              <p className="text-xs text-muted">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-border bg-white p-6 shadow-soft">
          <div className="flex items-center justify-between text-sm font-semibold text-ink">
            <span>{t.dashboard.passportCompleteness}</span>
            <span className="text-success">85%</span>
          </div>
          <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-border">
            <div className="h-full w-[85%] rounded-full bg-success" />
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <h2 className="font-heading text-lg font-bold text-ink">{t.dashboard.myApplications}</h2>
            <div className="mt-4 flex flex-col gap-3">
              {applications.map((application) => {
                const job = jobs.find((item) => item.slug === application.jobSlug);
                const company = job ? getCompanyBySlug(job.companySlug) : undefined;
                if (!job || !company) return null;
                const status = t.applicationStatus.steps[application.statusIndex];
                const isFinal = application.statusIndex === t.applicationStatus.steps.length - 1;

                return (
                  <div key={job.slug} className="flex flex-col gap-3 rounded-2xl border border-border bg-white p-5 shadow-soft sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <CompanyLogo initials={company.initials} color={company.color} size={40} />
                      <div>
                        <p className="text-sm font-bold text-ink">{job.title}</p>
                        <p className="text-xs text-muted">{company.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-light px-3 py-1.5 text-xs font-bold text-brand">
                        {status}
                        <ChevronRight size={12} aria-hidden="true" />
                      </span>
                      {!isFinal && (
                        <button
                          type="button"
                          onClick={() => advanceStatus(job.slug)}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-1.5 text-xs font-semibold text-ink transition-colors duration-150 hover:border-brand hover:text-brand"
                        >
                          <RotateCw size={12} aria-hidden="true" />
                          Symuluj postęp
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h2 className="font-heading text-lg font-bold text-ink">{t.dashboard.recommended}</h2>
            <div className="mt-4 flex flex-col gap-5">
              {recommended.map((job) => (
                <JobCard key={job.slug} job={job} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
