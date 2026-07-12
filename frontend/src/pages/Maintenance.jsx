import { useEffect, useState } from "react";
import { getMaintenanceLogs, createMaintenance, closeMaintenance } from "../api/maintenance";
import { getVehicles } from "../api/vehicles";
import StatusBadge from "../components/common/StatusBadge";
import Modal from "../components/common/Modal";

const maintStatusColors = {
  ACTIVE: "bg-amber-50 text-amber-700 ring-amber-600/20",
  CLOSED: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
};

export default function Maintenance() {
  const [logs, setLogs] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal States
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Form States
  const [newMaint, setNewMaint] = useState({
    vehicleId: "",
    type: "",
    cost: "",
    serviceDate: new Date().toISOString().split("T")[0],
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    setError(null);
    try {
      const [logsData, vehiclesData] = await Promise.all([
        getMaintenanceLogs(),
        getVehicles(),
      ]);
      setLogs(logsData);
      setVehicles(vehiclesData);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || "Failed to load maintenance logs.");
    } finally {
      setLoading(false);
    }
  }

  const handleCreateMaint = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        vehicleId: Number(newMaint.vehicleId),
        type: newMaint.type,
        cost: Number(newMaint.cost),
        serviceDate: newMaint.serviceDate,
      };
      await createMaintenance(payload);
      setCreateModalOpen(false);
      setNewMaint({
        vehicleId: "",
        type: "",
        cost: "",
        serviceDate: new Date().toISOString().split("T")[0],
      });
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || "Failed to create maintenance log.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseMaint = async (id) => {
    setError(null);
    try {
      await closeMaintenance(id);
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || "Failed to close maintenance log.");
    }
  };

  // Only show vehicles that are AVAILABLE, ON_TRIP, or IN_SHOP. 
  // It is best to schedule maintenance on AVAILABLE vehicles (which transitions them to IN_SHOP).
  const availableVehicles = vehicles.filter(v => v.status === "AVAILABLE" || v.status === "IN_SHOP");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Maintenance Logs</h1>
          <p className="text-sm text-gray-500">
            Log services, track repairs, and manage in-shop vehicle lifecycles.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCreateModalOpen(true)}
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 transition-colors"
        >
          + Create Maintenance
        </button>
      </div>

      {error && (
        <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 animate-pulse">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 text-left text-sm text-gray-500">
            <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-600">
              <tr>
                <th className="px-6 py-3">Vehicle</th>
                <th className="px-6 py-3">Service Type</th>
                <th className="px-6 py-3">Service Date</th>
                <th className="px-6 py-3">Cost</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-gray-400">
                    No maintenance records logged. Click "+ Create Maintenance" to add one.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">
                        {log.vehicle?.model || "Unknown Model"}
                      </div>
                      <div className="font-mono text-xs text-gray-400">
                        {log.vehicle?.regNumber || `ID: ${log.vehicle?.id}`}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-900 font-medium">
                      {log.type}
                    </td>
                    <td className="px-6 py-4">
                      {log.serviceDate}
                    </td>
                    <td className="px-6 py-4 font-mono text-gray-900 font-semibold">
                      ${log.cost?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={log.status} colorMap={maintStatusColors} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      {log.status === "ACTIVE" && (
                        <button
                          onClick={() => handleCloseMaint(log.id)}
                          className="rounded bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors"
                        >
                          Close Record
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* CREATE MAINTENANCE MODAL */}
      <Modal open={createModalOpen} title="Log Vehicle Maintenance" onClose={() => setCreateModalOpen(false)}>
        <form onSubmit={handleCreateMaint} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Vehicle</label>
            <select
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
              value={newMaint.vehicleId}
              onChange={(e) => setNewMaint({ ...newMaint, vehicleId: e.target.value })}
            >
              <option value="">Select Vehicle</option>
              {availableVehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.regNumber} ({v.model}) — {v.status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Service Type</label>
            <input
              type="text"
              required
              placeholder="e.g. Engine Tuning, Brake Pads replacement"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
              value={newMaint.type}
              onChange={(e) => setNewMaint({ ...newMaint, type: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Cost ($)</label>
              <input
                type="number"
                step="any"
                required
                placeholder="e.g. 450.00"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                value={newMaint.cost}
                onChange={(e) => setNewMaint({ ...newMaint, cost: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Service Date</label>
              <input
                type="date"
                required
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                value={newMaint.serviceDate}
                onChange={(e) => setNewMaint({ ...newMaint, serviceDate: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setCreateModalOpen(false)}
              className="rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {submitting ? "Logging..." : "Log Maintenance"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}