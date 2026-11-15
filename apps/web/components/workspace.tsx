"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type ModuleKey = "dashboard" | "sales" | "inventory" | "products" | "purchases" | "customers" | "suppliers" | "expenses" | "reports" | "settings" | "admin";
type RecordRow = { id: number; name: string; detail: string; amount: number; status: string };

const NAV: { key: ModuleKey; label: string; href: string; icon: string; group: string }[] = [
  { key: "dashboard", label: "Overview", href: "/dashboard", icon: "⌂", group: "WORKSPACE" },
  { key: "sales", label: "Sales & POS", href: "/sales", icon: "↗", group: "WORKSPACE" },
  { key: "inventory", label: "Inventory", href: "/inventory", icon: "▦", group: "WORKSPACE" },
  { key: "products", label: "Products", href: "/products", icon: "◇", group: "WORKSPACE" },
  { key: "purchases", label: "Purchases", href: "/purchases", icon: "⇩", group: "WORKSPACE" },
  { key: "customers", label: "Customers & Khata", href: "/customers", icon: "♙", group: "RELATIONSHIPS" },
  { key: "suppliers", label: "Suppliers", href: "/suppliers", icon: "♧", group: "RELATIONSHIPS" },
  { key: "expenses", label: "Expenses", href: "/expenses", icon: "−", group: "MANAGE" },
  { key: "reports", label: "Reports & insights", href: "/reports", icon: "▥", group: "MANAGE" },
  { key: "settings", label: "Settings", href: "/settings", icon: "⚙", group: "MANAGE" },
];

const TITLES: Record<ModuleKey, string> = {
  dashboard: "Business overview", sales: "Sales & POS", inventory: "Inventory",
  products: "Product catalogue", purchases: "Purchases", customers: "Customers & Khata",
  suppliers: "Suppliers", expenses: "Expenses", reports: "Reports & insights",
  settings: "Workspace settings", admin: "Administration",
};

const INITIAL: Record<ModuleKey, RecordRow[]> = {
  dashboard: [
    { id: 1, name: "Today’s sales", detail: "Across all payment methods", amount: 48250, status: "Updated" },
    { id: 2, name: "Outstanding khata", detail: "Customer receivables", amount: 18600, status: "Needs follow-up" },
    { id: 3, name: "Purchases this month", detail: "Supplier invoices", amount: 127500, status: "Recorded" },
  ],
  sales: [
    { id: 101, name: "INV-2026-1042", detail: "Walk-in customer · 3 items", amount: 4250, status: "Paid" },
    { id: 102, name: "INV-2026-1041", detail: "Ali Traders · 5 items", amount: 12800, status: "Credit" },
    { id: 103, name: "INV-2026-1040", detail: "Walk-in customer · 2 items", amount: 1850, status: "Paid" },
  ],
  inventory: [
    { id: 201, name: "Premium Basmati Rice 5kg", detail: "SKU RIC-005 · Grocery", amount: 42, status: "In stock" },
    { id: 202, name: "Cooking Oil 1L", detail: "SKU OIL-001 · Grocery", amount: 8, status: "Low stock" },
    { id: 203, name: "Sugar 1kg", detail: "SKU SUG-001 · Grocery", amount: 65, status: "In stock" },
  ],
  products: [
    { id: 301, name: "Premium Basmati Rice 5kg", detail: "SKU RIC-005 · Rs 1,450", amount: 42, status: "Active" },
    { id: 302, name: "Cooking Oil 1L", detail: "SKU OIL-001 · Rs 540", amount: 8, status: "Active" },
  ],
  purchases: [
    { id: 401, name: "PUR-2026-021", detail: "City Wholesale · Today", amount: 38500, status: "Received" },
    { id: 402, name: "PUR-2026-020", detail: "Metro Distributors · Yesterday", amount: 17200, status: "Pending" },
  ],
  customers: [
    { id: 501, name: "Ali Traders", detail: "0300 1234567 · Customer", amount: 8500, status: "Due" },
    { id: 502, name: "Sara Ahmed", detail: "0321 7654321 · Customer", amount: 0, status: "Clear" },
  ],
  suppliers: [
    { id: 601, name: "City Wholesale", detail: "0300 1112233 · Supplier", amount: 12500, status: "Payable" },
    { id: 602, name: "Metro Distributors", detail: "0312 5556677 · Supplier", amount: 0, status: "Clear" },
  ],
  expenses: [
    { id: 701, name: "Shop rent", detail: "Monthly fixed expense · Today", amount: 25000, status: "Paid" },
    { id: 702, name: "Electricity bill", detail: "Utilities · This month", amount: 8200, status: "Paid" },
  ],
  reports: [
    { id: 801, name: "Sales summary", detail: "Daily, weekly and monthly performance", amount: 48250, status: "Ready" },
    { id: 802, name: "Stock valuation", detail: "Current inventory overview", amount: 215000, status: "Ready" },
  ],
  settings: [
    { id: 901, name: "Business profile", detail: "Name, contact details and address", amount: 0, status: "Configure" },
    { id: 902, name: "Team & permissions", detail: "Roles and workspace access", amount: 0, status: "Configure" },
  ],
  admin: [],
};

const money = (n: number) => "Rs " + n.toLocaleString("en-PK");

export default function Workspace({ module }: { module: ModuleKey }) {
  const [rows, setRows] = useState(INITIAL[module]);
  const [query, setQuery] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [mobileNav, setMobileNav] = useState(false);
  const filtered = useMemo(() => rows.filter(r => (r.name + " " + r.detail + " " + r.status).toLowerCase().includes(query.toLowerCase())), [rows, query]);
  const isMoney = !["inventory", "products", "settings"].includes(module);
  const addLabel = module === "sales" ? "New sale" : module === "inventory" || module === "products" ? "Add product" : module === "customers" ? "Add customer" : module === "suppliers" ? "Add supplier" : module === "expenses" ? "Add expense" : module === "purchases" ? "New purchase" : "Add record";

  function addRecord(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setRows(prev => [{ id: Date.now(), name: name.trim(), detail: "Added just now · Demo workspace", amount: Number(amount) || 0, status: "New" }, ...prev]);
    setName(""); setAmount(""); setShowAdd(false);
  }

  return (
    <div className="min-h-screen bg-[#f6f8fb] text-slate-900">
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[248px] flex-col border-r border-slate-200 bg-white transition-transform lg:translate-x-0 ${mobileNav ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-[68px] items-center gap-3 border-b border-slate-100 px-5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-600 text-lg font-black text-white">D</span>
          <div><p className="font-extrabold tracking-tight text-slate-900">Dukaan<span className="text-emerald-600">360</span></p><p className="text-[10px] font-semibold uppercase tracking-[.16em] text-slate-400">Business suite</p></div>
        </div>
        <div className="mx-3 mt-4 rounded-xl bg-slate-50 p-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Current workspace</p>
          <div className="mt-2 flex items-center gap-2"><span className="grid h-8 w-8 place-items-center rounded-lg bg-amber-100 text-sm font-bold text-amber-800">M</span><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">My Business</p><p className="text-xs text-slate-500">Free preview</p></div><span className="text-slate-400">⌄</span></div>
        </div>
        <nav className="mt-5 flex-1 space-y-5 overflow-y-auto px-3 pb-4">
          {["WORKSPACE", "RELATIONSHIPS", "MANAGE"].map(group => <div key={group}><p className="mb-2 px-3 text-[10px] font-bold tracking-[.15em] text-slate-400">{group}</p><div className="space-y-1">{NAV.filter(n => n.group === group).map(n => <Link onClick={() => setMobileNav(false)} key={n.key} href={n.href} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold transition ${module === n.key ? "bg-emerald-50 text-emerald-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}><span className="grid h-5 w-5 place-items-center text-base">{n.icon}</span>{n.label}{module === n.key && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-600"/>}</Link>)}</div></div>)}
        </nav>
        <div className="border-t border-slate-100 p-3"><div className="rounded-xl bg-slate-900 p-3 text-white"><p className="text-xs font-bold">Grow with Dukaan360</p><p className="mt-1 text-[11px] leading-relaxed text-slate-300">Unlock branches, staff roles and advanced insights.</p><button className="mt-3 w-full rounded-lg bg-emerald-500 py-2 text-xs font-bold text-white">Explore plans</button></div><div className="mt-3 flex items-center gap-2 px-2"><span className="grid h-8 w-8 place-items-center rounded-full bg-slate-200 text-xs font-bold">AA</span><div className="min-w-0 flex-1"><p className="truncate text-xs font-bold">Workspace owner</p><p className="text-[10px] text-slate-400">Account settings</p></div><Link href="/settings" aria-label="Settings" className="text-slate-400">⚙</Link></div></div>
      </aside>
      {mobileNav && <button aria-label="Close navigation" onClick={() => setMobileNav(false)} className="fixed inset-0 z-30 bg-slate-950/30 lg:hidden"/>}
      <div className="min-h-screen lg:pl-[248px]">
        <header className="sticky top-0 z-20 flex h-[68px] items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-7">
          <div className="flex items-center gap-3"><button onClick={() => setMobileNav(v => !v)} className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-lg lg:hidden" aria-label="Toggle menu">☰</button><div><p className="text-[11px] font-medium text-slate-400">My Business <span className="px-1">/</span> {TITLES[module]}</p><h1 className="text-base font-extrabold tracking-tight sm:text-lg">{TITLES[module]}</h1></div></div>
          <div className="flex items-center gap-2 sm:gap-3"><span className="hidden rounded-full bg-amber-50 px-3 py-1.5 text-[11px] font-bold text-amber-700 sm:inline-flex">DEMO DATA</span><button aria-label="Notifications" className="relative grid h-9 w-9 place-items-center rounded-xl border border-slate-200 text-slate-600">♧<i className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-rose-500"/></button><span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-100 text-xs font-extrabold text-emerald-800">AA</span></div>
        </header>
        <main className="mx-auto max-w-[1440px] px-4 py-6 sm:px-7 sm:py-8">
          <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="text-sm text-slate-500">{module === "dashboard" ? "Here’s what’s happening with your business today." : "Manage your business records in one clear workspace."}</p><p className="mt-1 text-xs text-slate-400">Sunday, 15 November 2026 · Pakistan Standard Time</p></div><div className="flex flex-wrap gap-2"><button onClick={() => setShowAdd(true)} className="rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700">＋ {addLabel}</button><button className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50">Export ↓</button></div></div>
          {module === "dashboard" && <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{[{label:"Sales today",value:"Rs 48,250",change:"+12.8%",tone:"text-emerald-600",icon:"↗"},{label:"Gross profit",value:"Rs 12,840",change:"+8.2%",tone:"text-emerald-600",icon:"◈"},{label:"Items in stock",value:"1,284",change:"8 low stock",tone:"text-amber-600",icon:"▦"},{label:"Receivables",value:"Rs 18,600",change:"6 customers",tone:"text-blue-600",icon:"♙"}].map(s=><div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_2px_8px_rgba(15,23,42,.03)] sm:p-5"><div className="flex items-center justify-between"><p className="text-xs font-semibold text-slate-500">{s.label}</p><span className="grid h-8 w-8 place-items-center rounded-xl bg-slate-50 text-slate-600">{s.icon}</span></div><p className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900">{s.value}</p><p className={`mt-1 text-[11px] font-bold ${s.tone}`}>{s.change} <span className="font-medium text-slate-400">vs last period</span></p></div>)}</div>}
          {module === "dashboard" && <div className="mb-6 grid gap-4 xl:grid-cols-[1.6fr_1fr]"><section className="rounded-2xl border border-slate-200 bg-white p-5"><div className="flex items-center justify-between"><div><h2 className="text-sm font-extrabold">Sales performance</h2><p className="mt-1 text-xs text-slate-400">Revenue overview · Last 7 days</p></div><select className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-600"><option>Last 7 days</option><option>Last 30 days</option></select></div><div className="mt-6 flex h-36 items-end justify-between gap-2 border-b border-slate-100 px-1">{[42,66,50,82,58,92,72].map((h,i)=><div key={i} className="flex h-full flex-1 flex-col justify-end"><div style={{height:h+"%"}} className={`w-full rounded-t-md ${i===5?"bg-emerald-600":"bg-emerald-100"}`}/><span className="mt-2 text-center text-[10px] text-slate-400">{["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][i]}</span></div>)}</div></section><section className="rounded-2xl border border-slate-200 bg-white p-5"><h2 className="text-sm font-extrabold">Quick actions</h2><p className="mt-1 text-xs text-slate-400">Common tasks, one tap away</p><div className="mt-4 grid grid-cols-2 gap-2">{[{label:"Create sale",href:"/sales",icon:"＋"},{label:"Add product",href:"/products",icon:"◇"},{label:"Add customer",href:"/customers",icon:"♙"},{label:"Record expense",href:"/expenses",icon:"−"}].map(a=><Link key={a.label} href={a.href} className="rounded-xl border border-slate-200 p-3 transition hover:border-emerald-300 hover:bg-emerald-50/50"><span className="text-lg text-emerald-700">{a.icon}</span><p className="mt-2 text-xs font-bold">{a.label}</p></Link>)}</div></section></div>}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_8px_rgba(15,23,42,.03)]"><div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"><div><h2 className="text-sm font-extrabold">{module === "dashboard" ? "Recent activity" : TITLES[module]}</h2><p className="mt-1 text-xs text-slate-400">{filtered.length} records · Updated just now</p></div><div className="flex gap-2"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search records..." className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none transition placeholder:text-slate-400 focus:border-emerald-500 sm:w-56"/><button onClick={()=>setQuery("")} className="rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-500">Clear</button></div></div><div className="overflow-x-auto"><table className="w-full min-w-[560px] text-left text-xs"><thead className="bg-slate-50/80 text-[10px] font-bold uppercase tracking-wider text-slate-400"><tr><th className="px-5 py-3">Name / reference</th><th className="px-5 py-3">Details</th><th className="px-5 py-3 text-right">{isMoney?"Amount":"Quantity"}</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-right">Action</th></tr></thead><tbody className="divide-y divide-slate-100">{filtered.map(r=><tr key={r.id} className="transition hover:bg-slate-50/70"><td className="px-5 py-4 font-bold text-slate-800">{r.name}</td><td className="px-5 py-4 text-slate-500">{r.detail}</td><td className="px-5 py-4 text-right font-bold tabular-nums">{isMoney?money(r.amount):r.amount.toLocaleString()}</td><td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${r.status==="Low stock"||r.status==="Due"||r.status==="Pending"?"bg-amber-50 text-amber-700":r.status==="Paid"||r.status==="Active"||r.status==="In stock"||r.status==="Received"?"bg-emerald-50 text-emerald-700":"bg-slate-100 text-slate-600"}`}>{r.status}</span></td><td className="px-5 py-4 text-right"><button onClick={()=>setRows(prev=>prev.filter(x=>x.id!==r.id))} className="font-semibold text-slate-400 hover:text-rose-600">Remove</button></td></tr>)}{filtered.length===0&&<tr><td colSpan={5} className="px-5 py-12 text-center text-slate-400">No records found. Try another search or add a new record.</td></tr>}</tbody></table></div><div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 text-[11px] text-slate-400"><span>Showing {filtered.length} of {rows.length} records</span><span>Demo workspace · Changes are local only</span></div></section>
          <p className="mt-4 text-center text-[10px] text-slate-400">Dukaan360 preview · Sample information only · Connect a configured Supabase project before using real business data.</p>
        </main>
      </div>
      {showAdd && <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4" onClick={()=>setShowAdd(false)}><form onSubmit={addRecord} onClick={e=>e.stopPropagation()} className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl"><div className="flex items-center justify-between"><h2 className="text-base font-extrabold">{addLabel}</h2><button type="button" onClick={()=>setShowAdd(false)} className="text-xl text-slate-400">×</button></div><label className="mt-5 block text-xs font-bold text-slate-600">Name / title<input autoFocus required value={name} onChange={e=>setName(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500" placeholder="Enter a name"/></label><label className="mt-4 block text-xs font-bold text-slate-600">{isMoney?"Amount (PKR)":"Quantity"}<input type="number" min="0" value={amount} onChange={e=>setAmount(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500" placeholder="0"/></label><div className="mt-6 flex justify-end gap-2"><button type="button" onClick={()=>setShowAdd(false)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600">Cancel</button><button type="submit" className="rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white">Save record</button></div></form></div>}
    </div>
  );
}
