"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { BUSINESS_TYPES } from "@dukaan360/config";

// Platform admin console — Overview / Businesses / Users / Sales.
// Data comes from the SECURITY DEFINER RPCs in migration 0005 (the browser
// client cannot list other tenants' rows under RLS, so direct table reads
// would always come back empty for a platform admin). Until the Supabase
// project exists and migrations 0001–0005 are applied, every tab shows the
// real connection error instead of fake data.

type Business = {
  id: string;
  name: string;
  slug: string;
  business_type: string;
  country_code: string;
  currency_code: string;
  timezone: string;
  owner_id: string;
  owner_name: string | null;
  member_count: number;
  sales_count: number;
  created_at: string;
  updated_at: string;
};

type Member = {
  id: string;
  user_id: string;
  role: string;
  status: string;
  created_at: string;
  full_name: string | null;
  phone: string | null;
};

type Profile = {
  id: string;
  full_name: string | null;
  phone: string | null;
  preferred_language: string | null;
  created_at: string;
  businesses_owned: number;
  memberships: number;
};

type Sale = {
  id: string;
  business_id: string;
  business_name: string;
  currency_code: string;
  invoice_number: string;
  status: string;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  items_count: number;
  created_at: string;
};

type SaleItem = {
  id: string;
  product_id: string;
  product_name: string | null;
  quantity: number;
  unit_price: number;
  discount: number;
  tax: number;
  line_total: number;
};

type SaleDetail = Sale & { items: SaleItem[] };
type Stats = { businesses: number; users: number; sales: number };
type Tab = "overview" | "businesses" | "users" | "sales";
type AuthState = "loading" | "denied" | "ready" | "nodb";

const SALE_STATUSES = ["draft", "completed", "cancelled"] as const;

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const fmtMoney = (n: number, currency?: string) =>
  `${Number(n).toLocaleString("en-US", { maximumFractionDigits: 2 })}${currency ? ` ${currency}` : ""}`;

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

const isNetworkError = (msg: string) =>
  /failed to fetch|networkerror|network request failed|load failed/i.test(msg);

async function callRpc<T>(
  name: string,
  args?: Record<string, unknown>,
): Promise<{ data: T | null; error: string | null }> {
  try {
    const { data, error } = await supabase.rpc(name, args ?? {});
    if (error) return { data: null, error: error.message };
    return { data: data as T, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Request failed. Please try again.",
    };
  }
}

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-0 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-5 shadow-xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-extrabold text-navy">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-lg text-slate-500 hover:bg-slate-100"
          >
            ×
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}

const inputCls =
  "mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-emerald-500/10";
const labelCls = "block text-xs font-bold text-slate-700";
const btnPrimary =
  "rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60";
const btnDanger =
  "rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60";
const btnGhost =
  "rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-navy transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-60";
const btnSmall =
  "rounded-lg px-2.5 py-1.5 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-60";

export default function AdminPage() {
  const router = useRouter();
  const [auth, setAuth] = useState<AuthState>("loading");
  const [tab, setTab] = useState<Tab>("overview");
  const [stats, setStats] = useState<Stats | null>(null);
  const [statsError, setStatsError] = useState("");
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [listError, setListError] = useState("");
  const [loadingList, setLoadingList] = useState(false);
  const [loadedTabs, setLoadedTabs] = useState<Set<Tab>>(new Set());
  const [banner, setBanner] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [qBusiness, setQBusiness] = useState("");
  const [qUser, setQUser] = useState("");
  const [qSale, setQSale] = useState("");

  const [detailBusiness, setDetailBusiness] = useState<Business | null>(null);
  const [detailMembers, setDetailMembers] = useState<Member[]>([]);
  const [editBusiness, setEditBusiness] = useState<Business | null>(null);
  const [createBusiness, setCreateBusiness] = useState(false);
  const [deleteBusiness, setDeleteBusiness] = useState<Business | null>(null);
  const [detailProfile, setDetailProfile] = useState<Profile | null>(null);
  const [editProfile, setEditProfile] = useState<Profile | null>(null);
  const [detailSale, setDetailSale] = useState<SaleDetail | null>(null);
  const [deleteSale, setDeleteSale] = useState<Sale | null>(null);

  const loadStats = useCallback(async () => {
    const { data, error } = await callRpc<Stats>("platform_admin_metrics");
    if (error) setStatsError(error);
    else setStats(data);
  }, []);

  const loadBusinesses = useCallback(async () => {
    setLoadingList(true);
    setListError("");
    const { data, error } = await callRpc<Business[]>("admin_list_businesses");
    if (error) setListError(error);
    else setBusinesses(data ?? []);
    setLoadingList(false);
  }, []);

  const loadProfiles = useCallback(async () => {
    setLoadingList(true);
    setListError("");
    const { data, error } = await callRpc<Profile[]>("admin_list_profiles");
    if (error) setListError(error);
    else setProfiles(data ?? []);
    setLoadingList(false);
  }, []);

  const loadSales = useCallback(async () => {
    setLoadingList(true);
    setListError("");
    const { data, error } = await callRpc<Sale[]>("admin_list_sales", { p_limit: 100 });
    if (error) setListError(error);
    else setSales(data ?? []);
    setLoadingList(false);
  }, []);

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();
        if (!live) return;
        if (error && isNetworkError(error.message)) {
          setAuth("nodb");
          return;
        }
        if (!user) {
          router.replace("/login");
          return;
        }
        if (user.app_metadata?.role !== "platform_admin") {
          setAuth("denied");
          return;
        }
        setAuth("ready");
        await loadStats();
        await loadBusinesses();
        setLoadedTabs(new Set(["overview", "businesses"]));
      } catch {
        if (live) setAuth("nodb");
      }
    })();
    return () => {
      live = false;
    };
  }, [router, loadStats, loadBusinesses]);

  useEffect(() => {
    if (auth !== "ready" || loadedTabs.has(tab)) return;
    if (tab === "users") void loadProfiles();
    if (tab === "sales") void loadSales();
    setLoadedTabs((prev) => new Set(prev).add(tab));
  }, [tab, auth, loadedTabs, loadProfiles, loadSales]);

  const openBusinessDetail = async (b: Business) => {
    setDetailBusiness(b);
    const { data } = await callRpc<Member[]>("admin_list_members", {
      p_business_id: b.id,
    });
    setDetailMembers(data ?? []);
  };

  const openSaleDetail = async (s: Sale) => {
    const { data, error } = await callRpc<SaleDetail>("admin_sale_detail", {
      p_sale_id: s.id,
    });
    if (error) setBanner({ kind: "err", text: error });
    else if (data) setDetailSale(data);
  };

  const filteredBusinesses = useMemo(() => {
    const q = qBusiness.trim().toLowerCase();
    if (!q) return businesses;
    return businesses.filter((b) =>
      [b.name, b.slug, b.business_type, b.owner_name ?? "", b.country_code]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [businesses, qBusiness]);

  const filteredProfiles = useMemo(() => {
    const q = qUser.trim().toLowerCase();
    if (!q) return profiles;
    return profiles.filter((p) =>
      [p.full_name ?? "", p.phone ?? "", p.id].join(" ").toLowerCase().includes(q),
    );
  }, [profiles, qUser]);

  const filteredSales = useMemo(() => {
    const q = qSale.trim().toLowerCase();
    if (!q) return sales;
    return sales.filter((s) =>
      [s.invoice_number, s.business_name, s.status].join(" ").toLowerCase().includes(q),
    );
  }, [sales, qSale]);

  async function saveBusiness(form: {
    id?: string;
    owner_id?: string;
    name: string;
    slug: string;
    business_type: string;
    country_code: string;
    currency_code: string;
    timezone: string;
  }) {
    setBusy(true);
    setBanner(null);
    const { error } = form.id
      ? await callRpc("admin_update_business", {
          p_business_id: form.id,
          p_name: form.name,
          p_business_type: form.business_type,
          p_country_code: form.country_code,
          p_currency_code: form.currency_code,
          p_timezone: form.timezone,
        })
      : await callRpc("admin_create_business", {
          p_owner_id: form.owner_id,
          p_name: form.name,
          p_slug: form.slug,
          p_business_type: form.business_type,
          p_country_code: form.country_code,
          p_currency_code: form.currency_code,
          p_timezone: form.timezone,
        });
    setBusy(false);
    if (error) {
      setBanner({ kind: "err", text: error });
      return error;
    }
    setBanner({
      kind: "ok",
      text: form.id ? "Business updated." : "Business created.",
    });
    setEditBusiness(null);
    setCreateBusiness(false);
    await loadBusinesses();
    await loadStats();
    return null;
  }

  async function confirmDeleteBusiness() {
    if (!deleteBusiness) return;
    setBusy(true);
    const { data, error } = await callRpc<{ sales_deleted: number }>(
      "admin_delete_business",
      { p_business_id: deleteBusiness.id },
    );
    setBusy(false);
    if (error) {
      setBanner({ kind: "err", text: error });
      return;
    }
    setBanner({
      kind: "ok",
      text: `Business deleted (${data?.sales_deleted ?? 0} sales removed with it).`,
    });
    setDeleteBusiness(null);
    setDetailBusiness(null);
    await loadBusinesses();
    await loadStats();
  }

  async function saveProfile(form: {
    id: string;
    full_name: string;
    phone: string;
    preferred_language: string;
  }) {
    setBusy(true);
    setBanner(null);
    const { error } = await callRpc("admin_update_profile", {
      p_user_id: form.id,
      p_full_name: form.full_name,
      p_phone: form.phone,
      p_preferred_language: form.preferred_language,
    });
    setBusy(false);
    if (error) {
      setBanner({ kind: "err", text: error });
      return error;
    }
    setBanner({ kind: "ok", text: "Profile updated." });
    setEditProfile(null);
    await loadProfiles();
    return null;
  }

  async function changeSaleStatus(saleId: string, status: string) {
    setBusy(true);
    const { error } = await callRpc("admin_update_sale_status", {
      p_sale_id: saleId,
      p_status: status,
    });
    setBusy(false);
    if (error) {
      setBanner({ kind: "err", text: error });
      return;
    }
    setBanner({ kind: "ok", text: `Sale marked as ${status}.` });
    setDetailSale((d) => (d ? { ...d, status } : d));
    await loadSales();
    await loadStats();
  }

  async function confirmDeleteSale() {
    if (!deleteSale) return;
    setBusy(true);
    const { error } = await callRpc("admin_delete_sale", { p_sale_id: deleteSale.id });
    setBusy(false);
    if (error) {
      setBanner({ kind: "err", text: error });
      return;
    }
    setBanner({ kind: "ok", text: "Sale deleted." });
    setDeleteSale(null);
    setDetailSale(null);
    await loadSales();
    await loadStats();
  }

  if (auth === "loading") {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 text-sm text-slate-500">
        Checking administrator access…
      </main>
    );
  }

  if (auth === "nodb") {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 px-4">
        <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <div className="text-3xl">🔌</div>
          <h1 className="mt-3 text-xl font-extrabold text-navy">Database not connected yet</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            The admin console needs the Dukaan360 Supabase project: create the project,
            apply migrations 0001–0005, and set NEXT_PUBLIC_SUPABASE_URL /
            NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel. Until then there is no data to manage.
          </p>
          <Link
            href="/"
            className="mt-5 inline-block rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white"
          >
            Back to Dukaan360
          </Link>
        </section>
      </main>
    );
  }

  if (auth === "denied") {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 p-5">
        <section className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <div className="text-3xl">🔒</div>
          <h1 className="mt-3 text-xl font-extrabold text-navy">Admin access restricted</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            This console is reserved for platform administrators. Your account does not
            have the required platform_admin role.
          </p>
          <button
            onClick={() => router.replace("/dashboard")}
            className="mt-5 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white"
          >
            Back to my workspace
          </button>
        </section>
      </main>
    );
  }

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: "overview", label: "Overview" },
    { key: "businesses", label: "Businesses", count: businesses.length },
    { key: "users", label: "Users", count: profiles.length },
    { key: "sales", label: "Sales", count: sales.length },
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-8">
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.18em] text-emerald-700">
              Dukaan360 · Control centre
            </p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
              Platform administration
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              High-level platform health and tenant overview.
            </p>
          </div>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.replace("/login");
            }}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-navy transition hover:border-primary hover:text-primary"
          >
            Sign out
          </button>
        </header>

        {/* Stats */}
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            { label: "Businesses", value: stats?.businesses },
            { label: "Profiles", value: stats?.users },
            { label: "Sales records", value: stats?.sales },
          ].map((x) => (
            <section
              key={x.label}
              className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5"
            >
              <p className="text-xs font-semibold text-slate-500">{x.label}</p>
              <p className="mt-1.5 text-3xl font-extrabold tabular-nums text-navy">
                {x.value === undefined ? "—" : x.value.toLocaleString()}
              </p>
            </section>
          ))}
        </div>
        {statsError && (
          <p role="alert" className="mt-3 rounded-xl bg-rose-50 p-3 text-xs leading-5 text-rose-700">
            Metrics could not load: {statsError}
          </p>
        )}

        {/* Tabs */}
        <nav className="mt-6 flex gap-1 overflow-x-auto rounded-xl bg-slate-200/60 p-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => {
                setTab(t.key);
                setBanner(null);
                setListError("");
              }}
              className={`shrink-0 rounded-lg px-3.5 py-2 text-sm font-bold transition ${
                tab === t.key
                  ? "bg-navy text-white shadow-sm"
                  : "text-slate-600 hover:bg-white hover:text-navy"
              }`}
            >
              {t.label}
              {t.count !== undefined && (
                <span
                  className={`ms-1.5 rounded-full px-1.5 py-0.5 text-[11px] ${
                    tab === t.key ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </nav>

        {banner && (
          <p
            role={banner.kind === "err" ? "alert" : "status"}
            className={`mt-4 rounded-xl p-3 text-xs leading-5 sm:text-sm ${
              banner.kind === "err"
                ? "bg-rose-50 text-rose-700"
                : "bg-emerald-50 text-emerald-800"
            }`}
          >
            {banner.text}
          </p>
        )}

        {/* Overview */}
        {tab === "overview" && (
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="font-extrabold text-navy">Recent businesses</h2>
              {businesses.length === 0 ? (
                <p className="mt-3 text-sm text-slate-500">
                  No businesses yet — or the list could not load.
                </p>
              ) : (
                <ul className="mt-3 divide-y divide-slate-100">
                  {businesses.slice(0, 5).map((b) => (
                    <li key={b.id} className="flex items-center justify-between gap-3 py-2.5">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-800">{b.name}</p>
                        <p className="text-xs text-slate-500">
                          {b.business_type} · {b.country_code} · {fmtDate(b.created_at)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => void openBusinessDetail(b)}
                        className={`${btnSmall} border border-slate-200 text-navy hover:border-primary hover:text-primary`}
                      >
                        View
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="font-extrabold text-navy">Platform safeguards</h2>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                <li>• Admin access requires trusted Supabase app_metadata.role = platform_admin.</li>
                <li>• Tenant records remain subject to database Row Level Security.</li>
                <li>• Never expose the Supabase service-role key in browser code.</li>
                <li>• Deleting a business removes its sales, products, customers, members and audit rows.</li>
                <li>• Removing a user account entirely is done in Supabase Auth, not from this panel.</li>
              </ul>
            </section>
          </div>
        )}

        {/* Businesses */}
        {tab === "businesses" && (
          <section className="mt-4 rounded-2xl border border-slate-200 bg-white">
            <div className="flex flex-wrap items-center justify-between gap-3 p-4">
              <input
                value={qBusiness}
                onChange={(e) => setQBusiness(e.target.value)}
                placeholder="🔍 Search name, slug, type, owner…"
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-emerald-500/10 sm:w-80"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => void loadBusinesses()}
                  disabled={loadingList}
                  className={`${btnSmall} border border-slate-200 text-navy hover:border-primary hover:text-primary`}
                >
                  ↻ Refresh
                </button>
                <button
                  type="button"
                  onClick={() => setCreateBusiness(true)}
                  className={`${btnSmall} bg-primary text-white hover:bg-primary-dark`}
                >
                  + New business
                </button>
              </div>
            </div>
            {listError ? (
              <p role="alert" className="mx-4 mb-4 rounded-xl bg-rose-50 p-3 text-xs leading-5 text-rose-700">
                Could not load businesses: {listError}
              </p>
            ) : loadingList ? (
              <p className="p-4 text-sm text-slate-500">Loading businesses…</p>
            ) : filteredBusinesses.length === 0 ? (
              <p className="p-4 text-sm text-slate-500">
                No businesses found. Create the first one, or check the database connection.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead>
                    <tr className="border-y border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                      <th className="px-4 py-2.5 font-semibold">Business</th>
                      <th className="px-3 py-2.5 font-semibold">Type</th>
                      <th className="px-3 py-2.5 font-semibold">Country</th>
                      <th className="px-3 py-2.5 font-semibold">Currency</th>
                      <th className="px-3 py-2.5 font-semibold">Owner</th>
                      <th className="px-3 py-2.5 font-semibold">Members</th>
                      <th className="px-3 py-2.5 font-semibold">Sales</th>
                      <th className="px-3 py-2.5 font-semibold">Created</th>
                      <th className="px-3 py-2.5 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredBusinesses.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50">
                        <td className="px-4 py-2.5">
                          <p className="font-bold text-slate-800">{b.name}</p>
                          <p className="text-xs text-slate-500">{b.slug}</p>
                        </td>
                        <td className="px-3 py-2.5 text-slate-600">{b.business_type}</td>
                        <td className="px-3 py-2.5 text-slate-600">{b.country_code}</td>
                        <td className="px-3 py-2.5 text-slate-600">{b.currency_code}</td>
                        <td className="max-w-[140px] truncate px-3 py-2.5 text-slate-600">
                          {b.owner_name ?? "—"}
                        </td>
                        <td className="px-3 py-2.5 tabular-nums text-slate-600">{b.member_count}</td>
                        <td className="px-3 py-2.5 tabular-nums text-slate-600">{b.sales_count}</td>
                        <td className="whitespace-nowrap px-3 py-2.5 text-slate-600">
                          {fmtDate(b.created_at)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2.5">
                          <div className="flex gap-1.5">
                            <button
                              type="button"
                              onClick={() => void openBusinessDetail(b)}
                              className={`${btnSmall} border border-slate-200 text-navy hover:border-primary hover:text-primary`}
                            >
                              View
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditBusiness(b)}
                              className={`${btnSmall} border border-slate-200 text-navy hover:border-primary hover:text-primary`}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteBusiness(b)}
                              className={`${btnSmall} border border-rose-200 text-rose-600 hover:bg-rose-50`}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* Users */}
        {tab === "users" && (
          <section className="mt-4 rounded-2xl border border-slate-200 bg-white">
            <div className="flex flex-wrap items-center justify-between gap-3 p-4">
              <input
                value={qUser}
                onChange={(e) => setQUser(e.target.value)}
                placeholder="🔍 Search name, phone, user id…"
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-emerald-500/10 sm:w-80"
              />
              <button
                type="button"
                onClick={() => void loadProfiles()}
                disabled={loadingList}
                className={`${btnSmall} border border-slate-200 text-navy hover:border-primary hover:text-primary`}
              >
                ↻ Refresh
              </button>
            </div>
            {listError ? (
              <p role="alert" className="mx-4 mb-4 rounded-xl bg-rose-50 p-3 text-xs leading-5 text-rose-700">
                Could not load users: {listError}
              </p>
            ) : loadingList ? (
              <p className="p-4 text-sm text-slate-500">Loading users…</p>
            ) : filteredProfiles.length === 0 ? (
              <p className="p-4 text-sm text-slate-500">
                No users found. Accounts appear here after their first sign-up.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead>
                    <tr className="border-y border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                      <th className="px-4 py-2.5 font-semibold">User</th>
                      <th className="px-3 py-2.5 font-semibold">Phone</th>
                      <th className="px-3 py-2.5 font-semibold">Language</th>
                      <th className="px-3 py-2.5 font-semibold">Businesses owned</th>
                      <th className="px-3 py-2.5 font-semibold">Memberships</th>
                      <th className="px-3 py-2.5 font-semibold">Joined</th>
                      <th className="px-3 py-2.5 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProfiles.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50">
                        <td className="px-4 py-2.5">
                          <p className="font-bold text-slate-800">{p.full_name || "—"}</p>
                          <p className="max-w-[180px] truncate text-xs text-slate-500">{p.id}</p>
                        </td>
                        <td className="px-3 py-2.5 text-slate-600">{p.phone || "—"}</td>
                        <td className="px-3 py-2.5 text-slate-600">{p.preferred_language || "en"}</td>
                        <td className="px-3 py-2.5 tabular-nums text-slate-600">{p.businesses_owned}</td>
                        <td className="px-3 py-2.5 tabular-nums text-slate-600">{p.memberships}</td>
                        <td className="whitespace-nowrap px-3 py-2.5 text-slate-600">
                          {fmtDate(p.created_at)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2.5">
                          <div className="flex gap-1.5">
                            <button
                              type="button"
                              onClick={() => setDetailProfile(p)}
                              className={`${btnSmall} border border-slate-200 text-navy hover:border-primary hover:text-primary`}
                            >
                              View
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditProfile(p)}
                              className={`${btnSmall} border border-slate-200 text-navy hover:border-primary hover:text-primary`}
                            >
                              Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* Sales */}
        {tab === "sales" && (
          <section className="mt-4 rounded-2xl border border-slate-200 bg-white">
            <div className="flex flex-wrap items-center justify-between gap-3 p-4">
              <input
                value={qSale}
                onChange={(e) => setQSale(e.target.value)}
                placeholder="🔍 Search invoice, business, status…"
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-emerald-500/10 sm:w-80"
              />
              <button
                type="button"
                onClick={() => void loadSales()}
                disabled={loadingList}
                className={`${btnSmall} border border-slate-200 text-navy hover:border-primary hover:text-primary`}
              >
                ↻ Refresh
              </button>
            </div>
            {listError ? (
              <p role="alert" className="mx-4 mb-4 rounded-xl bg-rose-50 p-3 text-xs leading-5 text-rose-700">
                Could not load sales: {listError}
              </p>
            ) : loadingList ? (
              <p className="p-4 text-sm text-slate-500">Loading sales…</p>
            ) : filteredSales.length === 0 ? (
              <p className="p-4 text-sm text-slate-500">
                No sales found. Sales appear here once businesses start billing.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] text-left text-sm">
                  <thead>
                    <tr className="border-y border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                      <th className="px-4 py-2.5 font-semibold">Invoice</th>
                      <th className="px-3 py-2.5 font-semibold">Business</th>
                      <th className="px-3 py-2.5 font-semibold">Status</th>
                      <th className="px-3 py-2.5 font-semibold">Items</th>
                      <th className="px-3 py-2.5 font-semibold">Total</th>
                      <th className="px-3 py-2.5 font-semibold">Date</th>
                      <th className="px-3 py-2.5 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredSales.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50">
                        <td className="px-4 py-2.5 font-bold text-slate-800">{s.invoice_number}</td>
                        <td className="max-w-[160px] truncate px-3 py-2.5 text-slate-600">
                          {s.business_name}
                        </td>
                        <td className="px-3 py-2.5">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                              s.status === "completed"
                                ? "bg-emerald-100 text-emerald-700"
                                : s.status === "cancelled"
                                  ? "bg-rose-100 text-rose-700"
                                  : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {s.status}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 tabular-nums text-slate-600">{s.items_count}</td>
                        <td className="whitespace-nowrap px-3 py-2.5 font-semibold tabular-nums text-slate-800">
                          {fmtMoney(s.total, s.currency_code)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2.5 text-slate-600">
                          {fmtDate(s.created_at)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2.5">
                          <div className="flex gap-1.5">
                            <button
                              type="button"
                              onClick={() => void openSaleDetail(s)}
                              className={`${btnSmall} border border-slate-200 text-navy hover:border-primary hover:text-primary`}
                            >
                              View
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteSale(s)}
                              className={`${btnSmall} border border-rose-200 text-rose-600 hover:bg-rose-50`}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
      </div>

      {/* Business detail */}
      {detailBusiness && (
        <Modal title={detailBusiness.name} onClose={() => setDetailBusiness(null)}>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            {[
              ["Slug", detailBusiness.slug],
              ["Type", detailBusiness.business_type],
              ["Country", detailBusiness.country_code],
              ["Currency", detailBusiness.currency_code],
              ["Timezone", detailBusiness.timezone],
              ["Owner", detailBusiness.owner_name ?? "—"],
              ["Members", String(detailBusiness.member_count)],
              ["Sales", String(detailBusiness.sales_count)],
              ["Created", fmtDate(detailBusiness.created_at)],
              ["Updated", fmtDate(detailBusiness.updated_at)],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs font-bold text-slate-500">{k}</dt>
                <dd className="mt-0.5 break-words font-semibold text-slate-800">{v}</dd>
              </div>
            ))}
          </dl>
          <h4 className="mt-5 font-extrabold text-navy">Members</h4>
          {detailMembers.length === 0 ? (
            <p className="mt-2 text-sm text-slate-500">No members loaded.</p>
          ) : (
            <ul className="mt-2 divide-y divide-slate-100">
              {detailMembers.map((m) => (
                <li key={m.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                  <span className="font-semibold text-slate-800">
                    {m.full_name || "—"}
                    <span className="block text-xs font-normal text-slate-500">
                      {m.phone || m.user_id.slice(0, 8) + "…"}
                    </span>
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                      m.role === "owner"
                        ? "bg-navy text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {m.role} · {m.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-5 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setDetailBusiness(null);
                setEditBusiness(detailBusiness);
              }}
              className={btnGhost}
            >
              Edit business
            </button>
          </div>
        </Modal>
      )}

      {/* Business create / edit */}
      {(createBusiness || editBusiness) && (
        <BusinessForm
          initial={editBusiness}
          profiles={profiles}
          profilesLoaded={loadedTabs.has("users")}
          onLoadProfiles={() => void loadProfiles()}
          busy={busy}
          onClose={() => {
            setCreateBusiness(false);
            setEditBusiness(null);
          }}
          onSave={saveBusiness}
        />
      )}

      {/* Business delete confirm */}
      {deleteBusiness && (
        <Modal title="Delete business?" onClose={() => setDeleteBusiness(null)}>
          <p className="text-sm leading-6 text-slate-600">
            <strong className="text-slate-900">{deleteBusiness.name}</strong> and everything
            under it will be permanently deleted — its {deleteBusiness.sales_count} sales,
            products, customers, members and audit rows. This cannot be undone.
          </p>
          <div className="mt-5 flex justify-end gap-2">
            <button type="button" onClick={() => setDeleteBusiness(null)} className={btnGhost}>
              Cancel
            </button>
            <button
              type="button"
              onClick={() => void confirmDeleteBusiness()}
              disabled={busy}
              className={btnDanger}
            >
              {busy ? "Deleting…" : "Delete permanently"}
            </button>
          </div>
        </Modal>
      )}

      {/* Profile detail */}
      {detailProfile && (
        <Modal title={detailProfile.full_name || "User"} onClose={() => setDetailProfile(null)}>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            {[
              ["User ID", detailProfile.id],
              ["Phone", detailProfile.phone || "—"],
              ["Language", detailProfile.preferred_language || "en"],
              ["Businesses owned", String(detailProfile.businesses_owned)],
              ["Memberships", String(detailProfile.memberships)],
              ["Joined", fmtDate(detailProfile.created_at)],
            ].map(([k, v]) => (
              <div key={k} className={k === "User ID" ? "col-span-2" : ""}>
                <dt className="text-xs font-bold text-slate-500">{k}</dt>
                <dd className="mt-0.5 break-all font-semibold text-slate-800">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-500">
            Removing this account entirely (auth user + data) is done in Supabase Auth,
            not from this panel — deleting only the profile row would leave an orphaned login.
          </p>
          <div className="mt-5 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setDetailProfile(null);
                setEditProfile(detailProfile);
              }}
              className={btnGhost}
            >
              Edit profile
            </button>
          </div>
        </Modal>
      )}

      {/* Profile edit */}
      {editProfile && (
        <ProfileForm
          initial={editProfile}
          busy={busy}
          onClose={() => setEditProfile(null)}
          onSave={saveProfile}
        />
      )}

      {/* Sale detail */}
      {detailSale && (
        <Modal
          title={`Invoice ${detailSale.invoice_number}`}
          onClose={() => setDetailSale(null)}
        >
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            {[
              ["Business", detailSale.business_name],
              ["Status", detailSale.status],
              ["Subtotal", fmtMoney(detailSale.subtotal, detailSale.currency_code)],
              ["Discount", fmtMoney(detailSale.discount, detailSale.currency_code)],
              ["Tax", fmtMoney(detailSale.tax, detailSale.currency_code)],
              ["Total", fmtMoney(detailSale.total, detailSale.currency_code)],
              ["Date", fmtDate(detailSale.created_at)],
              ["Items", String(detailSale.items_count)],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs font-bold text-slate-500">{k}</dt>
                <dd className="mt-0.5 font-semibold text-slate-800">{v}</dd>
              </div>
            ))}
          </dl>
          <h4 className="mt-5 font-extrabold text-navy">Line items</h4>
          {detailSale.items.length === 0 ? (
            <p className="mt-2 text-sm text-slate-500">No line items.</p>
          ) : (
            <div className="mt-2 overflow-x-auto">
              <table className="w-full min-w-[420px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-xs text-slate-500">
                    <th className="py-2 font-semibold">Product</th>
                    <th className="py-2 font-semibold">Qty</th>
                    <th className="py-2 font-semibold">Price</th>
                    <th className="py-2 font-semibold">Line total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {detailSale.items.map((it) => (
                    <tr key={it.id}>
                      <td className="py-2 font-semibold text-slate-800">
                        {it.product_name || "—"}
                      </td>
                      <td className="py-2 tabular-nums text-slate-600">{it.quantity}</td>
                      <td className="py-2 tabular-nums text-slate-600">
                        {fmtMoney(it.unit_price, detailSale.currency_code)}
                      </td>
                      <td className="py-2 font-semibold tabular-nums text-slate-800">
                        {fmtMoney(it.line_total, detailSale.currency_code)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700">
              Status
              <select
                value={detailSale.status}
                disabled={busy}
                onChange={(e) => void changeSaleStatus(detailSale.id, e.target.value)}
                className="rounded-lg border border-slate-200 px-2.5 py-2 text-sm outline-none focus:border-primary"
              >
                {SALE_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={() => setDeleteSale(detailSale)}
              className={btnDanger}
            >
              Delete sale
            </button>
          </div>
        </Modal>
      )}

      {/* Sale delete confirm */}
      {deleteSale && (
        <Modal title="Delete sale?" onClose={() => setDeleteSale(null)}>
          <p className="text-sm leading-6 text-slate-600">
            Invoice <strong className="text-slate-900">{deleteSale.invoice_number}</strong> (
            {fmtMoney(deleteSale.total, deleteSale.currency_code)}) and its{" "}
            {deleteSale.items_count} line items will be permanently deleted. This cannot be
            undone.
          </p>
          <div className="mt-5 flex justify-end gap-2">
            <button type="button" onClick={() => setDeleteSale(null)} className={btnGhost}>
              Cancel
            </button>
            <button
              type="button"
              onClick={() => void confirmDeleteSale()}
              disabled={busy}
              className={btnDanger}
            >
              {busy ? "Deleting…" : "Delete permanently"}
            </button>
          </div>
        </Modal>
      )}
    </main>
  );
}

function BusinessForm({
  initial,
  profiles,
  profilesLoaded,
  onLoadProfiles,
  busy,
  onClose,
  onSave,
}: {
  initial: Business | null;
  profiles: Profile[];
  profilesLoaded: boolean;
  onLoadProfiles: () => void;
  busy: boolean;
  onClose: () => void;
  onSave: (form: {
    id?: string;
    owner_id?: string;
    name: string;
    slug: string;
    business_type: string;
    country_code: string;
    currency_code: string;
    timezone: string;
  }) => Promise<string | null>;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [type, setType] = useState(initial?.business_type ?? "retail");
  const [country, setCountry] = useState(initial?.country_code ?? "PK");
  const [currency, setCurrency] = useState(initial?.currency_code ?? "PKR");
  const [timezone, setTimezone] = useState(initial?.timezone ?? "Asia/Karachi");
  const [ownerId, setOwnerId] = useState(initial?.owner_id ?? "");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!initial && !profilesLoaded) onLoadProfiles();
  }, [initial, profilesLoaded, onLoadProfiles]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Business name is required.");
      return;
    }
    if (!initial) {
      if (!slugify(slug || name)) {
        setError("Slug is required.");
        return;
      }
      if (!ownerId) {
        setError("Pick an owner for the new business.");
        return;
      }
    }
    setError("");
    const err = await onSave({
      id: initial?.id,
      owner_id: ownerId || undefined,
      name: name.trim(),
      slug: slugify(slug || name),
      business_type: type,
      country_code: country.trim().toUpperCase() || "PK",
      currency_code: currency.trim().toUpperCase() || "PKR",
      timezone: timezone.trim() || "Asia/Karachi",
    });
    if (err) setError(err);
  }

  return (
    <Modal title={initial ? `Edit ${initial.name}` : "New business"} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        {!initial && (
          <label className={labelCls}>
            Owner (existing user)
            <select
              value={ownerId}
              onChange={(e) => setOwnerId(e.target.value)}
              className={inputCls}
            >
              <option value="">Select a user…</option>
              {profiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.full_name || "Unnamed"} {p.phone ? `· ${p.phone}` : ""}
                </option>
              ))}
            </select>
          </label>
        )}
        <label className={labelCls}>
          Business name
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (!initial) setSlug(slugify(e.target.value));
            }}
            placeholder="e.g. Asad General Store"
            className={inputCls}
          />
        </label>
        <label className={labelCls}>
          Slug {initial && "(cannot change)"}
          <input
            value={slug}
            disabled={!!initial}
            onChange={(e) => setSlug(slugify(e.target.value))}
            placeholder="asad-general-store"
            className={`${inputCls} ${initial ? "bg-slate-50 text-slate-500" : ""}`}
          />
        </label>
        <label className={labelCls}>
          Business type
          <select value={type} onChange={(e) => setType(e.target.value)} className={inputCls}>
            {BUSINESS_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <div className="grid grid-cols-3 gap-3">
          <label className={labelCls}>
            Country
            <input
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="PK"
              maxLength={2}
              className={inputCls}
            />
          </label>
          <label className={labelCls}>
            Currency
            <input
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              placeholder="PKR"
              maxLength={3}
              className={inputCls}
            />
          </label>
          <label className={labelCls}>
            Timezone
            <input
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              placeholder="Asia/Karachi"
              className={inputCls}
            />
          </label>
        </div>
        {error && (
          <p role="alert" className="rounded-xl bg-rose-50 p-3 text-xs text-rose-700">
            {error}
          </p>
        )}
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className={btnGhost}>
            Cancel
          </button>
          <button type="submit" disabled={busy} className={btnPrimary}>
            {busy ? "Saving…" : initial ? "Save changes" : "Create business"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function ProfileForm({
  initial,
  busy,
  onClose,
  onSave,
}: {
  initial: Profile;
  busy: boolean;
  onClose: () => void;
  onSave: (form: {
    id: string;
    full_name: string;
    phone: string;
    preferred_language: string;
  }) => Promise<string | null>;
}) {
  const [name, setName] = useState(initial.full_name ?? "");
  const [phone, setPhone] = useState(initial.phone ?? "");
  const [lang, setLang] = useState(initial.preferred_language ?? "en");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const err = await onSave({
      id: initial.id,
      full_name: name.trim(),
      phone: phone.trim(),
      preferred_language: lang,
    });
    if (err) setError(err);
  }

  return (
    <Modal title={`Edit ${initial.full_name || "user"}`} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <label className={labelCls}>
          Full name
          <input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
        </label>
        <label className={labelCls}>
          Phone
          <input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} />
        </label>
        <label className={labelCls}>
          Preferred language
          <select value={lang} onChange={(e) => setLang(e.target.value)} className={inputCls}>
            <option value="en">English</option>
            <option value="ur">Urdu</option>
          </select>
        </label>
        {error && (
          <p role="alert" className="rounded-xl bg-rose-50 p-3 text-xs text-rose-700">
            {error}
          </p>
        )}
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className={btnGhost}>
            Cancel
          </button>
          <button type="submit" disabled={busy} className={btnPrimary}>
            {busy ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
