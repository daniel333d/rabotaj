import "server-only";
import { createClient } from "@/lib/supabase/server";
import { dbCompanyToUiCompany, dbJobToUiJob } from "@/lib/data/adapters";
import type { Job } from "@/lib/data/jobs";
import type { Company } from "@/lib/data/companies";

/**
 * All fetchers return `null` (not an empty array) when Supabase isn't
 * configured or the query fails, so pages can distinguish
 * "no data yet" from "backend unavailable" and render the right state.
 */

export async function getPublishedJobs(): Promise<Job[] | null> {
  const supabase = await createClient();
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
}

export async function getPublishedJobBySlug(slug: string): Promise<Job | null> {
  const supabase = await createClient();
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

export async function getCompanyBySlugFromDb(slug: string): Promise<Company | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data: company, error } = await supabase.from("companies").select("*").eq("slug", slug).maybeSingle();
  if (error || !company) return null;

  const { count } = await supabase
    .from("jobs")
    .select("id", { count: "exact", head: true })
    .eq("company_id", company.id)
    .eq("status", "published");

  return dbCompanyToUiCompany(company, { openJobs: count ?? 0 });
}

export async function getAllCompaniesFromDb(): Promise<Company[] | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data, error } = await supabase.from("companies").select("*, jobs(id, status)");
  if (error || !data) return null;

  return data.map((company) =>
    dbCompanyToUiCompany(company, {
      openJobs: company.jobs.filter((j) => j.status === "published").length
    })
  );
}

/** Fire-and-forget page-view logging — never blocks or breaks rendering. */
export async function recordJobView(jobId: string, userId: string | null) {
  const supabase = await createClient();
  if (!supabase) return;
  await supabase.from("job_views").insert({ job_id: jobId, user_id: userId });
}
