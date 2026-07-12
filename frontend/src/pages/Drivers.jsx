import { useEffect, useState, useCallback } from "react";
import DriverFilters from "../components/drivers/DriverFilters";
import DriverTable from "../components/drivers/DriverTable";
import AddDriverModal from "../components/drivers/AddDriverModal";
import Modal from "../components/common/Modal";
import { getDrivers, createDriver, updateDriver, deleteDriver } from "../api/drivers";

export default function DriversPage() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ status: "" });
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);

  // Custom Delete Confirmation states
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [driverToDelete, setDriverToDelete] = useState(null);

  // Toast notifications state
  const [toast, setToast] = useState({ message: "", type: "" });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 4000);
  };

  const fetchDrivers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getDrivers(filters);
      setDrivers(data);
    } catch (err) {
      setError(
        err.response?.data?.error || "Couldn't load drivers. Is the backend running?"
      );
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);

  const handleAddOrEditDriver = async (formValues) => {
    setSubmitting(true);
    setError("");
    try {
      if (editingDriver) {
        const payload = {
          ...editingDriver,
          ...formValues,
        };
        await updateDriver(editingDriver.id, payload);
        showToast("Driver updated successfully");
      } else {
        await createDriver(formValues);
        showToast("Driver registered successfully");
      }
      setModalOpen(false);
      setEditingDriver(null);
      await fetchDrivers();
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || "Couldn't save driver. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartEdit = (driver) => {
    setEditingDriver(driver);
    setModalOpen(true);
  };

  const handleDeleteDriver = async (id) => {
    try {
      await deleteDriver(id);
      showToast("Driver deleted successfully");
      await fetchDrivers();
    } catch (err) {
      showToast(err.response?.data?.error || err.response?.data?.message || "Failed to delete driver", "error");
    }
  };

  const triggerDeleteConfirm = (id) => {
    setDriverToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleChangeStatus = async (id, newStatus) => {
    try {
      const driver = drivers.find((d) => d.id === id);
      if (!driver) return;
      await updateDriver(id, { ...driver, status: newStatus });
      showToast(`Driver status changed to ${newStatus}`);
      await fetchDrivers();
    } catch (err) {
      showToast(err.response?.data?.error || err.response?.data?.message || "Failed to change status", "error");
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingDriver(null);
  };

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
          <h1 className="text-xl font-semibold text-slate-900">Drivers</h1>
          <p className="text-sm text-slate-500">
            {drivers.length} driver{drivers.length === 1 ? "" : "s"} on record
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingDriver(null);
            setModalOpen(true);
          }}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          + Add driver
        </button>
      </div>

      <DriverFilters filters={filters} onChange={setFilters} />

      {error && (
        <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <DriverTable
        drivers={drivers}
        loading={loading}
        onEdit={handleStartEdit}
        onDelete={triggerDeleteConfirm}
        onChangeStatus={handleChangeStatus}
      />

      <AddDriverModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleAddOrEditDriver}
        submitting={submitting}
        driver={editingDriver}
      />

      <Modal
        open={deleteConfirmOpen}
        title="Delete Driver"
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Are you sure you want to delete this driver? This action cannot be undone.
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
                if (driverToDelete) {
                  await handleDeleteDriver(driverToDelete);
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