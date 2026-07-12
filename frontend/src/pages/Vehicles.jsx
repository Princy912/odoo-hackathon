import { useEffect, useMemo, useState, useCallback } from "react";
import VehicleFilters from "../components/vehicles/VehicleFilters";
import VehicleTable from "../components/vehicles/VehicleTable";
import AddVehicleModal from "../components/vehicles/AddVehicleModal";
import { getVehicles, createVehicle } from "../api/vehicles";

// NOTE for merge (Phase 3): Member 4 owns the page shell / Layout / routing
// on feature/dashboard-reports (route "/vehicles" already points somewhere).
// This component is the real page content — swap Member 4's placeholder
// for this default export once branches merge.
export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ status: "", type: "", region: "" });
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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

  // Type/region are free-text fields on the backend, not enums — derive the
  // filter dropdown options from whatever's actually in the data so far.
  const typeOptions = useMemo(
    () => uniqueSorted(vehicles.map((v) => v.type)),
    [vehicles]
  );
  const regionOptions = useMemo(
    () => uniqueSorted(vehicles.map((v) => v.region)),
    [vehicles]
  );

  const handleAddVehicle = async (formValues) => {
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
      await createVehicle(payload);
      setModalOpen(false);
      await fetchVehicles();
    } catch (err) {
      setError(err.response?.data?.error || "Couldn't add vehicle. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Vehicles</h1>
          <p className="text-sm text-slate-500">
            {vehicles.length} vehicle{vehicles.length === 1 ? "" : "s"} in the fleet
          </p>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
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

      <VehicleTable vehicles={vehicles} loading={loading} />

      <AddVehicleModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAddVehicle}
        submitting={submitting}
      />
    </div>
  );
}

function uniqueSorted(values) {
  return [...new Set(values.filter(Boolean))].sort();
}