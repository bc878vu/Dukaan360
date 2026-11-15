import { createClient } from "@supabase/supabase-js";

// Browser Supabase client. Env vars come from .env.local —
// copy .env.example first. Never use the service-role key here.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabase = createClient(url, anonKey);
