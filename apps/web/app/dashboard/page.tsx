const STATS = [
  { label: "Today's sales", value: "—" },
  { label: "Products in stock", value: "—" },
  { label: "Customers owe you", value: "—" },
  { label: "You owe suppliers", value: "—" },
];

export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-bold text-navy">Dashboard</h1>
      <p className="mt-2 text-slate-600">
        Business overview — sales, stock, khata and reports. Data loads from
        Supabase once Module A (Auth) and the P0 modules land.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="rounded-lg border border-slate-200 p-4"
          >
            <p className="text-sm text-slate-500">{s.label}</p>
            <p className="mt-1 text-2xl font-bold text-navy">{s.value}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
