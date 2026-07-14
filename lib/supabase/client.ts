"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./database.types";
import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from "./config";

/**
 * Browser client for Client Components. Returns null when Supabase env vars
 * are not configured — callers must handle that (see isSupabaseConfigured).
 */
export function createClient() {
  if (!isSupabaseConfigured()) return null;
  return createBrowserClient<Database>(supabaseUrl!, supabaseAnonKey!);
}
