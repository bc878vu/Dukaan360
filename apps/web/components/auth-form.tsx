"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");
  const [notice,setNotice]=useState("");
  const [googleBusy,setGoogleBusy]=useState(false);
  const register=mode==="register";

  async function signInWithGoogle() {
    setGoogleBusy(true); setError("");
    try {
      const {error}=await supabase.auth.signInWithOAuth({
        provider:"google",
        options:{redirectTo:`${window.location.origin}/auth/callback`},
      });
      if(error) throw error;
    } catch(err) { setError(err instanceof Error?err.message:"Google sign-in failed. Please try again."); setGoogleBusy(false); }
  }

  async function submit(e:React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setError(""); setNotice("");
    try {
      if(register) {
        const {data,error}=await supabase.auth.signUp({
          email,password,options:{data:{full_name:name.trim()}}
        });
        if(error) throw error;
        if(data.session) { router.replace("/onboarding"); router.refresh(); }
        else setNotice("Account created. Check your email to verify your address, then sign in to create your business workspace.");
      } else {
        const {error}=await supabase.auth.signInWithPassword({email,password});
        if(error) throw error;
        router.replace("/dashboard"); router.refresh();
      }
    } catch(err) { setError(err instanceof Error?err.message:"Something went wrong. Please try again."); }
    finally { setBusy(false); }
  }

  return <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(ellipse_at_top_left,_#d1fae5_0%,_#f8fafc_42%,_#eef2ff_100%)] px-4 py-10">
    <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/80 bg-white shadow-2xl shadow-slate-900/10 md:grid-cols-[1fr_1fr]">
      <section className="hidden flex-col justify-between bg-[#0f2a43] p-10 text-white md:flex">
        <Link href="/" className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-500 text-xl font-black">D</span><span className="text-xl font-extrabold">Dukaan360</span></Link>
        <div><p className="text-xs font-bold uppercase tracking-[.22em] text-emerald-300">Manage. Grow. Succeed.</p><h1 className="mt-4 text-4xl font-extrabold leading-tight">{register?"Build a smarter way to run your business.":"Welcome back to your business."}</h1><p className="mt-4 max-w-sm text-sm leading-7 text-slate-300">Sales, inventory, customers, suppliers and business insights in one secure workspace.</p><div className="mt-8 grid grid-cols-2 gap-3 text-xs text-slate-200"><span className="rounded-xl border border-white/10 bg-white/5 p-3">✓ Business workspace</span><span className="rounded-xl border border-white/10 bg-white/5 p-3">✓ English + Urdu ready</span><span className="rounded-xl border border-white/10 bg-white/5 p-3">✓ Secure access</span><span className="rounded-xl border border-white/10 bg-white/5 p-3">✓ Multi-device vision</span></div></div>
        <p className="text-xs text-slate-400">© 2026 Dukaan360. All rights reserved.</p>
      </section>
      <section className="p-6 sm:p-10">
        <Link href="/" className="text-sm font-extrabold text-emerald-700 md:hidden">Dukaan360</Link>
        <div className="mt-5 md:mt-8"><p className="text-xs font-bold uppercase tracking-[.18em] text-emerald-700">{register?"Get started":"Your workspace awaits"}</p><h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">{register?"Create your account":"Sign in"}</h2><p className="mt-2 text-sm text-slate-500">{register?"Start with your free Dukaan360 account.":"Enter your details to continue to your workspace."}</p></div>
        <button type="button" onClick={signInWithGoogle} disabled={googleBusy||busy} className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60">
          <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303C33.654,32.657,29.223,36,24,36c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/></svg>
          {googleBusy?"Connecting to Google…":"Continue with Google"}
        </button>
        <div className="mt-6 flex items-center gap-3 text-xs font-medium text-slate-400"><span className="h-px flex-1 bg-slate-200"/><span>or continue with email</span><span className="h-px flex-1 bg-slate-200"/></div>
        <form onSubmit={submit} className="mt-6 space-y-4">
          {register&&<label className="block text-xs font-bold text-slate-700">Full name<input required value={name} onChange={e=>setName(e.target.value)} autoComplete="name" placeholder="Your full name" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"/></label>}
          <label className="block text-xs font-bold text-slate-700">Email address<input required type="email" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email" placeholder="you@example.com" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"/></label>
          <label className="block text-xs font-bold text-slate-700">Password<input required type="password" minLength={8} value={password} onChange={e=>setPassword(e.target.value)} autoComplete={register?"new-password":"current-password"} placeholder="At least 8 characters" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"/></label>
          {error&&<p role="alert" className="rounded-xl bg-rose-50 p-3 text-xs font-medium text-rose-700">{error}</p>}
          {notice&&<p role="status" className="rounded-xl bg-emerald-50 p-3 text-xs leading-5 text-emerald-800">{notice}</p>}
          <button disabled={busy} className="w-full rounded-xl bg-emerald-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60">{busy?"Please wait…":register?"Create account":"Sign in to Dukaan360"}</button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">{register?"Already have an account?":"New to Dukaan360?"} <Link className="font-bold text-emerald-700 hover:text-emerald-800" href={register?"/login":"/register"}>{register?"Sign in":"Create an account"}</Link></p>
        <p className="mt-6 text-center text-[11px] text-slate-400">By continuing, you agree to use Dukaan360 responsibly. Protect your password and never share it.</p>
      </section>
    </div>
  </main>;
}