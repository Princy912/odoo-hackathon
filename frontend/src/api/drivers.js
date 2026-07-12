import client from "./client";

/**
 * @param {{status?: string}} filters
 */
export function getDrivers(filters = {}) {
  const params = {};
  if (filters.status) params.status = filters.status;
  return client.get("/drivers", { params }).then((res) => res.data);
}

export function createDriver(payload) {
  return client.post("/drivers", payload).then((res) => res.data);
}

export function updateDriver(id, payload) {
  return client.put(`/drivers/${id}`, payload).then((res) => res.data);
}

export function deleteDriver(id) {
  return client.delete(`/drivers/${id}`).then((res) => res.data);
}