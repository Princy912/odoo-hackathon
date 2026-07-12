import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Vehicles from "./pages/Vehicles";
import Drivers from "./pages/Drivers";
import Trips from "./pages/Trips";
import Maintenance from "./pages/Maintenance.jsx";
import Reports from "./pages/Reports.jsx";

function withLayout(page) {
  return (
    <ProtectedRoute>
      <Layout>{page}</Layout>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/dashboard" element={withLayout(<Dashboard />)} />
          <Route path="/vehicles" element={withLayout(<Vehicles />)} />
          <Route path="/drivers" element={withLayout(<Drivers />)} />
          <Route path="/trips" element={withLayout(<Trips />)} />
          <Route path="/maintenance" element={withLayout(<Maintenance />)} />
          <Route path="/reports" element={withLayout(<Reports />)} />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}