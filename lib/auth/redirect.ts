import type { UserRole } from "@/lib/supabase/database.types";

export function getPostAuthRedirect(role: UserRole): string {
  if (role === "employer") return "/employer/dashboard";
  if (role === "admin") return "/admin";
  return "/dashboard";
}
