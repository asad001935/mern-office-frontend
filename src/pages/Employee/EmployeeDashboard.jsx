import { useEffect, useMemo, useState } from "react";
import { Clock, PackageCheck, ShoppingBag } from "lucide-react";
import { toast } from "react-toastify";
import { getEmployeeOrders } from "../../api/orderApi";
import { getSocket } from "../../api/socket";
import AiAssistant from "../../components/AiAssistant";

function Card({ title, value, icon: Icon, tone }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
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

export default function EmployeeDashboard() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      setOrders(await getEmployeeOrders());
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load dashboard");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    const socket = getSocket();
    if (!socket.connected) socket.connect();
    const refresh = () => fetchOrders();
    socket.on("order:status", refresh);
    socket.on("order:new", refresh);
    return () => {
      socket.off("order:status", refresh);
      socket.off("order:new", refresh);
    };
  }, []);

  const stats = useMemo(
    () => ({
      pending: orders.filter((order) => order.status === "pending").length,
      delivered: orders.filter((order) => order.status === "delivered").length,
    }),
    [orders],
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-950">Employee dashboard</h2>
        <p className="mt-1 text-sm text-slate-500">Create your lunch order and track today&apos;s delivery.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card title="Total Orders" value={orders.length} icon={ShoppingBag} tone="bg-emerald-50 text-emerald-700" />
        <Card title="Pending" value={stats.pending} icon={Clock} tone="bg-amber-50 text-amber-700" />
        <Card title="Delivered" value={stats.delivered} icon={PackageCheck} tone="bg-sky-50 text-sky-700" />
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <h3 className="font-semibold text-slate-950 dark:text-white">Break schedule</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {[
            ["2:00 PM", "Order window opens"],
            ["3:00 PM", "Orders close"],
            ["3:00 - 4:00 PM", "Office boy delivery"],
          ].map(([time, label]) => (
            <div key={time} className="rounded-lg bg-slate-50 p-4 dark:bg-slate-700">
              <p className="font-semibold text-slate-900 dark:text-white">{time}</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <AiAssistant />
    </div>
  );
}
