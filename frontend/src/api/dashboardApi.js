import apiClient from "./client";

// Calls GET /api/dashboard/kpis. Returns the KPI object as shaped by
// DashboardService: { activeVehicles, availableVehicles,
// vehiclesInMaintenance, activeTrips, pendingTrips, driversOnDuty,
// fleetUtilization }
export async function fetchDashboardKpis() {
  const { data } = await apiClient.get("/dashboard/kpis");
  return data;
}