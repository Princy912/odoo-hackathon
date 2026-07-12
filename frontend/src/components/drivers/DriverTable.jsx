import StatusBadge, { driverStatusColors } from "../common/StatusBadge";

export default function DriverTable({ drivers, loading, onEdit, onDelete, onChangeStatus }) {
  if (loading) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
        Loading drivers…
      </div>
    );
  }

  if (!drivers.length) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
        No drivers match these filters yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="min-w-full divide-y divide-slate-200 text-left">
        <thead className="bg-slate-50">
          <tr>
            {[
              "Name",
              "License Number",
              "Category",
              "License Expiry",
              "Contact",
              "Safety Score",
              "Status",
              "Actions",
            ].map((col) => (
              <th
                key={col}
                scope="col"
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {drivers.map((d) => (
            <tr key={d.id} className="hover:bg-slate-50/50">
              <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-slate-900">
                {d.name}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600 font-mono">
                {d.licenseNumber}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600">
                {d.licenseCategory || "—"}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600">
                {d.licenseExpiry || "—"}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600">
                {d.contactNumber || "—"}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600">
                {d.safetyScore != null ? d.safetyScore : "—"}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm">
                <select
                  value={d.status}
                  onChange={(e) => onChangeStatus(d.id, e.target.value)}
                  className="rounded border border-slate-200 text-xs font-medium px-2 py-1 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  {["AVAILABLE", "ON_TRIP", "OFF_DUTY", "SUSPENDED"].map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(d)}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300 rounded px-2.5 py-1 cursor-pointer transition-all"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(d.id)}
                    className="text-xs font-semibold text-rose-600 hover:text-rose-800 border border-rose-100 hover:border-rose-200 rounded px-2.5 py-1 cursor-pointer transition-all"
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
  );
}