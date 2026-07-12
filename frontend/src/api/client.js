import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Phase 3: attach the JWT (owned by Member 4's AuthContext, stored under
// localStorage key "token" — CONFIRM this key matches AuthContext exactly,
// since a mismatch here fails silently as 401s with no obvious cause).
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("transitops_token");
  if (token) {
    config.headers.Authorization = "Bearer " + token;
  }
  return config;
});

// If the token is missing/expired, the backend returns 401/403. Bounce back
// to /login rather than showing a silent failed table. Member 4's
// ProtectedRoute handles the initial gate; this covers a token that expires
// mid-session.
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem("transitops_token");
      localStorage.removeItem("transitops_role");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default client;
