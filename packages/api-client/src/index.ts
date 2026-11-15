// Typed Supabase client factory — one place that builds the client for
// web and mobile. Callers pass env-provided URL + anon key.
// Service-role key is NEVER used here (server-side only, Edge Functions).
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export function createDukaanClient(
  url: string,
  anonKey: string,
): SupabaseClient {
  if (!url || !anonKey) {
    throw new Error(
      "Supabase URL and anon key are required — copy .env.example to .env.local",
    );
  }
  return createClient(url, anonKey);
}
