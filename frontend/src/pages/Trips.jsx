import { useEffect, useState } from "react";
import { getTrips, createTrip, dispatchTrip, completeTrip, cancelTrip } from "../api/trips";
import { getVehicles } from "../api/vehicles";
import { getDrivers } from "../api/drivers";
import StatusBadge from "../components/common/StatusBadge";
import Modal from "../components/common/Modal";

const tripStatusColors = {
  DRAFT: "bg-gray-100 text-gray-700 ring-gray-600/20",
  DISPATCHED: "bg-sky-50 text-sky-700 ring-sky-600/20",
  COMPLETED: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  CANCELLED: "bg-rose-50 text-rose-700 ring-rose-600/20",
};

export default function Trips() {
  const [trips, setTrips] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal States
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState(null);

  // Form States
  const [newTrip, setNewTrip] = useState({
    source: "",
    destination: "",
    vehicleId: "",
    driverId: "",
    cargoWeight: "",
    plannedDistance: "",
  });

  const [completionData, setCompletionData] = useState({
    actualDistance: "",
    fuelConsumed: "",
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    setError(null);
    try {
      const [tripsData, vehiclesData, driversData] = await Promise.all([
        getTrips(),
        getVehicles(),
        getDrivers(),
      ]);
      setTrips(tripsData);
      setVehicles(vehiclesData);
      setDrivers(driversData);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || "Failed to load data from backend.");
    } finally {
      setLoading(false);
    }
  }

  const handleCreateTrip = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        ...newTrip,
        vehicleId: Number(newTrip.vehicleId),
        driverId: Number(newTrip.driverId),
        cargoWeight: Number(newTrip.cargoWeight),
        plannedDistance: Number(newTrip.plannedDistance),
      };
      await createTrip(payload);
      setCreateModalOpen(false);
      setNewTrip({
        source: "",
        destination: "",
        vehicleId: "",
        driverId: "",
        cargoWeight: "",
        plannedDistance: "",
      });
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || "Failed to create trip.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDispatch = async (id) => {
    setError(null);
    try {
      await dispatchTrip(id);
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || "Failed to dispatch trip.");
    }
  };

  const handleCancel = async (id) => {
    setError(null);
    try {
      await cancelTrip(id);
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || "Failed to cancel trip.");
    }
  };

  const openCompleteModal = (id) => {
    setSelectedTripId(id);
    setCompletionData({ actualDistance: "", fuelConsumed: "" });
    setCompleteModalOpen(true);
  };

  const handleCompleteTrip = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        actualDistance: Number(completionData.actualDistance),
        fuelConsumed: Number(completionData.fuelConsumed),
      };
      await completeTrip(selectedTripId, payload);
      setCompleteModalOpen(false);
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || "Failed to complete trip.");
    } finally {
      setSubmitting(false);
    }
  };

  // Keep dropdown choices list clean (only ACTIVE/AVAILABLE status)
  const availableVehicles = vehicles.filter(v => v.status === "AVAILABLE");
  const availableDrivers = drivers.filter(d => d.status === "AVAILABLE");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Trips</h1>
          <p className="text-sm text-gray-500">
            Monitor routes, dispatch drivers, and complete fleet trips.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCreateModalOpen(true)}
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 transition-colors"
        >
          + Create Trip
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
                <th className="px-6 py-3">Route</th>
                <th className="px-6 py-3">Vehicle</th>
                <th className="px-6 py-3">Driver</th>
                <th className="px-6 py-3">Cargo Weight</th>
                <th className="px-6 py-3">Planned Dist.</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {trips.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-10 text-center text-gray-400">
                    No trips logged. Click "+ Create Trip" to add one.
                  </td>
                </tr>
              ) : (
                trips.map((trip) => (
                  <tr key={trip.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{trip.source}</div>
                      <div className="text-xs text-gray-400">to {trip.destination}</div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-700">
                      {trip.vehicle?.regNumber || `ID: ${trip.vehicle?.id}`}
                    </td>
                    <td className="px-6 py-4 text-gray-900">
                      {trip.driver?.name || `ID: ${trip.driver?.id}`}
                    </td>
                    <td className="px-6 py-4">
                      {trip.cargoWeight} kg
                    </td>
                    <td className="px-6 py-4">
                      {trip.plannedDistance} km
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={trip.status} colorMap={tripStatusColors} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {trip.status === "DRAFT" && (
                          <button
                            onClick={() => handleDispatch(trip.id)}
                            className="rounded bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700 hover:bg-sky-100 transition-colors"
                          >
                            Dispatch
                          </button>
                        )}
                        {trip.status === "DISPATCHED" && (
                          <button
                            onClick={() => openCompleteModal(trip.id)}
                            className="rounded bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors"
                          >
                            Complete
                          </button>
                        )}
                        {(trip.status === "DRAFT" || trip.status === "DISPATCHED") && (
                          <button
                            onClick={() => handleCancel(trip.id)}
                            className="rounded bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* CREATE TRIP MODAL */}
      <Modal open={createModalOpen} title="Create Trip" onClose={() => setCreateModalOpen(false)}>
        <form onSubmit={handleCreateTrip} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Source</label>
              <input
                type="text"
                required
                placeholder="e.g. Warehouse A"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                value={newTrip.source}
                onChange={(e) => setNewTrip({ ...newTrip, source: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Destination</label>
              <input
                type="text"
                required
                placeholder="e.g. Retail Depot B"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                value={newTrip.destination}
                onChange={(e) => setNewTrip({ ...newTrip, destination: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Vehicle</label>
              <select
                required
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                value={newTrip.vehicleId}
                onChange={(e) => setNewTrip({ ...newTrip, vehicleId: e.target.value })}
              >
                <option value="">Select Vehicle</option>
                {availableVehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.regNumber} ({v.model})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Driver</label>
              <select
                required
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                value={newTrip.driverId}
                onChange={(e) => setNewTrip({ ...newTrip, driverId: e.target.value })}
              >
                <option value="">Select Driver</option>
                {availableDrivers.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Cargo Weight (kg)</label>
              <input
                type="number"
                required
                placeholder="e.g. 2500"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                value={newTrip.cargoWeight}
                onChange={(e) => setNewTrip({ ...newTrip, cargoWeight: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Planned Distance (km)</label>
              <input
                type="number"
                required
                placeholder="e.g. 120"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                value={newTrip.plannedDistance}
                onChange={(e) => setNewTrip({ ...newTrip, plannedDistance: e.target.value })}
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
              {submitting ? "Creating..." : "Create Trip"}
            </button>
          </div>
        </form>
      </Modal>

      {/* COMPLETE TRIP MODAL */}
      <Modal open={completeModalOpen} title="Complete Trip" onClose={() => setCompleteModalOpen(false)}>
        <form onSubmit={handleCompleteTrip} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Actual Distance (km)</label>
              <input
                type="number"
                step="any"
                required
                placeholder="e.g. 84.2"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                value={completionData.actualDistance}
                onChange={(e) => setCompletionData({ ...completionData, actualDistance: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Fuel Consumed (Liters)</label>
              <input
                type="number"
                step="any"
                required
                placeholder="e.g. 18.5"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                value={completionData.fuelConsumed}
                onChange={(e) => setCompletionData({ ...completionData, fuelConsumed: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setCompleteModalOpen(false)}
              className="rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {submitting ? "Completing..." : "Complete Trip"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}