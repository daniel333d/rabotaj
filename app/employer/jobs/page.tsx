import Link from "next/link";
import { getSessionProfile } from "@/lib/auth/session";
import { getEmployerCompany, getEmployerJobs } from "@/lib/data/db-employer";
import { JobRowActions } from "@/components/employer/JobRowActions";

const STATUS_LABEL: Record<string, string> = {
  draft: "Szkic",
  pending_review: "Oczekuje na moderację",
  published: "Opublikowana",
  paused: "Wstrzymana",
  rejected: "Odrzucona",
  expired: "Wygasła",
  archived: "Zarchiwizowana"
};

const STATUS_TONE: Record<string, string> = {
  draft: "bg-surface text-muted border border-border",
  pending_review: "bg-amber-50 text-amber-700",
  published: "bg-green-50 text-success",
  paused: "bg-surface text-muted border border-border",
  rejected: "bg-red-50 text-red-600",
  expired: "bg-surface text-muted border border-border",
  archived: "bg-surface text-muted border border-border"
};

export default async function EmployerJobsPage() {
  const profile = await getSessionProfile();
  if (!profile) return null;

  const company = await getEmployerCompany(profile.id);
  if (!company) {
    return <p className="text-sm text-muted">Utwórz najpierw profil firmy.</p>;
  }

  const jobs = await getEmployerJobs(company.id);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-extrabold text-ink sm:text-3xl">Twoje oferty</h1>
        <Link
          href="/employer/jobs/new"
          className="inline-flex items-center justify-center rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white transition-colors duration-200 hover:bg-blue-700"
        >
          + Dodaj ogłoszenie
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-border bg-white p-14 text-center text-sm text-muted">
          Nie masz jeszcze żadnych ofert.
        </div>
      ) : (
        <div className="mt-8 flex flex-col gap-3">
          {jobs.map((job) => (
            <div key={job.id} className="flex flex-col gap-3 rounded-2xl border border-border bg-white p-5 shadow-soft sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold text-ink">{job.title}</p>
                <p className="text-xs text-muted">
                  {job.city}, {job.country}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${STATUS_TONE[job.status]}`}>
                  {STATUS_LABEL[job.status]}
                </span>
                <Link href={`/employer/jobs/${job.id}/applications`} className="rounded-xl border border-border px-3 py-1.5 text-xs font-semibold text-ink transition-colors duration-150 hover:border-brand hover:text-brand">
                  Aplikacje
                </Link>
                <Link href={`/employer/jobs/${job.id}/edit`} className="rounded-xl border border-border px-3 py-1.5 text-xs font-semibold text-ink transition-colors duration-150 hover:border-brand hover:text-brand">
                  Edytuj
                </Link>
                <JobRowActions jobId={job.id} status={job.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
