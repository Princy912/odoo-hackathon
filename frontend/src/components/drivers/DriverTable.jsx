import StatusBadge, { driverStatusColors } from "../common/StatusBadge";

export default function DriverTable({ drivers, loading }) {
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
      <table className="min-w-full divide-y divide-slate-200">
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
            <tr key={d.id} className="hover:bg-slate-50">
              <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-slate-900">
                {d.name}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600">
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
                <StatusBadge status={d.status} colorMap={driverStatusColors} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}