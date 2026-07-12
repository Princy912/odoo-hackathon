export default function StatusBadge({ status, colorMap }) {
  const classes =
    colorMap[status] || "bg-slate-100 text-slate-700 ring-slate-600/20";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${classes}`}
    >
      {status}
    </span>
  );
}

// Shared color maps so Vehicle/Driver status pills stay visually consistent.
export const vehicleStatusColors = {
  AVAILABLE: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  ON_TRIP: "bg-sky-50 text-sky-700 ring-sky-600/20",
  IN_SHOP: "bg-amber-50 text-amber-700 ring-amber-600/20",
  RETIRED: "bg-slate-100 text-slate-600 ring-slate-600/20",
};

export const driverStatusColors = {
  AVAILABLE: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  ON_TRIP: "bg-sky-50 text-sky-700 ring-sky-600/20",
  OFF_DUTY: "bg-slate-100 text-slate-600 ring-slate-600/20",
  SUSPENDED: "bg-rose-50 text-rose-700 ring-rose-600/20",
};