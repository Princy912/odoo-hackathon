import { createContext, useContext, useEffect, useState } from "react";
import apiClient from "../api/client";

const TOKEN_KEY = "transitops_token";
const ROLE_KEY = "transitops_role";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [role, setRole] = useState(() => localStorage.getItem(ROLE_KEY));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Keep localStorage in sync any time the token changes (login/logout).
  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }, [token]);

  useEffect(() => {
    if (role) {
      localStorage.setItem(ROLE_KEY, role);
    } else {
      localStorage.removeItem(ROLE_KEY);
    }
  }, [role]);

  async function login(email, password) {
    setIsLoading(true);
    setError(null);
    try {
      // Backend contract per feature/auth: POST /api/auth/login
      // returns { token, role } in the response body.
      const { data } = await apiClient.post("/auth/login", {
        email,
        password,
      });
      setToken(data.token);
      setRole(data.role);
      return true;
    } catch (err) {
      setError(
        err.response?.data?.message ?? "Login failed. Check your credentials."
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  function logout() {
    setToken(null);
    setRole(null);
  }

  const value = {
    token,
    role,
    isAuthenticated: Boolean(token),
    isLoading,
    error,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return ctx;
}