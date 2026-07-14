import "server-only";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";

export type AdminStats = {
  totalUsers: number;
  totalCandidates: number;
  totalEmployers: number;
  totalCompanies: number;
  verifiedCompanies: number;
  totalJobs: number;
  pendingJobs: number;
  publishedJobs: number;
  totalApplications: number;
};

export async function getAdminStats(): Promise<AdminStats | null> {
  if (!(await requireAdmin())) return null;
  const admin = createAdminClient();
  if (!admin) return null;

  const [profiles, companies, jobs, applications] = await Promise.all([
    admin.from("profiles").select("role"),
    admin.from("companies").select("verified"),
    admin.from("jobs").select("status"),
    admin.from("applications").select("id", { count: "exact", head: true })
  ]);

  const profileRows = profiles.data ?? [];
  const jobRows = jobs.data ?? [];
  const companyRows = companies.data ?? [];

  return {
    totalUsers: profileRows.length,
    totalCandidates: profileRows.filter((p) => p.role === "candidate").length,
    totalEmployers: profileRows.filter((p) => p.role === "employer").length,
    totalCompanies: companyRows.length,
    verifiedCompanies: companyRows.filter((c) => c.verified).length,
    totalJobs: jobRows.length,
    pendingJobs: jobRows.filter((j) => j.status === "pending_review").length,
    publishedJobs: jobRows.filter((j) => j.status === "published").length,
    totalApplications: applications.count ?? 0
  };
}

export async function getAdminJobs() {
  if (!(await requireAdmin())) return null;
  const admin = createAdminClient();
  if (!admin) return null;

  const { data } = await admin
    .from("jobs")
    .select("id, title, status, city, country, created_at, companies(name, slug)")
    .order("created_at", { ascending: false })
    .limit(100);

  return data ?? [];
}

export async function getAdminCompanies() {
  if (!(await requireAdmin())) return null;
  const admin = createAdminClient();
  if (!admin) return null;

  const { data } = await admin.from("companies").select("*").order("created_at", { ascending: false });
  return data ?? [];
}

export async function getAdminUsers() {
  if (!(await requireAdmin())) return null;
  const admin = createAdminClient();
  if (!admin) return null;

  const { data } = await admin
    .from("profiles")
    .select("id, first_name, last_name, email, role, is_blocked, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  return data ?? [];
}
