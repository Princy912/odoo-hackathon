import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import PlaceholderPage from "./pages/PlaceholderPage";

// /login is intentionally rendered outside Layout (no sidebar/navbar on the
// auth screen). Real login form + ProtectedRoute wrapper arrive in Phase 2.
function LoginPlaceholder() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <div className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded bg-amber-400 font-mono text-sm font-bold text-slate-900">
            TO
          </span>
          <span className="font-mono text-sm tracking-widest text-slate-800">
            TRANSITOPS
          </span>
        </div>
        <p className="text-sm text-slate-500">
          Login form ships in Phase 2 (react-hook-form + POST /api/auth/login).
        </p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPlaceholder />} />

        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
        <Route
          path="/vehicles"
          element={
            <Layout>
              <PlaceholderPage title="Vehicles" />
            </Layout>
          }
        />
        <Route
          path="/drivers"
          element={
            <Layout>
              <PlaceholderPage title="Drivers" />
            </Layout>
          }
        />
        <Route
          path="/trips"
          element={
            <Layout>
              <PlaceholderPage title="Trips" />
            </Layout>
          }
        />
        <Route
          path="/maintenance"
          element={
            <Layout>
              <PlaceholderPage title="Maintenance" />
            </Layout>
          }
        />
        <Route
          path="/reports"
          element={
            <Layout>
              <PlaceholderPage title="Reports" />
            </Layout>
          }
        />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}