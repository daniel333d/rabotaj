"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { companySchema } from "@/lib/validation/company";
import { jobSchema } from "@/lib/validation/job";
import { employerApplicationStatusSchema } from "@/lib/validation/application";
import type { ActionState } from "@/lib/actions/auth";
import type { JobStatus } from "@/lib/supabase/database.types";

async function requireEmployer() {
  const supabase = await createClient();
  if (!supabase) return { error: "backend-not-configured" as const };

  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return { error: "login-required" as const };

  return { supabase, userId: user.id };
}

function linesToArray(value: FormDataEntryValue | null): string[] {
  return String(value ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export async function upsertCompanyAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await requireEmployer();
  if ("error" in ctx) return { error: ctx.error };

  const parsed = companySchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description") || undefined,
    industry: formData.get("industry") || undefined,
    website: formData.get("website") || undefined,
    country: formData.get("country") || undefined,
    city: formData.get("city") || undefined,
    employeeCount: formData.get("employeeCount") || undefined,
    foundedYear: formData.get("foundedYear") || undefined
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "invalid-input" };

  const { error } = await ctx.supabase.from("companies").upsert(
    {
      owner_user_id: ctx.userId,
      name: parsed.data.name,
      slug: parsed.data.slug,
      description: parsed.data.description || null,
      industry: parsed.data.industry || null,
      website: parsed.data.website || null,
      country: parsed.data.country || null,
      city: parsed.data.city || null,
      employee_count: parsed.data.employeeCount || null,
      founded_year: parsed.data.foundedYear ?? null
    },
    { onConflict: "owner_user_id" }
  );

  if (error) return { error: error.code === "23505" ? "invalid-input" : "generic-error" };

  revalidatePath("/employer/company");
  revalidatePath("/employer/dashboard");
  return { success: true };
}

type JobActionResult = ActionState & { jobId?: string };

async function saveJob(
  ctx: { supabase: NonNullable<Awaited<ReturnType<typeof createClient>>>; userId: string },
  formData: FormData,
  existingJobId: string | null
): Promise<JobActionResult> {
  const parsed = jobSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    country: formData.get("country"),
    city: formData.get("city"),
    workMode: formData.get("workMode"),
    contractType: formData.get("contractType"),
    salaryMin: formData.get("salaryMin") || undefined,
    salaryMax: formData.get("salaryMax") || undefined,
    salaryCurrency: formData.get("salaryCurrency") || "PLN",
    salaryPeriod: formData.get("salaryPeriod") || "month",
    experienceLevel: formData.get("experienceLevel"),
    workLanguage: formData.get("workLanguage") || undefined,
    requirements: linesToArray(formData.get("requirements")),
    niceToHave: linesToArray(formData.get("niceToHave")),
    noExperienceRequired: formData.get("noExperienceRequired") === "on",
    description: formData.get("description"),
    responsibilities: linesToArray(formData.get("responsibilities")),
    benefits: linesToArray(formData.get("benefits")),
    accommodationProvided: formData.get("accommodationProvided") === "on",
    recruitmentProcess: linesToArray(formData.get("recruitmentProcess")),
    responseTimeDays: formData.get("responseTimeDays") || undefined,
    startDate: formData.get("startDate") || undefined
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "invalid-input" };

  const { data: company } = await ctx.supabase.from("companies").select("id").eq("owner_user_id", ctx.userId).maybeSingle();
  if (!company) return { error: "invalid-input" };

  const submitForReview = formData.get("submitForReview") === "on";
  const status: JobStatus = submitForReview ? "pending_review" : "draft";
  const skills = linesToArray(formData.get("skills"));

  const jobRow = {
    company_id: company.id,
    slug: parsed.data.slug,
    title: parsed.data.title,
    description: parsed.data.description,
    responsibilities: parsed.data.responsibilities,
    requirements: parsed.data.requirements,
    nice_to_have: parsed.data.niceToHave,
    benefits: parsed.data.benefits,
    country: parsed.data.country,
    city: parsed.data.city,
    work_mode: parsed.data.workMode,
    contract_type: parsed.data.contractType,
    experience_level: parsed.data.experienceLevel,
    work_language: parsed.data.workLanguage || null,
    salary_min: parsed.data.salaryMin ?? null,
    salary_max: parsed.data.salaryMax ?? null,
    salary_currency: parsed.data.salaryCurrency,
    salary_period: parsed.data.salaryPeriod,
    recruitment_process: parsed.data.recruitmentProcess,
    response_time_days: parsed.data.responseTimeDays ?? null,
    start_date: parsed.data.startDate || null,
    accommodation_provided: parsed.data.accommodationProvided,
    no_experience_required: parsed.data.noExperienceRequired,
    status,
    published_at: null as string | null
  };

  let jobId = existingJobId;

  if (existingJobId) {
    const { error } = await ctx.supabase.from("jobs").update(jobRow).eq("id", existingJobId).eq("company_id", company.id);
    if (error) return { error: error.code === "23505" ? "invalid-input" : "generic-error" };
    await ctx.supabase.from("job_skills").delete().eq("job_id", existingJobId);
  } else {
    const { data: inserted, error } = await ctx.supabase.from("jobs").insert(jobRow).select("id").single();
    if (error || !inserted) return { error: error?.code === "23505" ? "invalid-input" : "generic-error" };
    jobId = inserted.id;
  }

  if (jobId && skills.length > 0) {
    await ctx.supabase.from("job_skills").insert(skills.map((skill_name) => ({ job_id: jobId!, skill_name })));
  }

  revalidatePath("/employer/jobs");
  revalidatePath("/employer/dashboard");
  return { success: true, jobId: jobId ?? undefined };
}

export async function createJobAction(_prevState: JobActionResult, formData: FormData): Promise<JobActionResult> {
  const ctx = await requireEmployer();
  if ("error" in ctx) return { error: ctx.error };
  const result = await saveJob(ctx, formData, null);
  if (result.success && result.jobId) redirect("/employer/jobs");
  return result;
}

export async function updateJobAction(jobId: string, _prevState: JobActionResult, formData: FormData): Promise<JobActionResult> {
  const ctx = await requireEmployer();
  if ("error" in ctx) return { error: ctx.error };
  const result = await saveJob(ctx, formData, jobId);
  if (result.success) redirect("/employer/jobs");
  return result;
}

async function transitionJobStatus(jobId: string, status: Extract<JobStatus, "paused" | "archived" | "pending_review">) {
  const ctx = await requireEmployer();
  if ("error" in ctx) return { ok: false };

  const { data: company } = await ctx.supabase.from("companies").select("id").eq("owner_user_id", ctx.userId).maybeSingle();
  if (!company) return { ok: false };

  const { error } = await ctx.supabase.from("jobs").update({ status }).eq("id", jobId).eq("company_id", company.id);
  revalidatePath("/employer/jobs");
  return { ok: !error };
}

export async function pauseJobAction(jobId: string) {
  return transitionJobStatus(jobId, "paused");
}

export async function archiveJobAction(jobId: string) {
  return transitionJobStatus(jobId, "archived");
}

export async function resubmitJobAction(jobId: string) {
  return transitionJobStatus(jobId, "pending_review");
}

export async function updateApplicationStatusAction(applicationId: string, status: string) {
  const ctx = await requireEmployer();
  if ("error" in ctx) return { ok: false };

  const parsedStatus = employerApplicationStatusSchema.safeParse(status);
  if (!parsedStatus.success) return { ok: false };

  const { error } = await ctx.supabase
    .from("applications")
    .update({ status: parsedStatus.data })
    .eq("id", applicationId)
    .eq("employer_user_id", ctx.userId);

  revalidatePath("/employer/jobs");
  return { ok: !error };
}
