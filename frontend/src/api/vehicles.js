import client from "./client";

/**
 * @param {{status?: string, type?: string, region?: string}} filters
 */
export function getVehicles(filters = {}) {
  const params = {};
  if (filters.status) params.status = filters.status;
  if (filters.type) params.type = filters.type;
  if (filters.region) params.region = filters.region;
  return client.get("/vehicles", { params }).then((res) => res.data);
}

export function createVehicle(payload) {
  return client.post("/vehicles", payload).then((res) => res.data);
}

export function updateVehicle(id, payload) {
  return client.put(`/vehicles/${id}`, payload).then((res) => res.data);
}

export function deleteVehicle(id) {
  return client.delete(`/vehicles/${id}`).then((res) => res.data);
}