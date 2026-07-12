import client from "./client";

export function getTrips() {
  return client.get("/trips").then((res) => res.data);
}

export function createTrip(payload) {
  return client.post("/trips", payload).then((res) => res.data);
}

export function dispatchTrip(id) {
  return client.put(`/trips/${id}/dispatch`).then((res) => res.data);
}

export function completeTrip(id, payload) {
  return client.put(`/trips/${id}/complete`, payload).then((res) => res.data);
}

export function cancelTrip(id) {
  return client.put(`/trips/${id}/cancel`).then((res) => res.data);
}

export function updateTrip(id, payload) {
  return client.put(`/trips/${id}`, payload).then((res) => res.data);
}

export function deleteTrip(id) {
  return client.delete(`/trips/${id}`).then((res) => res.data);
}
