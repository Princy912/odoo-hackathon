import StatusBadge, { vehicleStatusColors } from "../common/StatusBadge";

export default function VehicleTable({ vehicles, loading, onEdit, onDelete, onChangeStatus }) {
  if (loading) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
        Loading vehicles…
      </div>
    );
  }

  if (!vehicles.length) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
        No vehicles match these filters yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="min-w-full divide-y divide-slate-200 text-left">
        <thead className="bg-slate-50">
          <tr>
            {["Reg Number", "Model", "Type", "Capacity", "Status", "Region", "Actions"].map(
              (col) => (
                <th
                  key={col}
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  {col}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {vehicles.map((v) => (
            <tr key={v.id} className="hover:bg-slate-50/50">
              <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-slate-900 font-mono">
                {v.regNumber}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600">
                {v.model || "—"}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600">
                {v.type || "—"}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600">
                {v.maxLoadCapacity != null ? `${v.maxLoadCapacity} kg` : "—"}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm">
                <div className="flex items-center gap-2">
                  <select
                    value={v.status}
                    onChange={(e) => onChangeStatus(v.id, e.target.value)}
                    className="rounded border border-slate-200 text-xs font-medium px-2 py-1 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    {["AVAILABLE", "ON_TRIP", "IN_SHOP", "RETIRED"].map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600">
                {v.region || "—"}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(v)}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300 rounded px-2.5 py-1 cursor-pointer transition-all"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(v.id)}
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