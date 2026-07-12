import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8080/api",
});

// Attach the JWT to every outgoing request, if we have one
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = "Bearer " + token;
  }
  return config;
});

// If the backend ever returns 401, the token is dead — clear it
// so ProtectedRoute kicks the user back to /login on next render.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    return Promise.reject(error);
  }
);

export default apiClient;
