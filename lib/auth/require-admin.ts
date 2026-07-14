import "server-only";
import { createClient } from "@/lib/supabase/server";

/**
 * Confirms the CALLER's own session (never a client-supplied value) belongs
 * to an admin, reading their profile through the normal RLS-scoped client.
 * Only after this passes should any code reach for the service-role client.
 */
export async function requireAdmin(): Promise<{ userId: string } | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return null;

  return { userId: user.id };
}
