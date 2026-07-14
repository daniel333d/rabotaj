"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  candidateBasicsSchema,
  candidatePreferencesSchema,
  educationSchema,
  experienceSchema,
  languageSchema,
  skillSchema
} from "@/lib/validation/candidate";
import type { ActionState } from "@/lib/actions/auth";

async function requireCandidate() {
  const supabase = await createClient();
  if (!supabase) return { error: "backend-not-configured" as const };

  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return { error: "login-required" as const };

  return { supabase, userId: user.id };
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function updateCandidateBasicsAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await requireCandidate();
  if ("error" in ctx) return { error: ctx.error };

  const parsed = candidateBasicsSchema.safeParse({
    professionalTitle: formData.get("professionalTitle"),
    summary: formData.get("summary") || undefined,
    country: formData.get("country") || undefined,
    city: formData.get("city") || undefined,
    phone: formData.get("phone") || undefined
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "invalid-input" };

  const { professionalTitle, summary, country, city, phone } = parsed.data;

  await ctx.supabase.from("profiles").update({ country, city, phone: phone || null }).eq("id", ctx.userId);
  await ctx.supabase
    .from("candidate_profiles")
    .upsert({ user_id: ctx.userId, professional_title: professionalTitle, summary: summary || null }, { onConflict: "user_id" });

  revalidatePath("/career-passport");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateCandidatePreferencesAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await requireCandidate();
  if ("error" in ctx) return { error: ctx.error };

  const parsed = candidatePreferencesSchema.safeParse({
    expectedSalaryMin: formData.get("expectedSalaryMin") || undefined,
    expectedSalaryMax: formData.get("expectedSalaryMax") || undefined,
    salaryCurrency: formData.get("salaryCurrency") || "PLN",
    preferredWorkMode: formData.get("preferredWorkMode") || undefined,
    relocationReady: formData.get("relocationReady") === "on",
    availabilityDate: formData.get("availabilityDate") || undefined,
    isPublic: formData.get("isPublic") === "on"
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "invalid-input" };

  const { data: existing } = await ctx.supabase
    .from("candidate_profiles")
    .select("public_slug")
    .eq("user_id", ctx.userId)
    .maybeSingle();

  let publicSlug = existing?.public_slug ?? null;
  if (parsed.data.isPublic && !publicSlug) {
    const { data: profile } = await ctx.supabase.from("profiles").select("first_name, last_name").eq("id", ctx.userId).single();
    const base = slugify(`${profile?.first_name ?? "user"}-${profile?.last_name ?? ctx.userId.slice(0, 6)}`);
    publicSlug = `${base}-${ctx.userId.slice(0, 6)}`;
  }

  await ctx.supabase.from("candidate_profiles").upsert(
    {
      user_id: ctx.userId,
      expected_salary_min: parsed.data.expectedSalaryMin ?? null,
      expected_salary_max: parsed.data.expectedSalaryMax ?? null,
      salary_currency: parsed.data.salaryCurrency,
      preferred_work_mode: parsed.data.preferredWorkMode ?? null,
      relocation_ready: parsed.data.relocationReady,
      availability_date: parsed.data.availabilityDate || null,
      is_public: parsed.data.isPublic,
      public_slug: publicSlug
    },
    { onConflict: "user_id" }
  );

  revalidatePath("/career-passport");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function addExperienceAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await requireCandidate();
  if ("error" in ctx) return { error: ctx.error };

  const parsed = experienceSchema.safeParse({
    companyName: formData.get("companyName"),
    position: formData.get("position"),
    location: formData.get("location") || undefined,
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate") || undefined,
    isCurrent: formData.get("isCurrent") === "on",
    description: formData.get("description") || undefined
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "invalid-input" };

  await ctx.supabase.from("candidate_experience").insert({
    user_id: ctx.userId,
    company_name: parsed.data.companyName,
    position: parsed.data.position,
    location: parsed.data.location || null,
    start_date: parsed.data.startDate,
    end_date: parsed.data.isCurrent ? null : parsed.data.endDate || null,
    is_current: parsed.data.isCurrent,
    description: parsed.data.description || null
  });

  revalidatePath("/career-passport");
  return { success: true };
}

export async function deleteExperienceAction(id: string) {
  const ctx = await requireCandidate();
  if ("error" in ctx) return;
  await ctx.supabase.from("candidate_experience").delete().eq("id", id).eq("user_id", ctx.userId);
  revalidatePath("/career-passport");
}

export async function addEducationAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await requireCandidate();
  if ("error" in ctx) return { error: ctx.error };

  const parsed = educationSchema.safeParse({
    institution: formData.get("institution"),
    field: formData.get("field") || undefined,
    degree: formData.get("degree") || undefined,
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate") || undefined
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "invalid-input" };

  await ctx.supabase.from("candidate_education").insert({
    user_id: ctx.userId,
    institution: parsed.data.institution,
    field: parsed.data.field || null,
    degree: parsed.data.degree || null,
    start_date: parsed.data.startDate,
    end_date: parsed.data.endDate || null
  });

  revalidatePath("/career-passport");
  return { success: true };
}

export async function deleteEducationAction(id: string) {
  const ctx = await requireCandidate();
  if ("error" in ctx) return;
  await ctx.supabase.from("candidate_education").delete().eq("id", id).eq("user_id", ctx.userId);
  revalidatePath("/career-passport");
}

export async function addSkillAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await requireCandidate();
  if ("error" in ctx) return { error: ctx.error };

  const parsed = skillSchema.safeParse({
    skillName: formData.get("skillName"),
    level: formData.get("level") || undefined,
    yearsExperience: formData.get("yearsExperience") || undefined
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "invalid-input" };

  const { error } = await ctx.supabase.from("candidate_skills").insert({
    user_id: ctx.userId,
    skill_name: parsed.data.skillName,
    level: parsed.data.level ?? null,
    years_experience: parsed.data.yearsExperience ?? null
  });
  if (error) return { error: error.code === "23505" ? "invalid-input" : "generic-error" };

  revalidatePath("/career-passport");
  return { success: true };
}

export async function deleteSkillAction(id: string) {
  const ctx = await requireCandidate();
  if ("error" in ctx) return;
  await ctx.supabase.from("candidate_skills").delete().eq("id", id).eq("user_id", ctx.userId);
  revalidatePath("/career-passport");
}

export async function addLanguageAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await requireCandidate();
  if ("error" in ctx) return { error: ctx.error };

  const parsed = languageSchema.safeParse({
    languageCode: formData.get("languageCode"),
    level: formData.get("level")
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "invalid-input" };

  const { error } = await ctx.supabase.from("candidate_languages").insert({
    user_id: ctx.userId,
    language_code: parsed.data.languageCode,
    level: parsed.data.level
  });
  if (error) return { error: error.code === "23505" ? "invalid-input" : "generic-error" };

  revalidatePath("/career-passport");
  return { success: true };
}

export async function deleteLanguageAction(id: string) {
  const ctx = await requireCandidate();
  if ("error" in ctx) return;
  await ctx.supabase.from("candidate_languages").delete().eq("id", id).eq("user_id", ctx.userId);
  revalidatePath("/career-passport");
}

export async function updateAccountSettingsAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await requireCandidate();
  if ("error" in ctx) return { error: ctx.error };

  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const preferredLanguage = String(formData.get("preferredLanguage") ?? "pl").trim();

  if (!firstName || !lastName) return { error: "invalid-input" };

  await ctx.supabase
    .from("profiles")
    .update({ first_name: firstName, last_name: lastName, preferred_language: preferredLanguage })
    .eq("id", ctx.userId);

  revalidatePath("/dashboard");
  return { success: true };
}
