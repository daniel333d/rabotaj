import { getAdminCompanies } from "@/lib/data/db-admin";
import { AdminCompanyActions } from "@/components/admin/AdminCompanyActions";

export default async function AdminCompaniesPage() {
  const companies = await getAdminCompanies();
  if (!companies) return <p className="text-sm text-muted">Brak dostępu.</p>;

  return (
    <div>
      <h1 className="font-heading text-2xl font-extrabold text-ink sm:text-3xl">Firmy</h1>
      {companies.length === 0 ? (
        <p className="mt-8 text-sm text-muted">Brak firm w systemie.</p>
      ) : (
        <div className="mt-8 flex flex-col gap-3">
          {companies.map((company) => (
            <div key={company.id} className="flex flex-col gap-3 rounded-2xl border border-border bg-white p-5 shadow-soft sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold text-ink">{company.name}</p>
                <p className="text-xs text-muted">
                  {company.industry ?? "—"} · {company.city ?? "—"}, {company.country ?? "—"}
                </p>
              </div>
              <AdminCompanyActions companyId={company.id} verified={company.verified} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
