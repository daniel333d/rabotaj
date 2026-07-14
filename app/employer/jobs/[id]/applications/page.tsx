import { notFound } from "next/navigation";
import { getSessionProfile } from "@/lib/auth/session";
import { getEmployerCompany, getEmployerJobById, getJobApplications } from "@/lib/data/db-employer";
import { ApplicationStatusControl } from "@/components/employer/ApplicationStatusControl";
import { formatDate } from "@/lib/format";

export default async function JobApplicationsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profile = await getSessionProfile();
  if (!profile) return null;

  const company = await getEmployerCompany(profile.id);
  if (!company) notFound();

  const job = await getEmployerJobById(id, company.id);
  if (!job) notFound();

  const applications = await getJobApplications(id, company.id);

  return (
    <div>
      <h1 className="font-heading text-2xl font-extrabold text-ink sm:text-3xl">Aplikacje — {job.title}</h1>

      {!applications || applications.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-border bg-white p-14 text-center text-sm text-muted">
          Brak aplikacji do tej oferty.
        </div>
      ) : (
        <div className="mt-8 flex flex-col gap-3">
          {applications.map((application) => (
            <div key={application.id} className="flex flex-col gap-3 rounded-2xl border border-border bg-white p-5 shadow-soft sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold text-ink">{application.candidateName || application.candidateEmail}</p>
                <p className="text-xs text-muted">
                  {formatDate(application.created_at)}
                  {application.message ? ` · ${application.message.slice(0, 80)}` : ""}
                </p>
              </div>
              <ApplicationStatusControl applicationId={application.id} status={application.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
