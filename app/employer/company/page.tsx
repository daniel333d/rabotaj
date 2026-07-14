import { getSessionProfile } from "@/lib/auth/session";
import { getEmployerCompany } from "@/lib/data/db-employer";
import { CompanyForm } from "@/components/employer/CompanyForm";

export default async function EmployerCompanyPage() {
  const profile = await getSessionProfile();
  if (!profile) return null;

  const company = await getEmployerCompany(profile.id);

  return (
    <div>
      <h1 className="font-heading text-2xl font-extrabold text-ink sm:text-3xl">
        {company ? "Profil firmy" : "Utwórz profil firmy"}
      </h1>
      <p className="mt-2 max-w-xl text-sm text-muted">
        Te dane są widoczne publicznie na Twojej stronie firmowej i przy każdej opublikowanej ofercie.
      </p>
      <div className="mt-8 max-w-xl">
        <CompanyForm company={company} />
      </div>
    </div>
  );
}
