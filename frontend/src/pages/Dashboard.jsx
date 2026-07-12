import { kpiData } from "../data/Kpidata";

function KpiCard({ label, value, unit }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="font-mono text-[11px] uppercase tracking-wide text-slate-400">
        {label}
      </div>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="text-3xl font-semibold text-slate-900">
          {value}
        </span>
        {unit && (
          <span className="text-lg font-medium text-slate-400">{unit}</span>
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Placeholder figures — wired to{" "}
          <code className="font-mono text-xs">GET /api/dashboard/kpis</code>{" "}
          in Phase 3.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi) => (
          <KpiCard
            key={kpi.key}
            label={kpi.label}
            value={kpi.value}
            unit={kpi.unit}
          />
        ))}
      </div>
    </div>
  );
}