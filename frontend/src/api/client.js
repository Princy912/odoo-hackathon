import axios from "axios";

// Shared axios instance for the whole app.
// Backend runs on http://localhost:8080 (Spring Boot default port, unchanged
// from Phase 0 scaffold), all REST endpoints are under /api.
const client = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// NOTE for merge (Phase 3, after feature/auth lands): once JWT auth is wired,
// add a request interceptor here that reads the token out of localStorage
// (AuthContext, owned by Member 4) and sets the Authorization header, e.g.:
//
// client.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

export default client;