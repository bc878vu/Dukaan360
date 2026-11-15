"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  calculateSaleTotals,
  isLowStock,
  ledgerBalance,
} from "@dukaan360/business-logic";
import { SUBSCRIPTION_PLANS } from "@dukaan360/config";
import { t } from "@dukaan360/localization";

type Locale = "en" | "ur";

const ICONS = {
  sales:
    "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z",
  inventory:
    "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
  khata:
    "M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25",
  purchases:
    "M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0",
  expenses:
    "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
  reports:
    "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
} as const;

type ModuleKey =
  | "sales"
  | "inventory"
  | "khata"
  | "purchases"
  | "expenses"
  | "reports";

const MODULES: { key: ModuleKey; href: string }[] = [
  { key: "sales", href: "/sales" },
  { key: "inventory", href: "/inventory" },
  { key: "khata", href: "/customers" },
  { key: "purchases", href: "/purchases" },
  { key: "expenses", href: "/expenses" },
  { key: "reports", href: "/reports" },
];

const COPY: Record<
  Locale,
  {
    features: string;
    liveDemo: string;
    pricing: string;
    signIn: string;
    getStarted: string;
    eyebrow: string;
    headlineA: string;
    headlineB: string;
    sub: string;
    tryDemo: string;
    trust: string;
    demoTitle: string;
    demoSub: string;
    qty: string;
    subtotal: string;
    discount: string;
    tax: string;
    total: string;
    khataLine: string;
    lowStock: string;
    onlyLeft: string;
    modulesTitle: string;
    modulesSub: string;
    open: string;
    pricingTitle: string;
    pricingSub: string;
    perMonth: string;
    popular: string;
    choose: string;
    pricingNote: string;
    ctaTitle: string;
    ctaSub: string;
    footerTag: string;
    footerNote: string;
    menu: string;
    close: string;
    moduleNames: Record<ModuleKey, string>;
    moduleDescs: Record<ModuleKey, string>;
    planBullets: Record<string, string[]>;
    statLabels: string[];
  }
> = {
  en: {
    features: "Features",
    liveDemo: "Live demo",
    pricing: "Pricing",
    signIn: "Sign in",
    getStarted: "Get started",
    eyebrow: "Early development preview",
    headlineA: "Your business,",
    headlineB: "connected in one place.",
    sub: "Sales, inventory, purchases, khata and reports — one simple system for your dukaan, in English and Urdu.",
    tryDemo: "Try the live demo",
    trust: "Free plan included · No credit card · English + Urdu",
    demoTitle: "Live demo — ring up a sale",
    demoSub:
      "Change quantities and watch the bill update — calculated with the same totals engine the app uses.",
    qty: "Qty",
    subtotal: "Subtotal",
    discount: "Discount",
    tax: "Tax (5%)",
    total: "Total",
    khataLine: "Customer owes (khata)",
    lowStock: "Low stock",
    onlyLeft: "only 3 left",
    modulesTitle: "Everything your dukaan needs",
    modulesSub:
      "Six core modules, one login — stock, sales, khata and reports stay in sync.",
    open: "Open",
    pricingTitle: "Simple pricing in PKR",
    pricingSub: "Start free. Upgrade when your dukaan grows.",
    perMonth: "/month",
    popular: "Most popular",
    choose: "Choose",
    pricingNote: "Prices in PKR, per month. Cancel anytime.",
    ctaTitle: "Ready to run your dukaan the smart way?",
    ctaSub: "Create your business in minutes — free plan, no card needed.",
    footerTag: "Manage. Grow. Succeed.",
    footerNote: "Built with Next.js + Supabase · Early development preview",
    menu: "Menu",
    close: "Close",
    moduleNames: {
      sales: "Sales & POS",
      inventory: "Inventory",
      khata: "Digital Khata",
      purchases: "Purchases",
      expenses: "Expenses",
      reports: "Reports",
    },
    moduleDescs: {
      sales: "Create sales and manage billing.",
      inventory: "Track products, stock and movements.",
      khata: "Manage customer and supplier balances.",
      purchases: "Record purchases and supplier payments.",
      expenses: "Keep business costs organized.",
      reports: "Understand sales and business performance.",
    },
    planBullets: {
      free: ["1 business", "Core modules", "Community support"],
      starter: [
        "Everything in Free",
        "Unlimited products",
        "Khata + reports",
      ],
      business: [
        "Everything in Starter",
        "Branches + staff roles",
        "Priority support",
      ],
      enterprise: [
        "Everything in Business",
        "Custom limits",
        "Dedicated support",
      ],
    },
    statLabels: [
      "Core modules",
      "Languages (EN + UR)",
      "Tables protected by RLS",
      "Plans from PKR 0",
    ],
  },
  ur: {
    features: "خصوصیات",
    liveDemo: "لائیو ڈیمو",
    pricing: "قیمت",
    signIn: "سائن ان",
    getStarted: "شروع کریں",
    eyebrow: "ابتدائی پیش نظارہ",
    headlineA: "آپ کا کاروبار،",
    headlineB: "ایک ہی جگہ جڑا ہوا۔",
    sub: "سیلز، انوینٹری، خریداری، کھاتا اور رپورٹس — آپ کی دکان کے لیے ایک آسان نظام، اردو اور انگریزی میں۔",
    tryDemo: "لائیو ڈیمو آزمائیں",
    trust: "مفت پلان شامل · کوئی کارڈ نہیں · اردو + انگریزی",
    demoTitle: "لائیو ڈیمو — ایک سیل بنائیں",
    demoSub:
      "مقدار بدلیں اور بل خود بدلتا دیکھیں — وہی حساب جو ایپ استعمال کرتی ہے۔",
    qty: "تعداد",
    subtotal: "ذیلی کل",
    discount: "رعایت",
    tax: "ٹیکس (5٪)",
    total: "کل",
    khataLine: "گاہک کا بقایا (کھاتا)",
    lowStock: "اسٹاک کم",
    onlyLeft: "صرف 3 باقی",
    modulesTitle: "آپ کی دکان کی ہر ضرورت",
    modulesSub:
      "چھ بنیادی ماڈیولز، ایک لاگ ان — اسٹاک، سیلز، کھاتا اور رپورٹس ہم آہنگ رہیں۔",
    open: "کھولیں",
    pricingTitle: "روپوں میں سادہ قیمت",
    pricingSub: "مفت شروع کریں۔ دکان بڑھے تو اپ گریڈ کریں۔",
    perMonth: "/ماہ",
    popular: "سب سے مقبول",
    choose: "منتخب کریں",
    pricingNote: "قیمتیں روپوں میں، ماہانہ۔ کسی بھی وقت منسوخ کریں۔",
    ctaTitle: "اپنی دکان سمارٹ طریقے سے چلانے کے لیے تیار ہیں؟",
    ctaSub: "منٹوں میں اپنا کاروبار بنائیں — مفت پلان، کارڈ کی ضرورت نہیں۔",
    footerTag: "سنبھالیں۔ بڑھیں۔ کامیاب ہوں۔",
    footerNote: "Next.js + Supabase کے ساتھ بنایا گیا · ابتدائی پیش نظارہ",
    menu: "مینیو",
    close: "بند کریں",
    moduleNames: {
      sales: "سیلز اور POS",
      inventory: "انوینٹری",
      khata: "ڈیجیٹل کھاتا",
      purchases: "خریداری",
      expenses: "اخراجات",
      reports: "رپورٹس",
    },
    moduleDescs: {
      sales: "سیلز بنائیں اور بلنگ سنبھالیں۔",
      inventory: "مصنوعات، اسٹاک اور نقل و حرکت ٹریک کریں۔",
      khata: "گاہکوں اور سپلائرز کے بیلنس سنبھالیں۔",
      purchases: "خریداری اور سپلائر ادائیگیاں ریکارڈ کریں۔",
      expenses: "کاروباری اخراجات منظم رکھیں۔",
      reports: "سیلز اور کاروبار کی کارکردگی سمجھیں۔",
    },
    planBullets: {
      free: ["1 کاروبار", "بنیادی ماڈیولز", "کمیونٹی سپورٹ"],
      starter: ["مفت والا سب کچھ", "لامحدود مصنوعات", "کھاتا + رپورٹس"],
      business: ["اسٹارٹر والا سب کچھ", "برانچز + عملے کے رولز", "ترجیحی سپورٹ"],
      enterprise: ["بزنس والا سب کچھ", "حسب ضرورت حدود", "مخصوص سپورٹ"],
    },
    statLabels: [
      "بنیادی ماڈیولز",
      "زبانیں (اردو + انگریزی)",
      "محفوظ ٹیبلز (RLS)",
      "پلانز (0 روپے سے)",
    ],
  },
};

const DEMO_LINES = [
  { name: { en: "Atta 10 kg", ur: "آٹا 10 کلو" }, price: 1150 },
  { name: { en: "Cooking Oil 5 L", ur: "کوکنگ آئل 5 لیٹر" }, price: 2850 },
  { name: { en: "Sugar 5 kg", ur: "چینی 5 کلو" }, price: 780 },
];

const fmt = (n: number) => "Rs " + n.toLocaleString("en-US");

function Icon({ d, className }: { d: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}

function Stat({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const [n, setN] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setStarted(true);
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const t0 = performance.now();
    const dur = 900;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, value]);

  return (
    <div ref={ref} className="px-4 py-5 text-center sm:py-6">
      <p className="text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
        {n}
      </p>
      <p className="mt-1 text-xs font-medium text-slate-500 sm:text-sm">
        {label}
      </p>
    </div>
  );
}

export default function HomePage() {
  const [locale, setLocale] = useState<Locale>("en");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [qtys, setQtys] = useState<number[]>([2, 1, 3]);

  const c = COPY[locale];
  const tagline = t(locale, "tagline");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const lines = DEMO_LINES.map((l, i) => ({
    quantity: qtys[i],
    unitPrice: l.price,
    discount: 0,
    tax: 0,
  }));
  const totals = calculateSaleTotals(lines, {
    discount: 100,
    tax: Math.round(
      (lines.reduce((s, l) => s + l.quantity * l.unitPrice, 0) - 100) * 0.05,
    ),
  });
  const khataOwed = ledgerBalance(5000, 12500, 8000);
  const sugarLow = isLowStock(3, 5);

  const setQty = (i: number, delta: number) =>
    setQtys((q) => q.map((v, j) => (j === i ? Math.min(99, Math.max(0, v + delta)) : v)));

  return (
    <div
      dir={locale === "ur" ? "rtl" : "ltr"}
      className="min-h-screen bg-white text-slate-900"
    >
      {/* Sticky nav */}
      <header
        className={`sticky top-0 z-50 border-b bg-white/90 backdrop-blur transition-shadow ${
          scrolled ? "border-slate-200 shadow-sm" : "border-transparent"
        }`}
      >
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-lg font-extrabold text-white">
              D
            </span>
            <span className="text-lg font-extrabold tracking-tight text-navy sm:text-xl">
              Dukaan360
            </span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
            <a href="#features" className="hover:text-primary">
              {c.features}
            </a>
            <a href="#demo" className="hover:text-primary">
              {c.liveDemo}
            </a>
            <a href="#pricing" className="hover:text-primary">
              {c.pricing}
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <div
              className="flex rounded-full border border-slate-200 p-0.5 text-xs font-bold"
              role="group"
              aria-label="Language"
            >
              {(["en", "ur"] as Locale[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLocale(l)}
                  className={`rounded-full px-2.5 py-1 uppercase transition ${
                    locale === l
                      ? "bg-primary text-white"
                      : "text-slate-500 hover:text-navy"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
            <Link
              href="/login"
              className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-navy hover:bg-slate-100 sm:block"
            >
              {c.signIn}
            </Link>
            <Link
              href="/register"
              className="hidden rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark sm:block"
            >
              {c.getStarted}
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? c.close : c.menu}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-navy md:hidden"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                className="h-5 w-5"
              >
                {menuOpen ? (
                  <path d="M6 6l12 12M18 6L6 18" />
                ) : (
                  <path d="M4 7h16M4 12h16M4 17h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav className="border-t border-slate-100 px-4 py-3 md:hidden">
            <div className="flex flex-col gap-1 text-sm font-medium text-slate-700">
              <a
                href="#features"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2.5 hover:bg-slate-100"
              >
                {c.features}
              </a>
              <a
                href="#demo"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2.5 hover:bg-slate-100"
              >
                {c.liveDemo}
              </a>
              <a
                href="#pricing"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2.5 hover:bg-slate-100"
              >
                {c.pricing}
              </a>
              <div className="mt-1 flex gap-2 border-t border-slate-100 pt-3">
                <Link
                  href="/login"
                  className="flex-1 rounded-lg border border-slate-200 px-3 py-2.5 text-center font-semibold text-navy"
                >
                  {c.signIn}
                </Link>
                <Link
                  href="/register"
                  className="flex-1 rounded-lg bg-primary px-3 py-2.5 text-center font-semibold text-white"
                >
                  {c.getStarted}
                </Link>
              </div>
            </div>
          </nav>
        )}
      </header>

      <main>
        {/* Hero + live demo */}
        <section className="bg-gradient-to-b from-emerald-50/80 via-white to-white">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 pb-10 pt-10 sm:px-6 sm:pt-14 lg:grid-cols-2 lg:items-center lg:gap-12 lg:pb-16 lg:pt-16">
            <div className="animate-fade-up">
              <p className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-primary-dark">
                <span className="h-2 w-2 rounded-full bg-primary" />
                {c.eyebrow}
              </p>
              <h1 className="mt-4 text-4xl font-extrabold leading-[1.08] tracking-tight text-navy sm:text-5xl lg:text-[3.4rem]">
                {c.headlineA}{" "}
                <span className="text-primary">{c.headlineB}</span>
              </h1>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-slate-600 sm:text-lg">
                {c.sub}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/register"
                  className="rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-md shadow-emerald-600/20 transition hover:bg-primary-dark sm:text-base"
                >
                  {c.getStarted} →
                </Link>
                <a
                  href="#demo"
                  className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-navy transition hover:border-primary hover:text-primary sm:text-base"
                >
                  {c.tryDemo}
                </a>
              </div>
              <p className="mt-4 text-xs font-medium text-slate-500 sm:text-sm">
                {c.trust}
              </p>
            </div>

            {/* Live demo card */}
            <div
              id="demo"
              className="animate-fade-up rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/5 sm:p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-navy sm:text-lg">
                    {c.demoTitle}
                  </h2>
                  <p className="mt-0.5 text-xs leading-relaxed text-slate-500 sm:text-sm">
                    {c.demoSub}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-primary-dark">
                  LIVE
                </span>
              </div>
              <div className="mt-4 divide-y divide-slate-100">
                {DEMO_LINES.map((line, i) => (
                  <div
                    key={line.name.en}
                    className="flex items-center justify-between gap-3 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {line.name[locale]}
                      </p>
                      <p className="text-xs text-slate-500">
                        {fmt(line.price)}
                        {i === 2 && sugarLow && (
                          <span className="ms-2 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                            {c.lowStock} · {c.onlyLeft}
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        type="button"
                        aria-label={`${c.qty} -`}
                        onClick={() => setQty(i, -1)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-base font-bold text-slate-600 hover:border-primary hover:text-primary"
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-sm font-bold text-navy">
                        {qtys[i]}
                      </span>
                      <button
                        type="button"
                        aria-label={`${c.qty} +`}
                        onClick={() => setQty(i, 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-base font-bold text-slate-600 hover:border-primary hover:text-primary"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <dl className="mt-3 space-y-1.5 border-t border-slate-100 pt-3 text-sm">
                <div className="flex justify-between text-slate-600">
                  <dt>{c.subtotal}</dt>
                  <dd className="font-semibold">{fmt(totals.subtotal)}</dd>
                </div>
                <div className="flex justify-between text-slate-600">
                  <dt>{c.discount}</dt>
                  <dd className="font-semibold">− {fmt(totals.discount)}</dd>
                </div>
                <div className="flex justify-between text-slate-600">
                  <dt>{c.tax}</dt>
                  <dd className="font-semibold">{fmt(totals.tax)}</dd>
                </div>
                <div className="flex justify-between border-t border-slate-100 pt-2 text-base font-extrabold text-navy">
                  <dt>{c.total}</dt>
                  <dd>{fmt(totals.total)}</dd>
                </div>
              </dl>
              <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600 sm:text-sm">
                {c.khataLine}:{" "}
                <span className="font-bold text-navy">{fmt(khataOwed)}</span>
              </p>
            </div>
          </div>
        </section>

        {/* Stats strip */}
        <section className="border-y border-slate-100 bg-slate-50/60">
          <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-slate-200 px-2 sm:px-6 lg:grid-cols-4">
            {[9, 2, 12, 4].map((v, i) => (
              <Stat key={i} value={v} label={c.statLabels[i]} />
            ))}
          </div>
        </section>

        {/* Modules */}
        <section id="features" className="scroll-mt-20">
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
            <h2 className="text-center text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
              {c.modulesTitle}
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-center text-sm leading-relaxed text-slate-600 sm:text-base">
              {c.modulesSub}
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {MODULES.map((m) => (
                <Link
                  key={m.key}
                  href={m.href}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-lg hover:shadow-emerald-600/10"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-primary transition group-hover:bg-primary group-hover:text-white">
                    <Icon d={ICONS[m.key]} className="h-6 w-6" />
                  </span>
                  <h3 className="mt-3 text-lg font-bold text-navy">
                    {c.moduleNames[m.key]}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">
                    {c.moduleDescs[m.key]}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-primary">
                    {c.open}
                    <span className="transition-transform group-hover:translate-x-0.5">
                      →
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="scroll-mt-20 bg-slate-50/70">
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
            <h2 className="text-center text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
              {c.pricingTitle}
            </h2>
            <p className="mt-2 text-center text-sm text-slate-600 sm:text-base">
              {c.pricingSub}
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {SUBSCRIPTION_PLANS.map((plan) => {
                const popular = plan.id === "business";
                return (
                  <div
                    key={plan.id}
                    className={`relative flex flex-col rounded-2xl border bg-white p-5 ${
                      popular
                        ? "border-primary shadow-lg shadow-emerald-600/10 ring-1 ring-primary"
                        : "border-slate-200"
                    }`}
                  >
                    {popular && (
                      <span className="absolute -top-3 start-4 rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-bold text-white">
                        {c.popular}
                      </span>
                    )}
                    <h3 className="text-base font-bold text-navy">
                      {plan.name}
                    </h3>
                    <p className="mt-2">
                      <span className="text-3xl font-extrabold tracking-tight text-navy">
                        Rs {plan.priceMonthly.toLocaleString("en-US")}
                      </span>
                      <span className="text-sm text-slate-500">
                        {" "}
                        {c.perMonth}
                      </span>
                    </p>
                    <ul className="mt-4 flex-1 space-y-2 text-sm text-slate-600">
                      {c.planBullets[plan.id].map((b) => (
                        <li key={b} className="flex items-start gap-2">
                          <span className="mt-0.5 text-primary">✓</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/register"
                      className={`mt-5 rounded-xl px-4 py-2.5 text-center text-sm font-bold transition ${
                        popular
                          ? "bg-primary text-white hover:bg-primary-dark"
                          : "border border-slate-300 text-navy hover:border-primary hover:text-primary"
                      }`}
                    >
                      {c.choose} {plan.name}
                    </Link>
                  </div>
                );
              })}
            </div>
            <p className="mt-5 text-center text-xs text-slate-500 sm:text-sm">
              {c.pricingNote}
            </p>
          </div>
        </section>

        {/* CTA band */}
        <section className="mx-auto max-w-6xl px-4 pb-12 pt-2 sm:px-6">
          <div className="rounded-2xl bg-navy px-6 py-10 text-center text-white sm:py-12">
            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              {c.ctaTitle}
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-300 sm:text-base">
              {c.ctaSub}
            </p>
            <Link
              href="/register"
              className="mt-6 inline-block rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-primary-dark sm:text-base"
            >
              {c.getStarted} →
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-center sm:flex-row sm:px-6 sm:text-start">
          <p className="text-sm font-bold text-navy">
            Dukaan360 · <span className="font-medium text-slate-500">{tagline}</span>
          </p>
          <p className="text-xs text-slate-500 sm:text-sm">{c.footerNote}</p>
        </div>
      </footer>
    </div>
  );
}
