"use client";

import { useI18n } from "@/lib/i18n/context";
import { companies } from "@/lib/data/companies";
import { CompanyCard } from "@/components/companies/CompanyCard";
import { SectionHeading } from "@/components/home/SectionHeading";
import { Button } from "@/components/ui/Button";

export function FeaturedCompanies() {
  const { t } = useI18n();

  return (
    <section className="bg-surface">
      <div className="container-page py-16 sm:py-20">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading kicker={t.companies.kicker} title={t.companies.title} />
          <Button href="/companies" variant="outline" className="hidden shrink-0 sm:inline-flex">
            {t.common.seeAll}
          </Button>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {companies.slice(0, 4).map((company) => (
            <CompanyCard key={company.slug} company={company} />
          ))}
        </div>
      </div>
    </section>
  );
}
