import { useEffect, useState, useCallback } from "react";
import DriverFilters from "../components/drivers/DriverFilters";
import DriverTable from "../components/drivers/DriverTable";
import AddDriverModal from "../components/drivers/AddDriverModal";
import { getDrivers, createDriver } from "../api/drivers";

// NOTE for merge (Phase 3): same deal as Vehicles.jsx — Member 4 owns the
// route/page shell on feature/dashboard-reports, this is the real content.
export default function DriversPage() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ status: "" });
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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

  const handleAddDriver = async (formValues) => {
    setSubmitting(true);
    setError("");
    try {
      await createDriver(formValues);
      setModalOpen(false);
      await fetchDrivers();
    } catch (err) {
      setError(err.response?.data?.error || "Couldn't add driver. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Drivers</h1>
          <p className="text-sm text-slate-500">
            {drivers.length} driver{drivers.length === 1 ? "" : "s"} on record
          </p>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
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

      <DriverTable drivers={drivers} loading={loading} />

      <AddDriverModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAddDriver}
        submitting={submitting}
      />
    </div>
  );
}