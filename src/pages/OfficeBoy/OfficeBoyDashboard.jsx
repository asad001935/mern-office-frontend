import { useEffect, useMemo, useState } from "react";
import { ClipboardList, PackageCheck, Truck } from "lucide-react";
import { toast } from "react-toastify";
import { getOfficeBoyOrders } from "../../api/orderApi";
import { getSocket } from "../../api/socket";
import AiAssistant from "../../components/AiAssistant";

function Stat({ label, value, icon: Icon, tone }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">{value}</p>
        </div>
        <div className={`grid size-11 place-items-center rounded-lg ${tone}`}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

export default function OfficeBoyDashboard() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      setOrders(await getOfficeBoyOrders());
    } catch (error) {
      toast.info(error.response?.data?.message || "Pending orders are available after 3 PM");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    const socket = getSocket();
    if (!socket.connected) socket.connect();
    const refresh = () => fetchOrders();
    socket.on("order:new", refresh);
    socket.on("order:status", refresh);
    return () => {
      socket.off("order:new", refresh);
      socket.off("order:status", refresh);
    };
  }, []);

  const stats = useMemo(
    () => ({
      pending: orders.filter((order) => order.status === "pending").length,
      accepted: orders.filter((order) => order.status === "accepted").length,
      delivered: orders.filter((order) => order.status === "delivered").length,
    }),
    [orders],
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-950 dark:text-white">Delivery dashboard</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">View pending orders after 3 PM and mark delivered after handoff.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Pending Orders" value={stats.pending} icon={ClipboardList} tone="bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" />
        <Stat label="Accepted" value={stats.accepted} icon={Truck} tone="bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400" />
        <Stat label="Delivered" value={stats.delivered} icon={PackageCheck} tone="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" />
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <h3 className="font-semibold text-slate-950 dark:text-white">Delivery queue preview</h3>
        <div className="mt-4 space-y-3">
          {orders.slice(0, 4).map((order) => (
            <div key={order._id} className="flex flex-col justify-between gap-2 rounded-lg bg-slate-50 p-4 sm:flex-row sm:items-center dark:bg-slate-700">
              <p className="font-medium text-slate-900 dark:text-white">Order #{order._id?.slice(-6)}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{order.items?.map((item) => `${item.itemName} x${item.quantity}`).join(", ")}</p>
            </div>
          ))}
          {orders.length === 0 && <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500 dark:bg-slate-700 dark:text-slate-400">No pending delivery orders right now.</p>}
        </div>
      </section>

      <AiAssistant />
    </div>
  );
}
