import { useEffect, useState } from "react";
import { getReportsSummary } from "../api/reports";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Reports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSummary();
  }, []);

  async function fetchSummary() {
    setLoading(true);
    setError(null);
    try {
      const summary = await getReportsSummary();
      setData(summary);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to load reports summary data."
      );
    } finally {
      setLoading(false);
    }
  }

  // Calculate totals for summary cards
  const stats = (() => {
    if (!data) return { totalCost: 0, avgEfficiency: 0, bestVehicle: "N/A" };
    
    const totalCost = data.vehicleReports.reduce((sum, v) => sum + v.operationalCost, 0);
    
    const avgEfficiency = data.fuelEfficiencyOverTime.length > 0
      ? data.fuelEfficiencyOverTime.reduce((sum, t) => sum + t.efficiency, 0) / data.fuelEfficiencyOverTime.length
      : 0;

    const bestVehicle = data.vehicleReports.reduce(
      (best, current) => (current.roi > (best?.roi || -999) ? current : best),
      null
    );

    return {
      totalCost,
      avgEfficiency,
      bestVehicle: bestVehicle && bestVehicle.roi !== 0 ? `${bestVehicle.regNumber} (${bestVehicle.roi.toFixed(2)}% ROI)` : "N/A",
    };
  })();

  return (
    <div className="space-y-8">
      {/* Title block */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Analytics & Reports</h1>
        <p className="text-sm text-gray-500">
          Financial performance, vehicle operational costs, and fuel efficiency metrics.
        </p>
      </div>

      {error && (
        <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Total Operational Cost
              </div>
              <div className="mt-2 text-3xl font-bold text-gray-900">
                ${stats.totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-xs text-gray-400 mt-1">Fuel + Maintenance logs</div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Avg Fuel Efficiency
              </div>
              <div className="mt-2 text-3xl font-bold text-gray-900">
                {stats.avgEfficiency.toFixed(2)} <span className="text-lg font-medium text-gray-400">km/L</span>
              </div>
              <div className="text-xs text-gray-400 mt-1">Based on completed trips</div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Top Performing Asset
              </div>
              <div className="mt-2 text-xl font-bold text-gray-900 truncate">
                {stats.bestVehicle}
              </div>
              <div className="text-xs text-gray-400 mt-2">Highest computed ROI</div>
            </div>
          </div>

          {/* Visualizations Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Operational Cost Stacked Bar Chart */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-bold text-gray-900 mb-1">
                Operational Cost per Vehicle
              </h3>
              <p className="text-xs text-gray-400 mb-6">
                Maintenance and fuel expenses logged per active registration.
              </p>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data?.vehicleReports}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis
                      dataKey="regNumber"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: "#6b7280", fontSize: 12 }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: "#6b7280", fontSize: 12 }}
                      unit="$"
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1f2937", borderRadius: "8px", border: "none" }}
                      labelStyle={{ color: "#fff", fontWeight: "bold" }}
                      itemStyle={{ color: "#d1d5db" }}
                      formatter={(value) => [`$${value.toFixed(2)}`, undefined]}
                    />
                    <Legend
                      verticalAlign="top"
                      height={36}
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{ fontSize: 12 }}
                    />
                    <Bar
                      name="Fuel Cost"
                      dataKey="fuelCost"
                      stackId="a"
                      fill="#f59e0b"
                      radius={[0, 0, 0, 0]}
                    />
                    <Bar
                      name="Maintenance Cost"
                      dataKey="maintenanceCost"
                      stackId="a"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Fuel Efficiency Line Chart */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-bold text-gray-900 mb-1">
                Fuel Efficiency Trend
              </h3>
              <p className="text-xs text-gray-400 mb-6">
                Fuel efficiency (km / Liters) plotted chronologically across completed routes.
              </p>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={data?.fuelEfficiencyOverTime}
                    margin={{ top: 10, right: 20, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: "#6b7280", fontSize: 12 }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: "#6b7280", fontSize: 12 }}
                      unit=" km/L"
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1f2937", borderRadius: "8px", border: "none" }}
                      labelStyle={{ color: "#fff", fontWeight: "bold" }}
                      itemStyle={{ color: "#d1d5db" }}
                      formatter={(value, name, props) => [
                        `${value.toFixed(2)} km/L (${props.payload.vehicleReg})`,
                        "Efficiency"
                      ]}
                    />
                    <Line
                      type="monotone"
                      dataKey="efficiency"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Financial Breakdown Table */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-base font-bold text-gray-900">Vehicle Performance Breakdown</h3>
              <p className="text-xs text-gray-400 mt-1">
                Computed metrics incorporating mock revenues (flat rate $2.50/km) and acquisition costs.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-left text-sm text-gray-500">
                <thead className="bg-gray-50/50 text-xs font-semibold uppercase tracking-wider text-gray-600">
                  <tr>
                    <th className="px-6 py-3">Vehicle</th>
                    <th className="px-6 py-3">Acquisition Cost</th>
                    <th className="px-6 py-3">Operational Cost</th>
                    <th className="px-6 py-3">Mock Revenue</th>
                    <th className="px-6 py-3 text-right">Estimated ROI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data?.vehicleReports.map((report) => (
                    <tr key={report.vehicleId} className="hover:bg-gray-50/30">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{report.regNumber}</div>
                        <div className="text-xs text-gray-400">{report.model}</div>
                      </td>
                      <td className="px-6 py-4 font-mono text-gray-700">
                        ${report.acquisitionCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 font-mono text-gray-700">
                        ${report.operationalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 font-mono text-gray-700">
                        ${report.revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span
                          className={`font-semibold ${
                            report.roi > 0
                              ? "text-emerald-600"
                              : report.roi < 0
                              ? "text-rose-600"
                              : "text-gray-500"
                          }`}
                        >
                          {report.roi > 0 ? "+" : ""}
                          {report.roi.toFixed(2)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}