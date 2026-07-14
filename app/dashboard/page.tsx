import { redirect } from "next/navigation";
import { getSessionProfile } from "@/lib/auth/session";
import { getCandidateDashboardData } from "@/lib/data/db-candidate";
import { DashboardClient } from "./DashboardClient";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default async function DashboardPage() {
  if (!isSupabaseConfigured()) {
    // No backend configured yet — keep the page reachable with a clear notice
    // instead of forcing a login redirect that could never succeed.
    return <DashboardClient notConfigured />;
  }

  const profile = await getSessionProfile();
  if (!profile) redirect("/login");
  if (profile.role === "employer") redirect("/employer/dashboard");
  if (profile.role === "admin") redirect("/admin");

  const data = await getCandidateDashboardData(profile.id);

  return <DashboardClient profile={profile} data={data} />;
}
