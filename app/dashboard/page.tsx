import { redirect } from "next/navigation";
import { getSessionProfile } from "@/lib/auth/session";
import { getCandidateDashboardData } from "@/lib/data/db-candidate";
import { getDashboardDemoData } from "@/lib/demo/dashboard-demo-data";
import { DashboardClient } from "./DashboardClient";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default async function DashboardPage() {
  if (!isSupabaseConfigured()) {
    // No backend configured yet — show the full candidate portal flow with
    // realistic demo data instead of a dead end.
    return <DashboardClient demo data={getDashboardDemoData()} />;
  }

  const profile = await getSessionProfile();
  if (!profile) redirect("/login");
  if (profile.role === "employer") redirect("/employer/dashboard");
  if (profile.role === "admin") redirect("/admin");

  const data = await getCandidateDashboardData(profile.id);

  // Falls back to demo content only in the unexpected case where a logged-in
  // candidate's real data can't be loaded — never mixed with a real profile
  // silently, this keeps the page usable instead of a hard error.
  return <DashboardClient profile={profile} data={data ?? getDashboardDemoData()} dataUnavailable={!data} />;
}
