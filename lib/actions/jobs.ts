"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { applicationSchema } from "@/lib/validation/application";

export type SaveToggleResult = { saved: boolean } | { error: "login-required" | "backend-not-configured" };

export async function toggleSavedJobAction(jobId: string): Promise<SaveToggleResult> {
  const supabase = await createClient();
  if (!supabase) return { error: "backend-not-configured" };

  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return { error: "login-required" };

  const { data: existing } = await supabase
    .from("saved_jobs")
    .select("id")
    .eq("user_id", user.id)
    .eq("job_id", jobId)
    .maybeSingle();

  if (existing) {
    await supabase.from("saved_jobs").delete().eq("id", existing.id);
    revalidatePath("/dashboard");
    return { saved: false };
  }

  await supabase.from("saved_jobs").insert({ user_id: user.id, job_id: jobId });
  revalidatePath("/dashboard");
  return { saved: true };
}

export type ApplicationActionState = {
  error?: "login-required" | "already-applied" | "backend-not-configured" | "invalid-input" | "generic-error";
  success?: boolean;
};

export async function createApplicationAction(
  _prevState: ApplicationActionState,
  formData: FormData
): Promise<ApplicationActionState> {
  const supabase = await createClient();
  if (!supabase) return { error: "backend-not-configured" };

  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return { error: "login-required" };

  const parsed = applicationSchema.safeParse({
    jobId: formData.get("jobId"),
    message: formData.get("message") || undefined,
    expectedSalary: formData.get("expectedSalary") || undefined,
    availabilityDate: formData.get("availabilityDate") || undefined
  });
  if (!parsed.success) return { error: "invalid-input" };

  const { jobId, message, expectedSalary, availabilityDate } = parsed.data;

  const { data: job } = await supabase.from("jobs").select("id, company_id, companies(owner_user_id)").eq("id", jobId).single();
  if (!job || !job.companies) return { error: "generic-error" };

  const { data: existing } = await supabase
    .from("applications")
    .select("id")
    .eq("job_id", jobId)
    .eq("candidate_user_id", user.id)
    .maybeSingle();
  if (existing) return { error: "already-applied" };

  const { error } = await supabase.from("applications").insert({
    job_id: jobId,
    candidate_user_id: user.id,
    employer_user_id: job.companies.owner_user_id,
    message: message || null,
    expected_salary: expectedSalary ?? null,
    availability_date: availabilityDate || null
  });

  // Unique constraint (job_id, candidate_user_id) is the hard backstop against
  // a race where two requests slip past the pre-check above at the same time.
  if (error) {
    if (error.code === "23505") return { error: "already-applied" };
    return { error: "generic-error" };
  }

  revalidatePath("/dashboard");
  return { success: true };
}

export async function withdrawApplicationAction(applicationId: string): Promise<{ ok: boolean }> {
  const supabase = await createClient();
  if (!supabase) return { ok: false };

  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return { ok: false };

  const { error } = await supabase
    .from("applications")
    .update({ status: "withdrawn" })
    .eq("id", applicationId)
    .eq("candidate_user_id", user.id);

  revalidatePath("/dashboard");
  return { ok: !error };
}
