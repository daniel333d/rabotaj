import { getAdminJobs } from "@/lib/data/db-admin";
import { AdminJobActions } from "@/components/admin/AdminJobActions";
import { formatDate } from "@/lib/format";

const STATUS_LABEL: Record<string, string> = {
  draft: "Szkic",
  pending_review: "Oczekuje na moderację",
  published: "Opublikowana",
  paused: "Wstrzymana",
  rejected: "Odrzucona",
  expired: "Wygasła",
  archived: "Zarchiwizowana"
};

export default async function AdminJobsPage() {
  const jobs = await getAdminJobs();
  if (!jobs) return <p className="text-sm text-muted">Brak dostępu.</p>;

  return (
    <div>
      <h1 className="font-heading text-2xl font-extrabold text-ink sm:text-3xl">Moderacja ofert</h1>
      {jobs.length === 0 ? (
        <p className="mt-8 text-sm text-muted">Brak ofert w systemie.</p>
      ) : (
        <div className="mt-8 flex flex-col gap-3">
          {jobs.map((job) => (
            <div key={job.id} className="flex flex-col gap-3 rounded-2xl border border-border bg-white p-5 shadow-soft sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold text-ink">{job.title}</p>
                <p className="text-xs text-muted">
                  {job.companies?.name ?? "—"} · {job.city}, {job.country} · {formatDate(job.created_at)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-surface px-3 py-1.5 text-xs font-bold text-muted">{STATUS_LABEL[job.status]}</span>
                <AdminJobActions jobId={job.id} status={job.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
