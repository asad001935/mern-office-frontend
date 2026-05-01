import { useEffect, useMemo, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Building2,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  PlusCircle,
  Settings,
  Store,
  Truck,
  User,
  Users,
  X,
} from "lucide-react";
import { toast } from "react-toastify";
import NotificationBell from "../components/NotificationBell";
import ThemeToggle from "../components/ThemeToggle";
import { getSocket } from "../api/socket";

const iconMap = {
  dashboard: LayoutDashboard,
  orders: ClipboardList,
  employees: Users,
  officeBoys: Truck,
  restaurants: Store,
  createOrder: PlusCircle,
  settings: Settings,
};

const titles = {
  "/dashboard": "Admin Dashboard",
  "/orders": "Order Control",
  "/employees": "Employees",
  "/officeboy": "Office Boys",
  "/restaurants": "Restaurants",
  "/settings": "Settings",
  "/employee": "Employee Dashboard",
  "/employee/create-order": "Create Order",
  "/employee/orders": "My Orders",
  "/office-boy": "Delivery Dashboard",
  "/office-boy/orders": "Pending Deliveries",
};

export default function AppShell({ role, navItems }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || {};
    } catch {
      return {};
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket.connected) socket.connect();

    const pushNotification = (payload) => {
      const message = payload?.message || "Order update received";
      setNotifications((current) => [
        {
          id: `${Date.now()}-${Math.random()}`,
          message,
          time: new Date().toLocaleTimeString(),
        },
        ...current,
      ]);
      toast.info(message);
    };

    socket.on("order:new", pushNotification);
    socket.on("order:status", pushNotification);

    return () => {
      socket.off("order:new", pushNotification);
      socket.off("order:status", pushNotification);
    };
  }, []);

  const closeMobile = () => {
    if (window.innerWidth < 1024) setOpen(false);
  };

  const roleLabel =
    role === "Admin" ? "Admin workspace" : role === "Employee" ? "Employee desk" : "Delivery desk";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {open && (
        <button
          aria-label="Close sidebar overlay"
          className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-200 dark:border-slate-800 dark:bg-slate-900 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-lg bg-emerald-600 text-white">
              <Building2 size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold leading-5">Office Lunch</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{roleLabel}</p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={() => setOpen(false)}
            className="grid size-9 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {navItems.map((item) => {
            const Icon = iconMap[item.icon] || LayoutDashboard;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={closeMobile}
                className={({ isActive }) =>
                  `flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                  }`
                }
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-slate-200 p-4 dark:border-slate-800">
          <div className="mb-3 flex items-center gap-3 rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
            <div className="grid size-9 place-items-center rounded-lg bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-100">
              <User size={18} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{user.userName || role}</p>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user.role || role}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-3 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-700"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              aria-label="Open sidebar"
              onClick={() => setOpen(true)}
              className="grid size-10 place-items-center rounded-lg border border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-200 lg:hidden"
            >
              <Menu size={20} />
            </button>
            <div className="min-w-0">
              <h1 className="truncate text-base font-semibold sm:text-lg">
                {titles[location.pathname] || "Office System"}
              </h1>
              <p className="hidden text-xs text-slate-500 dark:text-slate-400 sm:block">
                Lunch ordering window: 2:00 PM to 3:00 PM. Delivery window: 3:00 PM to 4:00 PM.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle theme={theme} onToggle={() => setTheme((value) => (value === "dark" ? "light" : "dark"))} />
            <NotificationBell notifications={notifications} onClear={() => setNotifications([])} />
            <div className="hidden rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 sm:block">
              {new Date().toLocaleDateString()}
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
