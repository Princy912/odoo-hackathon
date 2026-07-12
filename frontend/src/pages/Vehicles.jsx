import { useEffect, useMemo, useState, useCallback } from "react";
import VehicleFilters from "../components/vehicles/VehicleFilters";
import VehicleTable from "../components/vehicles/VehicleTable";
import AddVehicleModal from "../components/vehicles/AddVehicleModal";
import Modal from "../components/common/Modal";
import { getVehicles, createVehicle, updateVehicle, deleteVehicle } from "../api/vehicles";

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ status: "", type: "", region: "" });
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  
  // Custom Delete Confirmation states
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);
  
  // Toast notifications state
  const [toast, setToast] = useState({ message: "", type: "" });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 4000);
  };

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getVehicles(filters);
      setVehicles(data);
    } catch (err) {
      setError(
        err.response?.data?.error || "Couldn't load vehicles. Is the backend running?"
      );
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const typeOptions = useMemo(
    () => uniqueSorted(vehicles.map((v) => v.type)),
    [vehicles]
  );
  const regionOptions = useMemo(
    () => uniqueSorted(vehicles.map((v) => v.region)),
    [vehicles]
  );

  const handleAddOrEditVehicle = async (formValues) => {
    setSubmitting(true);
    setError("");
    try {
      const payload = {
        ...formValues,
        maxLoadCapacity: Number(formValues.maxLoadCapacity),
        odometer: formValues.odometer === "" ? null : Number(formValues.odometer),
        acquisitionCost:
          formValues.acquisitionCost === "" ? null : Number(formValues.acquisitionCost),
      };

      if (editingVehicle) {
        payload.status = editingVehicle.status; // Keep existing status unless explicitly changed in table
        await updateVehicle(editingVehicle.id, payload);
        showToast("Vehicle updated successfully");
      } else {
        await createVehicle(payload);
        showToast("Vehicle registered successfully");
      }
      setModalOpen(false);
      setEditingVehicle(null);
      await fetchVehicles();
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || "Couldn't save vehicle. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setModalOpen(true);
  };

  const handleDeleteVehicle = async (id) => {
    try {
      await deleteVehicle(id);
      showToast("Vehicle deleted successfully");
      await fetchVehicles();
    } catch (err) {
      showToast(err.response?.data?.error || err.response?.data?.message || "Failed to delete vehicle", "error");
    }
  };

  const triggerDeleteConfirm = (id) => {
    setVehicleToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleChangeStatus = async (id, newStatus) => {
    try {
      const vehicle = vehicles.find((v) => v.id === id);
      if (!vehicle) return;
      await updateVehicle(id, { ...vehicle, status: newStatus });
      showToast(`Vehicle status changed to ${newStatus}`);
      await fetchVehicles();
    } catch (err) {
      showToast(err.response?.data?.error || err.response?.data?.message || "Failed to change status", "error");
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingVehicle(null);
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
          <h1 className="text-xl font-semibold text-slate-900">Vehicles</h1>
          <p className="text-sm text-slate-500">
            {vehicles.length} vehicle{vehicles.length === 1 ? "" : "s"} in the fleet
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingVehicle(null);
            setModalOpen(true);
          }}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          + Add vehicle
        </button>
      </div>

      <VehicleFilters
        filters={filters}
        onChange={setFilters}
        typeOptions={typeOptions}
        regionOptions={regionOptions}
      />

      {error && (
        <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <VehicleTable
        vehicles={vehicles}
        loading={loading}
        onEdit={handleStartEdit}
        onDelete={triggerDeleteConfirm}
        onChangeStatus={handleChangeStatus}
      />

      <AddVehicleModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleAddOrEditVehicle}
        submitting={submitting}
        vehicle={editingVehicle}
      />

      <Modal
        open={deleteConfirmOpen}
        title="Delete Vehicle"
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Are you sure you want to delete this vehicle? This action cannot be undone.
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
                if (vehicleToDelete) {
                  await handleDeleteVehicle(vehicleToDelete);
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

function uniqueSorted(values) {
  return [...new Set(values.filter(Boolean))].sort();
}