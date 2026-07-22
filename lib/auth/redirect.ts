import type { UserRole } from "@/lib/supabase/database.types";

export function getPostAuthRedirect(role: UserRole): string {
  if (role === "employer") return "/employer/dashboard";
  if (role === "admin") return "/admin";
  return "/dashboard";
}

/**
 * Whether `path` is safe to redirect to after auth (a same-app relative
 * path, not an absolute/protocol-relative URL or userinfo trick like
 * `@evil.com`, which would otherwise let a crafted `next` query param send
 * users off-site straight from the real domain).
 */
export function isSafeRedirectPath(path: string | null): path is string {
  if (!path) return false;
  return path.startsWith("/") && !path.startsWith("//") && !path.startsWith("/\\") && !path.includes("://");
}
