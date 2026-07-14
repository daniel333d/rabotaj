import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import { supabaseUrl } from "./config";

/**
 * Service-role client — bypasses RLS entirely. Server-only (the `server-only`
 * import makes any accidental client-bundle import a build error). Use only
 * for admin actions (app/admin/**) after an explicit role==='admin' check
 * against the caller's own session — never trust a client-supplied role.
 */
export function createAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) return null;

  return createSupabaseClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
}
