import { redirect } from "next/navigation";
import { getSessionProfile } from "@/lib/auth/session";
import { getEmployerCompany } from "@/lib/data/db-employer";
import { JobWizard } from "@/components/employer/JobWizard";

export default async function NewJobPage() {
  const profile = await getSessionProfile();
  if (!profile) return null;

  const company = await getEmployerCompany(profile.id);
  if (!company) redirect("/employer/company");

  return (
    <div>
      <h1 className="font-heading text-2xl font-extrabold text-ink sm:text-3xl">Dodaj ogłoszenie</h1>
      <div className="mt-8">
        <JobWizard mode="create" />
      </div>
    </div>
  );
}
