import "server-only";
import { unstable_cache } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";
import { dbCompanyToUiCompany, dbJobToUiJob } from "@/lib/data/adapters";
import type { Job } from "@/lib/data/jobs";
import type { Company } from "@/lib/data/companies";

/**
 * All fetchers return `null` (not an empty array) when Supabase isn't
 * configured or the query fails, so pages can distinguish
 * "no data yet" from "backend unavailable" and render the right state.
 *
 * The public-read fetchers below (published jobs/companies) are wrapped in
 * `unstable_cache` so pages don't hit Supabase on every request — they use
 * `createPublicClient` (no cookies) since `unstable_cache` forbids
 * request-scoped dynamic APIs. Admin actions that change this data call
 * `revalidateTag` to invalidate it immediately (see lib/actions/admin.ts).
 */

const getPublishedJobsCached = unstable_cache(
  async (): Promise<Job[] | null> => {
    const supabase = createPublicClient();
    if (!supabase) return null;

    const { data, error } = await supabase
      .from("jobs")
      .select("*, companies(*), job_skills(skill_name)")
      .eq("status", "published")
      .order("published_at", { ascending: false });

    if (error || !data) return null;

    return data
      .filter((row): row is typeof row & { companies: NonNullable<typeof row.companies> } => Boolean(row.companies))
      .map((row) =>
        dbJobToUiJob(
          row,
          row.companies,
          row.job_skills.map((s) => s.skill_name)
        )
      );
  },
  ["published-jobs"],
  { revalidate: 60, tags: ["jobs"] }
);

export async function getPublishedJobs(): Promise<Job[] | null> {
  return getPublishedJobsCached();
}

const getPublishedJobBySlugCached = unstable_cache(
  async (slug: string): Promise<Job | null> => {
    const supabase = createPublicClient();
    if (!supabase) return null;

    const { data, error } = await supabase
      .from("jobs")
      .select("*, companies(*), job_skills(skill_name)")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    if (error || !data || !data.companies) return null;

    return dbJobToUiJob(
      data,
      data.companies,
      data.job_skills.map((s) => s.skill_name)
    );
  },
  ["published-job-by-slug"],
  { revalidate: 60, tags: ["jobs"] }
);

export async function getPublishedJobBySlug(slug: string): Promise<Job | null> {
  return getPublishedJobBySlugCached(slug);
}

/** The raw DB id for a published job, needed by apply/save actions (which key on job.id, not slug). */
export async function getPublishedJobIdBySlug(slug: string): Promise<string | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data } = await supabase.from("jobs").select("id").eq("slug", slug).eq("status", "published").maybeSingle();
  return data?.id ?? null;
}

export async function getSimilarPublishedJobs(job: Job, limit = 3): Promise<Job[]> {
  const all = await getPublishedJobs();
  if (!all) return [];
  return all
    .filter((candidate) => candidate.slug !== job.slug && (candidate.industry === job.industry || candidate.country === job.country))
    .slice(0, limit);
}

const getCompanyBySlugFromDbCached = unstable_cache(
  async (slug: string): Promise<Company | null> => {
    const supabase = createPublicClient();
    if (!supabase) return null;

    const { data: company, error } = await supabase.from("companies").select("*").eq("slug", slug).maybeSingle();
    if (error || !company) return null;

    const { count } = await supabase
      .from("jobs")
      .select("id", { count: "exact", head: true })
      .eq("company_id", company.id)
      .eq("status", "published");

    return dbCompanyToUiCompany(company, { openJobs: count ?? 0 });
  },
  ["company-by-slug"],
  { revalidate: 60, tags: ["companies", "jobs"] }
);

export async function getCompanyBySlugFromDb(slug: string): Promise<Company | null> {
  return getCompanyBySlugFromDbCached(slug);
}

const getAllCompaniesFromDbCached = unstable_cache(
  async (): Promise<Company[] | null> => {
    const supabase = createPublicClient();
    if (!supabase) return null;

    const { data, error } = await supabase.from("companies").select("*, jobs(id, status)");
    if (error || !data) return null;

    return data.map((company) =>
      dbCompanyToUiCompany(company, {
        openJobs: company.jobs.filter((j) => j.status === "published").length
      })
    );
  },
  ["all-companies"],
  { revalidate: 60, tags: ["companies"] }
);

export async function getAllCompaniesFromDb(): Promise<Company[] | null> {
  return getAllCompaniesFromDbCached();
}

/** Fire-and-forget page-view logging — never blocks or breaks rendering. */
export async function recordJobView(jobId: string, userId: string | null) {
  const supabase = await createClient();
  if (!supabase) return;
  await supabase.from("job_views").insert({ job_id: jobId, user_id: userId });
}
