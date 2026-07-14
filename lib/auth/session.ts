import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/lib/supabase/database.types";

export type SessionProfile = {
  id: string;
  role: UserRole;
  firstName: string | null;
  email: string;
};

/** Reads the current user's session + profile server-side. Null when logged out or not configured. */
export async function getSessionProfile(): Promise<SessionProfile | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase.from("profiles").select("role, first_name, email").eq("id", user.id).single();
  if (!profile) return null;

  return { id: user.id, role: profile.role, firstName: profile.first_name, email: profile.email };
}
