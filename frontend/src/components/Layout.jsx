import { useState } from "react";
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const name = user?.name || "User";
  const role = user?.role || "";
  const email = user?.email || "";

  const initials = name
    .split(" ")
    .map((n) => (n ? n[0] : ""))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900 relative font-sans">
      
      {/* MOBILE SIDEBAR DRAWER OVERLAY */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-900/60 backdrop-blur-sm md:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR (Desktop & Mobile Drawer) */}
      <aside 
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-gray-900 text-gray-200 transform transition-transform duration-300 md:translate-x-0 md:static md:flex ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-amber-500 text-white font-bold flex items-center justify-center text-sm shadow-md">
              TO
            </div>
            <span className="font-semibold tracking-wider text-gray-100 text-sm">
              TRANSITOPS
            </span>
          </div>
          {/* Close Sidebar button for mobile */}
          <button 
            type="button" 
            className="text-gray-400 hover:text-white md:hidden focus:outline-none"
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </button>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-1 space-y-1.5 px-4 py-6 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-amber-500 text-white shadow-md shadow-amber-500/10"
                    : "text-gray-400 hover:bg-gray-800 hover:text-gray-100"
                }`
              }
            >
              <span aria-hidden="true" className="w-5 text-center font-mono text-base">
                {item.glyph}
              </span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-gray-800 px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-gray-500">
          Depot Build · v1.2
        </div>
      </aside>

      {/* MAIN MAIN VIEW CONTAINER */}
      <div className="flex flex-1 flex-col min-w-0">
        
        {/* TOP NAVBAR HEADER */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 shadow-sm">
          
          {/* Left Side: Hamburger & Title */}
          <div className="flex items-center gap-4">
            {/* Hamburger Toggle Button */}
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 focus:outline-none md:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <span className="text-xl font-bold">☰</span>
            </button>
            <div className="hidden text-sm font-medium text-gray-500 md:block">
              Fleet operations console
            </div>
          </div>

          {/* Right Side: Profile Dropdown Menu */}
          <div className="relative">
            <button
              type="button"
              className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-gray-50 focus:outline-none transition-colors duration-200 text-left"
              onClick={() => setProfileOpen(!profileOpen)}
            >
              <div className="hidden text-right leading-tight md:block pr-1">
                <div className="text-sm font-semibold text-gray-800">
                  {name}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-amber-600 font-bold">
                  {roleLabel(role)}
                </div>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800 font-mono text-xs font-semibold text-white shadow-sm">
                {initials}
              </div>
            </button>

            {/* FLOATING DROPDOWN CARD */}
            {profileOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setProfileOpen(false)} 
                />
                <div className="absolute right-0 mt-2.5 w-60 origin-top-right rounded-xl border border-gray-100 bg-white p-4 shadow-xl ring-1 ring-black/5 z-20 transition-all">
                  <div className="pb-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900 truncate">{name}</p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">{email}</p>
                    <span className="inline-block mt-2 rounded bg-amber-50 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-amber-700 font-bold ring-1 ring-inset ring-amber-600/10">
                      {roleLabel(role)}
                    </span>
                  </div>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setProfileOpen(false);
                        logout();
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors duration-200 cursor-pointer"
                    >
                      <span>➔</span> Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </header>

        {/* PAGE CONTENT CONTAINER (Clean spacing between menu and pages) */}
        <main className="flex-1 overflow-y-auto px-6 py-8 md:px-10 bg-gray-50/50">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}