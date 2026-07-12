const STATUS_OPTIONS = ["AVAILABLE", "ON_TRIP", "IN_SHOP", "RETIRED"];

export default function VehicleFilters({
  filters,
  onChange,
  typeOptions,
  regionOptions,
}) {
  const handle = (field) => (e) => onChange({ ...filters, [field]: e.target.value });

  return (
    <div className="flex flex-wrap gap-3">
      <select
        value={filters.status}
        onChange={handle("status")}
        className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
      >
        <option value="">All statuses</option>
        {STATUS_OPTIONS.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <select
        value={filters.type}
        onChange={handle("type")}
        className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
      >
        <option value="">All types</option>
        {typeOptions.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>

      <select
        value={filters.region}
        onChange={handle("region")}
        className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
      >
        <option value="">All regions</option>
        {regionOptions.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>

      {(filters.status || filters.type || filters.region) && (
        <button
          type="button"
          onClick={() => onChange({ status: "", type: "", region: "" })}
          className="text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}