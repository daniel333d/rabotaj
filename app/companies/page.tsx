import type { Metadata } from "next";
import { companies as staticCompanies } from "@/lib/data/companies";
import { getAllCompaniesFromDb } from "@/lib/data/db-jobs";
import { CompanyCard } from "@/components/companies/CompanyCard";

export const metadata: Metadata = {
  title: "Firmy — Rabotaj.com",
  description: "Sprawdzeni pracodawcy w Polsce i Europie."
};

export default async function CompaniesPage() {
  const dbCompanies = await getAllCompaniesFromDb();
  const companies = dbCompanies ?? staticCompanies;

  return (
    <div className="bg-surface">
      <div className="container-page py-10 sm:py-14">
        <h1 className="font-heading text-2xl font-extrabold text-ink sm:text-3xl">Sprawdzeni pracodawcy</h1>
        <p className="mt-2 max-w-xl text-sm text-muted">
          Firmy z odznaką Verified Employer, które przeszły weryfikację danych rejestrowych i sposobu zatrudniania.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {companies.map((company) => (
            <CompanyCard key={company.slug} company={company} />
          ))}
        </div>
      </div>
    </div>
  );
}
