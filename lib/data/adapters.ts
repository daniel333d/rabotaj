import type { Job, ContractType as UiContractType, ExperienceLevel as UiExperienceLevel } from "@/lib/data/jobs";
import type { Company as UiCompany } from "@/lib/data/companies";
import type { Database } from "@/lib/supabase/database.types";

type JobRow = Database["public"]["Tables"]["jobs"]["Row"];
type CompanyRow = Database["public"]["Tables"]["companies"]["Row"];

const CONTRACT_TYPE_LABEL: Record<JobRow["contract_type"], UiContractType> = {
  employment: "Umowa o pracę",
  b2b: "B2B",
  mandate: "Umowa zlecenie",
  temporary: "Praca tymczasowa"
};

const EXPERIENCE_LABEL: Record<JobRow["experience_level"], UiExperienceLevel> = {
  no_experience: "Bez doświadczenia",
  junior: "Junior",
  mid: "Mid",
  senior: "Senior"
};

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "??";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

const PALETTE = ["#2563EB", "#16A36A", "#0B1220", "#667085", "#7C3AED", "#0891B2"];

function colorFromSlug(slug: string): string {
  let hash = 0;
  for (let i = 0; i < slug.length; i += 1) hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  return PALETTE[hash % PALETTE.length];
}

/** Maps a DB company row to the shape existing UI components (CompanyCard, CompanyDetailView) expect. */
export function dbCompanyToUiCompany(
  company: CompanyRow,
  stats?: { openJobs?: number }
): UiCompany {
  return {
    slug: company.slug,
    name: company.name,
    initials: initialsFromName(company.name),
    color: colorFromSlug(company.slug),
    industry: company.industry ?? "",
    country: company.country ?? "",
    city: company.city ?? "",
    openJobs: stats?.openJobs ?? 0,
    responseTime: company.average_response_days ? `${Math.round(company.average_response_days)} dni` : "—",
    verified: company.verified,
    salaryDisclosed: true,
    respondsFast: Boolean(company.average_response_days && company.average_response_days <= 2),
    foreignerFriendly: true,
    description: company.description ?? "",
    size: company.employee_count ?? "—",
    founded: company.founded_year ?? new Date().getFullYear()
  };
}

/**
 * Maps a DB job row (+ its company + skill names) to the exact `Job` shape
 * the existing UI (JobCard, JobDetailView, RabotajScore, filters.ts) already
 * renders — so none of that code needs to change to become DB-backed.
 */
export function dbJobToUiJob(job: JobRow, company: CompanyRow, skills: string[] = []): Job {
  const salaryDisclosed = Boolean(job.salary_min && job.salary_max);

  return {
    slug: job.slug,
    title: job.title,
    companySlug: company.slug,
    city: job.city,
    country: job.country,
    workModel: job.work_mode,
    contractType: CONTRACT_TYPE_LABEL[job.contract_type],
    experience: EXPERIENCE_LABEL[job.experience_level],
    industry: company.industry ?? "",
    language: job.work_language ?? "",
    salaryMin: job.salary_min ?? 0,
    salaryMax: job.salary_max ?? 0,
    currency: job.salary_currency,
    skills,
    publishedAt: (job.published_at ?? job.created_at).slice(0, 10),
    // Real candidate-job matching isn't in scope for this backend pass —
    // neutral placeholder until a matching algorithm is built.
    matchPercent: 70,
    verifiedEmployer: company.verified,
    salaryDisclosed,
    remote: job.work_mode === "remote",
    noCv: job.no_experience_required,
    respondsFast: Boolean(job.response_time_days && job.response_time_days <= 2),
    accommodation: job.accommodation_provided,
    description: job.description ?? "",
    responsibilities: job.responsibilities,
    requirements: job.requirements,
    niceToHave: job.nice_to_have,
    benefits: job.benefits,
    process: job.recruitment_process,
    expectedResponseTime: job.response_time_days ? `Zwykle w ciągu ${job.response_time_days} dni roboczych` : undefined,
    startDate: job.start_date ?? undefined
  };
}
