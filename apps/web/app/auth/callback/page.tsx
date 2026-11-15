"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";

// OAuth return page: Google redirects here with ?code=… after sign-in.
// Exchanges the code for a session, then sends the user to their workspace.
export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const oauthError = params.get("error_description") || params.get("error");
        if (oauthError) throw new Error(oauthError);
        const code = params.get("code");
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
        }
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session)
          throw new Error("Google sign-in did not return a session. Please try again.");
        router.replace("/dashboard");
        router.refresh();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Google sign-in failed. Please try again.",
        );
      }
    })();
  }, [router]);

  if (error) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 px-4">
        <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <h1 className="text-xl font-extrabold text-slate-900">Google sign-in failed</h1>
          <p role="alert" className="mt-3 rounded-xl bg-rose-50 p-3 text-xs leading-5 text-rose-700">
            {error}
          </p>
          <Link
            href="/login"
            className="mt-5 inline-block rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white"
          >
            Back to sign in
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50">
      <p className="text-sm font-semibold text-slate-500">Signing you in with Google…</p>
    </main>
  );
}
