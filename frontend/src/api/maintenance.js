import client from "./client";

export function getMaintenanceLogs() {
  return client.get("/maintenance").then((res) => res.data);
}

export function createMaintenance(payload) {
  return client.post("/maintenance", payload).then((res) => res.data);
}

export function closeMaintenance(id) {
  return client.put(`/maintenance/${id}/close`).then((res) => res.data);
}
