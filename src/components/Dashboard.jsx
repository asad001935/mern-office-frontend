import { useEffect, useMemo, useState } from "react";
import { BarChart3, ClipboardList, Clock3, RefreshCcw, Store, Truck, Users } from "lucide-react";
import { toast } from "react-toastify";
import { getAllData, getOrders } from "../api/dashBoardApi";
import { getOrderAnalytics } from "../api/orderApi";
import { getSocket } from "../api/socket";
import AiAssistant from "./AiAssistant";

function StatCard({ title, value, tone, icon: Icon }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-slate-950">{value}</p>
        </div>
        <div className={`grid size-11 place-items-center rounded-lg ${tone}`}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ employees: [], officeBoys: [], restaurants: [] });
  const [orders, setOrders] = useState([]);
  const [analytics, setAnalytics] = useState({ totalOrders: 0, mostOrderedItems: [], peakTime: "No orders yet" });

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const [allData, orderData, analyticsData] = await Promise.all([
        getAllData(),
        getOrders(),
        getOrderAnalytics(),
      ]);
      setData({
        employees: allData.employees || [],
        officeBoys: allData.officeBoys || [],
        restaurants: allData.restaurants || [],
      });
      setOrders(orderData || []);
      setAnalytics(analyticsData || {});
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  useEffect(() => {
    const socket = getSocket();
    if (!socket.connected) socket.connect();
    const refresh = () => fetchDashboard();
    socket.on("order:new", refresh);
    socket.on("order:status", refresh);
    return () => {
      socket.off("order:new", refresh);
      socket.off("order:status", refresh);
    };
  }, []);

  const orderStats = useMemo(
    () => ({
      pending: orders.filter((order) => order.status === "pending").length,
      delivered: orders.filter((order) => order.status === "delivered").length,
      preparing: orders.filter((order) => order.status === "preparing").length,
      ready: orders.filter((order) => order.status === "ready").length,
    }),
    [orders],
  );
  const activeEmployees = data.employees.filter((employee) => !employee.isDeleted).length;
  const activeOfficeBoys = data.officeBoys.filter((officeBoy) => !officeBoy.isDeleted).length;
  const activeRestaurants = data.restaurants.filter((restaurant) => !restaurant.isDeleted).length;

  const latestOrders = orders.slice(0, 5);

  if (loading) {
    return <div className="rounded-lg border border-slate-200 bg-white p-6">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-950">Today at a glance</h2>
          <p className="mt-1 text-sm text-slate-500">Manage employees, restaurants, and order flow from one place.</p>
        </div>
        <button
          type="button"
          onClick={fetchDashboard}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          <RefreshCcw size={16} />
          Refresh
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Active Employees" value={activeEmployees} icon={Users} tone="bg-emerald-50 text-emerald-700" />
        <StatCard title="Active Office Boys" value={activeOfficeBoys} icon={Truck} tone="bg-sky-50 text-sky-700" />
        <StatCard title="Open Restaurants" value={activeRestaurants} icon={Store} tone="bg-amber-50 text-amber-700" />
        <StatCard title="Total Orders" value={orders.length} icon={ClipboardList} tone="bg-rose-50 text-rose-700" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <StatCard title="Admin Total Orders" value={analytics.totalOrders || 0} icon={BarChart3} tone="bg-indigo-50 text-indigo-700" />
        <StatCard title="Most Ordered Item" value={analytics.mostOrderedItems?.[0]?.itemName || "No data"} icon={ClipboardList} tone="bg-violet-50 text-violet-700" />
        <StatCard title="Peak Time" value={analytics.peakTime || "No data"} icon={Clock3} tone="bg-cyan-50 text-cyan-700" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-5 dark:border-slate-700">
            <h3 className="font-semibold text-slate-950 dark:text-white">Latest orders</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-3">Employee</th>
                  <th className="px-5 py-3">Items</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {latestOrders.map((order) => (
                  <tr key={order._id}>
                    <td className="px-5 py-4 font-medium text-slate-800 dark:text-slate-200">{order.userId?.userName || "Employee"}</td>
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-400">{order.items?.map((item) => `${item.itemName} x${item.quantity}`).join(", ")}</td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold capitalize text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-500 dark:text-slate-400">{new Date(order.createdAt).toLocaleTimeString()}</td>
                  </tr>
                ))}
                {latestOrders.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-5 py-8 text-center text-slate-500 dark:text-slate-400">No orders yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h3 className="font-semibold text-slate-950 dark:text-white">Order pipeline</h3>
          <div className="mt-5 space-y-4">
            {[
              ["Pending", orderStats.pending, "bg-amber-500"],
              ["Preparing", orderStats.preparing, "bg-sky-500"],
              ["Ready", orderStats.ready, "bg-indigo-500"],
              ["Delivered", orderStats.delivered, "bg-emerald-500"],
            ].map(([label, value, color]) => (
              <div key={label}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-medium text-slate-600 dark:text-slate-300">{label}</span>
                  <span className="text-slate-500 dark:text-slate-400">{value}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-700">
                  <div
                    className={`h-2 rounded-full ${color}`}
                    style={{ width: `${orders.length ? Math.max((value / orders.length) * 100, 8) : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <AiAssistant />
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h3 className="font-semibold text-slate-950 dark:text-white">Most ordered items</h3>
          <div className="mt-4 space-y-3">
            {(analytics.mostOrderedItems || []).map((item) => (
              <div key={item.itemName} className="flex items-center justify-between rounded-lg bg-slate-50 p-3 dark:bg-slate-700">
                <span className="font-medium text-slate-900 dark:text-white">{item.itemName}</span>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                  {item.quantity} ordered
                </span>
              </div>
            ))}
            {(!analytics.mostOrderedItems || analytics.mostOrderedItems.length === 0) && (
              <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500 dark:bg-slate-700 dark:text-slate-400">No item analytics yet.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
