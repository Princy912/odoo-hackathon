import { useEffect, useState } from "react";
import { getMaintenanceLogs, createMaintenance, closeMaintenance, updateMaintenance, deleteMaintenance } from "../api/maintenance";
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
  const [editingMaint, setEditingMaint] = useState(null);

  // Custom Delete Confirmation states
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [maintToDelete, setMaintToDelete] = useState(null);

  // Toast notifications state
  const [toast, setToast] = useState({ message: "", type: "" });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 4000);
  };

  // Form States
  const [maintForm, setMaintForm] = useState({
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

  const handleSaveMaint = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        vehicleId: Number(maintForm.vehicleId),
        type: maintForm.type,
        cost: Number(maintForm.cost),
        serviceDate: maintForm.serviceDate,
      };

      if (editingMaint) {
        await updateMaintenance(editingMaint.id, payload);
        showToast("Maintenance record updated successfully");
      } else {
        await createMaintenance(payload);
        showToast("Maintenance record logged successfully");
      }

      setCreateModalOpen(false);
      setEditingMaint(null);
      setMaintForm({
        vehicleId: "",
        type: "",
        cost: "",
        serviceDate: new Date().toISOString().split("T")[0],
      });
      await fetchData();
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || "Failed to save maintenance log.";
      setError(msg);
      showToast(msg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartEdit = (log) => {
    setEditingMaint(log);
    setMaintForm({
      vehicleId: log.vehicle?.id || "",
      type: log.type || "",
      cost: log.cost || "",
      serviceDate: log.serviceDate || "",
    });
    setCreateModalOpen(true);
  };

  const handleDeleteMaint = async (id) => {
    setError(null);
    try {
      await deleteMaintenance(id);
      showToast("Maintenance record deleted successfully");
      await fetchData();
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || "Failed to delete maintenance record.";
      setError(msg);
      showToast(msg, "error");
    }
  };

  const triggerDeleteConfirm = (id) => {
    setMaintToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleCloseMaint = async (id) => {
    setError(null);
    try {
      await closeMaintenance(id);
      showToast("Maintenance record closed successfully");
      await fetchData();
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || "Failed to close maintenance log.";
      setError(msg);
      showToast(msg, "error");
    }
  };

  const handleCloseModal = () => {
    setCreateModalOpen(false);
    setEditingMaint(null);
    setMaintForm({
      vehicleId: "",
      type: "",
      cost: "",
      serviceDate: new Date().toISOString().split("T")[0],
    });
  };

  // Only show vehicles that are AVAILABLE or currently assigned to the log being edited
  const availableVehicles = vehicles.filter(
    (v) => v.status === "AVAILABLE" || (editingMaint && v.id === editingMaint.vehicle?.id)
  );

  return (
    <div className="space-y-6">
      {/* Toast popup */}
      {toast.message && (
        <div
          className={`fixed top-4 right-4 z-50 rounded-lg px-4 py-3 text-sm font-semibold shadow-md transition-all duration-300 ${
            toast.type === "error"
              ? "bg-rose-50 text-rose-800 border border-rose-200"
              : "bg-emerald-50 text-emerald-800 border border-emerald-200"
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Maintenance Logs</h1>
          <p className="text-sm text-gray-500">
            Log services, track repairs, and manage in-shop vehicle lifecycles.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingMaint(null);
            setCreateModalOpen(true);
          }}
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
                      <div className="flex justify-end gap-2">
                        {log.status === "ACTIVE" && (
                          <button
                            onClick={() => handleCloseMaint(log.id)}
                            className="rounded bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors"
                          >
                            Close
                          </button>
                        )}
                        <button
                          onClick={() => handleStartEdit(log)}
                          className="rounded bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
                        >
                          Edit
                        </button>
                         <button
                          onClick={() => triggerDeleteConfirm(log.id)}
                          className="rounded bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* CREATE/EDIT MAINTENANCE MODAL */}
      <Modal open={createModalOpen} title={editingMaint ? "Edit Maintenance Log" : "Log Vehicle Maintenance"} onClose={handleCloseModal}>
        <form onSubmit={handleSaveMaint} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Vehicle</label>
            <select
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
              value={maintForm.vehicleId}
              onChange={(e) => setMaintForm({ ...maintForm, vehicleId: e.target.value })}
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
              value={maintForm.type}
              onChange={(e) => setMaintForm({ ...maintForm, type: e.target.value })}
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
                value={maintForm.cost}
                onChange={(e) => setMaintForm({ ...maintForm, cost: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Service Date</label>
              <input
                type="date"
                required
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                value={maintForm.serviceDate}
                onChange={(e) => setMaintForm({ ...maintForm, serviceDate: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleCloseModal}
              className="rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {submitting ? "Saving..." : (editingMaint ? "Save changes" : "Log Maintenance")}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        open={deleteConfirmOpen}
        title="Delete Maintenance Log"
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Are you sure you want to delete this maintenance record? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setDeleteConfirmOpen(false)}
              className="rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={async () => {
                setDeleteConfirmOpen(false);
                if (maintToDelete) {
                  await handleDeleteMaint(maintToDelete);
                }
              }}
              className="rounded-md bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}