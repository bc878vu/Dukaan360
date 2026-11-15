import { createClient } from "@supabase/supabase-js";

// Browser Supabase client. Env vars come from .env.local —
// copy .env.example first. Never use the service-role key here.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// Placeholder values keep `next build` (page prerender) from throwing
// before the real Supabase project is wired up. Auth calls will fail
// gracefully until NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY
// are set in Vercel — login/signup cannot work until then.
export const supabase = createClient(
  url || "https://placeholder.supabase.co",
  anonKey || "placeholder-anon-key",
);
