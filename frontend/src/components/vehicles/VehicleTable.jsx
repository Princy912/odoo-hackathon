import StatusBadge, { vehicleStatusColors } from "../common/StatusBadge";

export default function VehicleTable({ vehicles, loading }) {
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
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            {["Reg Number", "Model", "Type", "Capacity", "Status", "Region"].map(
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
            <tr key={v.id} className="hover:bg-slate-50">
              <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-slate-900">
                {v.regNumber}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600">
                {v.model || "—"}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600">
                {v.type || "—"}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600">
                {v.maxLoadCapacity != null ? v.maxLoadCapacity : "—"}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm">
                <StatusBadge status={v.status} colorMap={vehicleStatusColors} />
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600">
                {v.region || "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}