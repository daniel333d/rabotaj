import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getPostAuthRedirect, isSafeRedirectPath } from "@/lib/auth/redirect";
import type { UserRole } from "@/lib/supabase/database.types";

/** Handles Supabase email-confirmation and password-recovery redirects. */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  if (!code) {
    return NextResponse.redirect(`${origin}/login`);
  }

  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.redirect(`${origin}/login`);
  }

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error || !data.user) {
    return NextResponse.redirect(`${origin}/login?error=link-expired`);
  }

  if (isSafeRedirectPath(next)) {
    return NextResponse.redirect(`${origin}${next}`);
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).single();
  return NextResponse.redirect(`${origin}${getPostAuthRedirect((profile?.role as UserRole) ?? "candidate")}`);
}
