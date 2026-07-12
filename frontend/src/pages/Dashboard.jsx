import { useEffect, useState } from "react";
import { fetchDashboardKpis } from "../api/dashboardApi";
import KpiSkeleton from "../components/KpiSkeleton";

// Maps backend keys -> display label + unit. Order here controls card order.
const KPI_DISPLAY = [
  { key: "activeVehicles", label: "Active Vehicles", unit: "" },
  { key: "availableVehicles", label: "Available Vehicles", unit: "" },
  { key: "vehiclesInMaintenance", label: "Vehicles in Maintenance", unit: "" },
  { key: "activeTrips", label: "Active Trips", unit: "" },
  { key: "pendingTrips", label: "Pending Trips", unit: "" },
  { key: "driversOnDuty", label: "Drivers On Duty", unit: "" },
  { key: "fleetUtilization", label: "Fleet Utilization", unit: "%" },
];

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
  const [kpis, setKpis] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadKpis() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchDashboardKpis();
        if (isMounted) setKpis(data);
      } catch (err) {
        if (isMounted) {
          setError(
            err.response?.data?.message ??
              "Couldn't load dashboard data. Is the backend running?"
          );
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadKpis();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Live figures from{" "}
          <code className="font-mono text-xs">GET /api/dashboard/kpis</code>.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading
          ? KPI_DISPLAY.map((kpi) => <KpiSkeleton key={kpi.key} />)
          : KPI_DISPLAY.map((kpi) => (
              <KpiCard
                key={kpi.key}
                label={kpi.label}
                value={kpis?.[kpi.key] ?? "—"}
                unit={kpi.unit}
              />
            ))}
      </div>
    </div>
  );
}