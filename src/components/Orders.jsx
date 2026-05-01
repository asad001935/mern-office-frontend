import { useEffect, useState } from "react";
import { RefreshCcw } from "lucide-react";
import { toast } from "react-toastify";
import { getAdminOrders, updateOrderStatus } from "../api/orderApi";
import { getSocket } from "../api/socket";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setOrders(await getAdminOrders());
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch orders");
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
      toast.success(`Order moved to ${status}`);
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update order");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-950">All Orders</h2>
          <p className="mt-1 text-sm text-slate-500">Track every employee order and its delivery status.</p>
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

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-700 dark:text-slate-300">
              <tr>
                <th className="px-5 py-3">Employee</th>
                <th className="px-5 py-3">Items</th>
                <th className="px-5 py-3">Total</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Created</th>
                <th className="px-5 py-3 text-right">Restaurant updates</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="px-5 py-4">
                    <p className="font-medium text-slate-900 dark:text-white">{order.userId?.userName || "Employee"}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{order.userId?.email || order.userId || "No email"}</p>
                  </td>
                  <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                    {order.items?.map((item) => `${item.itemName} x${item.quantity}`).join(", ") || "No items"}
                  </td>
                  <td className="px-5 py-4 font-semibold text-slate-900 dark:text-white">
                    Rs. {order.items?.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0) || 0}
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold capitalize text-slate-700 dark:bg-slate-600 dark:text-slate-300">
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-500 dark:text-slate-400">{new Date(order.createdAt).toLocaleString()}</td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => changeStatus(order._id, "preparing")}
                        disabled={order.status !== "pending"}
                        className="rounded-lg bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Preparing
                      </button>
                      <button
                        type="button"
                        onClick={() => changeStatus(order._id, "ready")}
                        disabled={order.status === "ready" || order.status === "delivered"}
                        className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Ready
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && orders.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-5 py-10 text-center text-slate-500">No orders found.</td>
                </tr>
              )}
              {loading && (
                <tr>
                  <td colSpan="6" className="px-5 py-10 text-center text-slate-500">Loading orders...</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
