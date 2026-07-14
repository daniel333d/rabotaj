import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

export type EmployerCompany = Database["public"]["Tables"]["companies"]["Row"];
export type EmployerJob = Database["public"]["Tables"]["jobs"]["Row"] & { job_skills: { skill_name: string }[] };

export async function getEmployerCompany(userId: string): Promise<EmployerCompany | null> {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data } = await supabase.from("companies").select("*").eq("owner_user_id", userId).maybeSingle();
  return data;
}

export async function getEmployerJobs(companyId: string): Promise<EmployerJob[]> {
  const supabase = await createClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("jobs")
    .select("*, job_skills(skill_name)")
    .eq("company_id", companyId)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getEmployerJobById(jobId: string, companyId: string): Promise<EmployerJob | null> {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data } = await supabase
    .from("jobs")
    .select("*, job_skills(skill_name)")
    .eq("id", jobId)
    .eq("company_id", companyId)
    .maybeSingle();
  return data;
}

export type ApplicationForEmployer = Database["public"]["Tables"]["applications"]["Row"] & {
  candidateName: string | null;
  candidateEmail: string;
};

export async function getJobApplications(jobId: string, companyId: string): Promise<ApplicationForEmployer[] | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data: job } = await supabase.from("jobs").select("id").eq("id", jobId).eq("company_id", companyId).maybeSingle();
  if (!job) return null;

  const { data } = await supabase
    .from("applications")
    .select("*, profiles!applications_candidate_user_id_fkey(first_name, last_name, email)")
    .eq("job_id", jobId)
    .order("created_at", { ascending: false });

  return (data ?? []).map((row) => {
    const { profiles, ...application } = row;
    return {
      ...application,
      candidateName: profiles ? [profiles.first_name, profiles.last_name].filter(Boolean).join(" ") || null : null,
      candidateEmail: profiles?.email ?? ""
    };
  });
}

export async function getEmployerStats(companyId: string) {
  const supabase = await createClient();
  if (!supabase) return { published: 0, pendingReview: 0, draft: 0, totalApplications: 0 };

  const [{ data: jobs }, { count: totalApplications }] = await Promise.all([
    supabase.from("jobs").select("id, status").eq("company_id", companyId),
    supabase
      .from("applications")
      .select("id, jobs!inner(company_id)", { count: "exact", head: true })
      .eq("jobs.company_id", companyId)
  ]);

  const list = jobs ?? [];
  return {
    published: list.filter((j) => j.status === "published").length,
    pendingReview: list.filter((j) => j.status === "pending_review").length,
    draft: list.filter((j) => j.status === "draft").length,
    totalApplications: totalApplications ?? 0
  };
}
