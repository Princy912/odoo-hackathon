import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/vehicles", label: "Vehicles" },
  { to: "/drivers", label: "Drivers" },
  { to: "/trips", label: "Trips" },
  { to: "/maintenance", label: "Maintenance" },
  { to: "/reports", label: "Reports" },
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-56 bg-gray-900 text-gray-200 flex flex-col">
        <div className="flex items-center gap-2 px-5 py-5">
          <div className="w-7 h-7 rounded-md bg-amber-500 text-white font-bold flex items-center justify-center text-xs">
            TO
          </div>
          <span className="font-semibold text-sm tracking-wide text-white">
            TRANSITOPS
          </span>
        </div>

        <nav className="flex-1 px-2 space-y-1">
          {NAV_ITEMS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-gray-800 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main column */}
      <div className="flex-1 flex flex-col">
        {/* Top navbar */}
        <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-end px-6 gap-4">
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">
              {user?.name ?? "Fleet Manager"}
            </div>
            <div className="text-xs text-gray-400">
              {user?.role ?? "FLEET_MANAGER"}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs font-medium text-gray-500 hover:text-gray-900 border border-gray-200 rounded-lg px-3 py-1.5"
          >
            Log out
          </button>
        </header>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}