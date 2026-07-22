import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from "./config";

/**
 * Anon-key client with no cookie/session plumbing. Unlike `server.ts`'s
 * `createClient`, this never calls `cookies()`, so it's safe to use inside
 * `unstable_cache` (which forbids request-scoped dynamic APIs). Only for
 * public, unauthenticated reads (published jobs, companies) — RLS already
 * allows anon access to that data.
 */
export function createPublicClient() {
  if (!isSupabaseConfigured()) return null;
  return createSupabaseClient<Database>(supabaseUrl!, supabaseAnonKey!, {
    auth: { persistSession: false }
  });
}
