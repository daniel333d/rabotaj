import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "./database.types";
import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from "./config";

/**
 * Server client for Server Components / Server Actions / Route Handlers.
 * Uses the anon key + the caller's session cookie, so RLS still applies —
 * this is NOT the service-role client (see admin.ts for that).
 * Returns null when Supabase env vars are not configured.
 */
export async function createClient() {
  if (!isSupabaseConfigured()) return null;
  const cookieStore = await cookies();

  return createServerClient<Database>(supabaseUrl!, supabaseAnonKey!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Called from a Server Component without a mutable response — safe to
          // ignore because middleware refreshes the session on every request.
        }
      }
    }
  });
}
