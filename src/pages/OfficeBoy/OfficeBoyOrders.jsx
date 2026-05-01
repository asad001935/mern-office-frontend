import { useEffect, useState } from "react";
import { ChefHat, CheckCircle2, PackageCheck, RefreshCcw } from "lucide-react";
import { toast } from "react-toastify";
import { getOfficeBoyOrders, updateOrderStatus } from "../../api/orderApi";
import { getSocket } from "../../api/socket";

export default function OfficeBoyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setOrders(await getOfficeBoyOrders());
    } catch (error) {
      setOrders([]);
      toast.info(error.response?.data?.message || "No pending orders found");
    } finally {
      setLoading(false);
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

  const changeStatus = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);
      toast.success(`Order marked as ${status}`);
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating order");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-950 dark:text-white">Pending deliveries</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Deliver lunch orders and mark each one complete.</p>
        </div>
        <button
          type="button"
          onClick={fetchOrders}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          <RefreshCcw size={16} />
          Refresh
        </button>
      </div>

      <div className="grid gap-4">
        {orders.map((order) => (
          <article key={order._id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Order #{order._id?.slice(-6)}</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{new Date(order.createdAt).toLocaleString()}</p>
              </div>
              <span className="w-fit rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold capitalize text-slate-700 dark:bg-slate-600 dark:text-slate-300">
                {order.status}
              </span>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {order.items?.map((item, index) => (
                <div key={`${order._id}-${index}`} className="rounded-lg bg-slate-50 p-3 dark:bg-slate-700">
                  <p className="font-medium text-slate-900 dark:text-white">{item.itemName}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Quantity: {item.quantity}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => changeStatus(order._id, "preparing")}
                disabled={order.status !== "pending"}
                className="inline-flex h-9 items-center gap-2 rounded-lg bg-sky-50 px-3 text-xs font-semibold text-sky-700 hover:bg-sky-100 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-sky-900/30 dark:text-sky-400 dark:hover:bg-sky-900/50"
              >
                <ChefHat size={14} />
                Preparing
              </button>
              <button
                type="button"
                onClick={() => changeStatus(order._id, "ready")}
                disabled={order.status === "ready" || order.status === "delivered"}
                className="inline-flex h-9 items-center gap-2 rounded-lg bg-indigo-50 px-3 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50"
              >
                <PackageCheck size={14} />
                Ready
              </button>
              <button
                type="button"
                onClick={() => changeStatus(order._id, "delivered")}
                disabled={order.status !== "ready"}
                className="inline-flex h-9 items-center gap-2 rounded-lg bg-emerald-600 px-3 text-xs font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                <CheckCircle2 size={14} />
                Delivered
              </button>
            </div>
          </article>
        ))}

        {!loading && orders.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400">
            No pending orders are ready for delivery.
          </div>
        )}
        {loading && <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">Loading pending orders...</div>}
      </div>
    </div>
  );
}
