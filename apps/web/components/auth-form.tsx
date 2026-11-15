"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");
  const [notice,setNotice]=useState("");
  const register=mode==="register";

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
        <form onSubmit={submit} className="mt-8 space-y-4">
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