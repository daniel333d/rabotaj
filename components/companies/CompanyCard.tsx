import Link from "next/link";
import { ShieldCheck, Clock3, ArrowRight } from "lucide-react";
import type { Company } from "@/lib/data/companies";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { Badge } from "@/components/ui/Badge";

export function CompanyCard({ company }: { company: Company }) {
  return (
    <Link
      href={`/companies/${company.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-elevated"
    >
      <div
        className="h-24 w-full"
        style={{
          background: `linear-gradient(135deg, ${company.color} 0%, #0B1220 140%)`
        }}
        aria-hidden="true"
      />
      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="-mt-14 flex items-end justify-between">
          <CompanyLogo initials={company.initials} color={company.color} size={56} className="ring-4 ring-white" />
          {company.verified && (
            <Badge tone="blue" icon={<ShieldCheck size={12} aria-hidden="true" />}>
              Verified
            </Badge>
          )}
        </div>
        <div>
          <h3 className="font-heading text-lg font-bold text-ink group-hover:text-brand">{company.name}</h3>
          <p className="mt-0.5 text-sm text-muted">
            {company.industry} · {company.city}, {company.country}
          </p>
        </div>
        <div className="mt-1 flex items-center justify-between text-sm text-muted">
          <span className="font-semibold text-ink">{company.openJobs} ofert</span>
          <span className="inline-flex items-center gap-1">
            <Clock3 size={14} aria-hidden="true" />
            {company.responseTime}
          </span>
        </div>
        <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-brand">
          Zobacz firmę
          <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
