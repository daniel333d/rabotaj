import "server-only";
import { createClient } from "@/lib/supabase/server";
import { dbJobToUiJob } from "@/lib/data/adapters";
import { calculateProfileCompletion } from "@/lib/profile-completion";
import type { Job } from "@/lib/data/jobs";

export type ApplicationWithJob = {
  id: string;
  status: string;
  message: string | null;
  expectedSalary: number | null;
  availabilityDate: string | null;
  createdAt: string;
  job: Job;
};

export type CandidateDashboardData = {
  applications: ApplicationWithJob[];
  savedJobs: Job[];
  recommended: Job[];
  profileCompletion: number;
};

export async function getCandidateDashboardData(userId: string): Promise<CandidateDashboardData | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const [applicationsRes, savedRes, allJobsRes, profileRes, candidateRes, experienceRes, educationRes, skillsRes, languagesRes] =
    await Promise.all([
      supabase
        .from("applications")
        .select("id, status, message, expected_salary, availability_date, created_at, jobs(*, companies(*), job_skills(skill_name))")
        .eq("candidate_user_id", userId)
        .order("created_at", { ascending: false }),
      supabase
        .from("saved_jobs")
        .select("job_id, jobs(*, companies(*), job_skills(skill_name))")
        .eq("user_id", userId)
        .order("created_at", { ascending: false }),
      supabase
        .from("jobs")
        .select("*, companies(*), job_skills(skill_name)")
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(6),
      supabase.from("profiles").select("phone, city, country").eq("id", userId).maybeSingle(),
      supabase.from("candidate_profiles").select("*").eq("user_id", userId).maybeSingle(),
      supabase.from("candidate_experience").select("id", { count: "exact", head: true }).eq("user_id", userId),
      supabase.from("candidate_education").select("id", { count: "exact", head: true }).eq("user_id", userId),
      supabase.from("candidate_skills").select("id", { count: "exact", head: true }).eq("user_id", userId),
      supabase.from("candidate_languages").select("id", { count: "exact", head: true }).eq("user_id", userId)
    ]);

  const applications: ApplicationWithJob[] = (applicationsRes.data ?? [])
    .filter((row) => row.jobs && row.jobs.companies)
    .map((row) => ({
      id: row.id,
      status: row.status,
      message: row.message,
      expectedSalary: row.expected_salary,
      availabilityDate: row.availability_date,
      createdAt: row.created_at,
      job: dbJobToUiJob(row.jobs!, row.jobs!.companies!, row.jobs!.job_skills.map((s) => s.skill_name))
    }));

  const savedJobs: Job[] = (savedRes.data ?? [])
    .filter((row) => row.jobs && row.jobs.companies)
    .map((row) => dbJobToUiJob(row.jobs!, row.jobs!.companies!, row.jobs!.job_skills.map((s) => s.skill_name)));

  const appliedSlugs = new Set(applications.map((a) => a.job.slug));
  const recommended: Job[] = (allJobsRes.data ?? [])
    .filter((row) => row.companies && !appliedSlugs.has(row.slug))
    .slice(0, 3)
    .map((row) => dbJobToUiJob(row, row.companies!, row.job_skills.map((s) => s.skill_name)));

  const candidate = candidateRes.data;
  const profile = profileRes.data;
  const { score: profileCompletion } = calculateProfileCompletion({
    professionalTitle: candidate?.professional_title ?? null,
    summary: candidate?.summary ?? null,
    expectedSalaryMin: candidate?.expected_salary_min ?? null,
    expectedSalaryMax: candidate?.expected_salary_max ?? null,
    preferredWorkMode: candidate?.preferred_work_mode ?? null,
    availabilityDate: candidate?.availability_date ?? null,
    phone: profile?.phone ?? null,
    city: profile?.city ?? null,
    country: profile?.country ?? null,
    experienceCount: experienceRes.count ?? 0,
    educationCount: educationRes.count ?? 0,
    skillsCount: skillsRes.count ?? 0,
    languagesCount: languagesRes.count ?? 0
  });

  return { applications, savedJobs, recommended, profileCompletion };
}

export type PublicCandidateProfile = {
  firstName: string | null;
  lastName: string | null;
  city: string | null;
  country: string | null;
  professionalTitle: string | null;
  summary: string | null;
  expectedSalaryMin: number | null;
  expectedSalaryMax: number | null;
  salaryCurrency: string;
  preferredWorkMode: string | null;
  relocationReady: boolean;
  availabilityDate: string | null;
  profileCompletion: number;
  experience: { companyName: string; position: string; startDate: string; endDate: string | null; isCurrent: boolean }[];
  education: { institution: string; field: string | null; degree: string | null }[];
  skills: { skillName: string; level: string | null }[];
  languages: { languageCode: string; level: string }[];
};

/** Public route — only returns data when the candidate has opted into is_public (also enforced by RLS). */
export async function getPublicCandidateProfile(slug: string): Promise<PublicCandidateProfile | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data: candidate } = await supabase.from("candidate_profiles").select("*").eq("public_slug", slug).eq("is_public", true).maybeSingle();
  if (!candidate) return null;

  const [profileRes, experienceRes, educationRes, skillsRes, languagesRes] = await Promise.all([
    supabase.from("profiles").select("first_name, last_name, city, country").eq("id", candidate.user_id).maybeSingle(),
    supabase.from("candidate_experience").select("company_name, position, start_date, end_date, is_current").eq("user_id", candidate.user_id).order("start_date", { ascending: false }),
    supabase.from("candidate_education").select("institution, field, degree").eq("user_id", candidate.user_id).order("start_date", { ascending: false }),
    supabase.from("candidate_skills").select("skill_name, level").eq("user_id", candidate.user_id),
    supabase.from("candidate_languages").select("language_code, level").eq("user_id", candidate.user_id)
  ]);

  const profile = profileRes.data;
  const experienceRows = experienceRes.data ?? [];
  const educationRows = educationRes.data ?? [];
  const skillRows = skillsRes.data ?? [];
  const languageRows = languagesRes.data ?? [];

  const { score: profileCompletion } = calculateProfileCompletion({
    professionalTitle: candidate.professional_title,
    summary: candidate.summary,
    expectedSalaryMin: candidate.expected_salary_min,
    expectedSalaryMax: candidate.expected_salary_max,
    preferredWorkMode: candidate.preferred_work_mode,
    availabilityDate: candidate.availability_date,
    phone: null,
    city: profile?.city ?? null,
    country: profile?.country ?? null,
    experienceCount: experienceRows.length,
    educationCount: educationRows.length,
    skillsCount: skillRows.length,
    languagesCount: languageRows.length
  });

  return {
    firstName: profile?.first_name ?? null,
    lastName: profile?.last_name ?? null,
    city: profile?.city ?? null,
    country: profile?.country ?? null,
    professionalTitle: candidate.professional_title,
    summary: candidate.summary,
    expectedSalaryMin: candidate.expected_salary_min,
    expectedSalaryMax: candidate.expected_salary_max,
    salaryCurrency: candidate.salary_currency,
    preferredWorkMode: candidate.preferred_work_mode,
    relocationReady: candidate.relocation_ready,
    availabilityDate: candidate.availability_date,
    profileCompletion,
    experience: (experienceRes.data ?? []).map((e) => ({
      companyName: e.company_name,
      position: e.position,
      startDate: e.start_date,
      endDate: e.end_date,
      isCurrent: e.is_current
    })),
    education: (educationRes.data ?? []).map((e) => ({ institution: e.institution, field: e.field, degree: e.degree })),
    skills: (skillsRes.data ?? []).map((s) => ({ skillName: s.skill_name, level: s.level })),
    languages: (languagesRes.data ?? []).map((l) => ({ languageCode: l.language_code, level: l.level }))
  };
}

export type CandidateProfileFull = {
  profile: { firstName: string | null; lastName: string | null; phone: string | null; country: string | null; city: string | null };
  candidate: {
    professionalTitle: string | null;
    summary: string | null;
    expectedSalaryMin: number | null;
    expectedSalaryMax: number | null;
    salaryCurrency: string;
    preferredWorkMode: string | null;
    relocationReady: boolean;
    availabilityDate: string | null;
    isPublic: boolean;
    publicSlug: string | null;
  } | null;
  experience: { id: string; companyName: string; position: string; location: string | null; startDate: string; endDate: string | null; isCurrent: boolean; description: string | null }[];
  education: { id: string; institution: string; field: string | null; degree: string | null; startDate: string; endDate: string | null }[];
  skills: { id: string; skillName: string; level: string | null; yearsExperience: number | null }[];
  languages: { id: string; languageCode: string; level: string }[];
  profileCompletion: number;
};

export async function getCandidateProfileFull(userId: string): Promise<CandidateProfileFull | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const [profileRes, candidateRes, experienceRes, educationRes, skillsRes, languagesRes] = await Promise.all([
    supabase.from("profiles").select("first_name, last_name, phone, country, city").eq("id", userId).maybeSingle(),
    supabase.from("candidate_profiles").select("*").eq("user_id", userId).maybeSingle(),
    supabase.from("candidate_experience").select("*").eq("user_id", userId).order("start_date", { ascending: false }),
    supabase.from("candidate_education").select("*").eq("user_id", userId).order("start_date", { ascending: false }),
    supabase.from("candidate_skills").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
    supabase.from("candidate_languages").select("*").eq("user_id", userId).order("created_at", { ascending: false })
  ]);

  const profile = profileRes.data;
  const candidate = candidateRes.data;
  const experience = experienceRes.data ?? [];
  const education = educationRes.data ?? [];
  const skills = skillsRes.data ?? [];
  const languages = languagesRes.data ?? [];

  const { score: profileCompletion } = calculateProfileCompletion({
    professionalTitle: candidate?.professional_title ?? null,
    summary: candidate?.summary ?? null,
    expectedSalaryMin: candidate?.expected_salary_min ?? null,
    expectedSalaryMax: candidate?.expected_salary_max ?? null,
    preferredWorkMode: candidate?.preferred_work_mode ?? null,
    availabilityDate: candidate?.availability_date ?? null,
    phone: profile?.phone ?? null,
    city: profile?.city ?? null,
    country: profile?.country ?? null,
    experienceCount: experience.length,
    educationCount: education.length,
    skillsCount: skills.length,
    languagesCount: languages.length
  });

  return {
    profile: {
      firstName: profile?.first_name ?? null,
      lastName: profile?.last_name ?? null,
      phone: profile?.phone ?? null,
      country: profile?.country ?? null,
      city: profile?.city ?? null
    },
    candidate: candidate
      ? {
          professionalTitle: candidate.professional_title,
          summary: candidate.summary,
          expectedSalaryMin: candidate.expected_salary_min,
          expectedSalaryMax: candidate.expected_salary_max,
          salaryCurrency: candidate.salary_currency,
          preferredWorkMode: candidate.preferred_work_mode,
          relocationReady: candidate.relocation_ready,
          availabilityDate: candidate.availability_date,
          isPublic: candidate.is_public,
          publicSlug: candidate.public_slug
        }
      : null,
    experience: experience.map((e) => ({
      id: e.id,
      companyName: e.company_name,
      position: e.position,
      location: e.location,
      startDate: e.start_date,
      endDate: e.end_date,
      isCurrent: e.is_current,
      description: e.description
    })),
    education: education.map((e) => ({
      id: e.id,
      institution: e.institution,
      field: e.field,
      degree: e.degree,
      startDate: e.start_date,
      endDate: e.end_date
    })),
    skills: skills.map((s) => ({ id: s.id, skillName: s.skill_name, level: s.level, yearsExperience: s.years_experience })),
    languages: languages.map((l) => ({ id: l.id, languageCode: l.language_code, level: l.level })),
    profileCompletion
  };
}
