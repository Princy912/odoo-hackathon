import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/dashboard", label: "Dashboard", glyph: "◧" },
  { to: "/vehicles", label: "Vehicles", glyph: "▤" },
  { to: "/drivers", label: "Drivers", glyph: "◍" },
  { to: "/trips", label: "Trips", glyph: "↝" },
  { to: "/maintenance", label: "Maintenance", glyph: "✚" },
  { to: "/reports", label: "Reports", glyph: "▥" },
];

function roleLabel(role) {
  if (!role) return "";
  return role
    .toLowerCase()
    .split("_")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  
  const name = user?.name || "Loading...";
  const role = user?.role || "";

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900">
      {/* Sidebar */}
      <aside className="hidden w-60 flex-col bg-slate-900 text-slate-200 md:flex">
        <div className="flex items-center gap-2 px-5 py-5 border-b border-slate-800">
          <span className="flex h-8 w-8 items-center justify-center rounded bg-amber-400 font-mono text-sm font-bold text-slate-900">
            TO
          </span>
          <span className="font-mono text-sm tracking-widest text-slate-100">
            TRANSITOPS
          </span>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-amber-400 text-slate-900"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <span aria-hidden="true" className="w-4 text-center font-mono">
                {item.glyph}
              </span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-800 px-5 py-4 font-mono text-[11px] uppercase tracking-wide text-slate-500">
          Depot build · Phase 1
        </div>
      </aside>

      {/* Main column */}
      <div className="flex flex-1 flex-col">
        {/* Top navbar */}
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 md:px-8">
          <span className="font-mono text-xs uppercase tracking-widest text-slate-400 md:hidden">
            TransitOps
          </span>
          <div className="hidden text-sm text-slate-500 md:block">
            Fleet operations console
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right leading-tight">
              <div className="text-sm font-semibold text-slate-800">
                {name}
              </div>
              <div className="font-mono text-[11px] uppercase tracking-wide text-amber-600">
                {roleLabel(role)}
              </div>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 font-mono text-xs font-semibold text-white">
              {name
                .split(" ")
                .map((n) => n ? n[0] : "")
                .join("")}
            </span>
            <button
              onClick={logout}
              title="Sign Out"
              className="ml-2 px-2.5 py-1 text-slate-500 hover:text-slate-900 border border-slate-200 hover:border-slate-300 rounded text-xs font-semibold cursor-pointer transition-all"
            >
              Sign Out
            </button>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}