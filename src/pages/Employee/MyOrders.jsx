import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getEmployeeOrders } from "../../api/orderApi";
import { getSocket } from "../../api/socket";
import Loader from './../../components/Loader';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setOrders(await getEmployeeOrders());
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load orders");
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
    socket.on("order:status", refresh);
    socket.on("order:new", refresh);
    return () => {
      socket.off("order:status", refresh);
      socket.off("order:new", refresh);
    };
  }, []);

  return (
    <>
      {loading && <Loader text="Logging you in..." />}

      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
            My orders
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            All orders you have created, newest first.
          </p>
        </div>

        <div className="grid gap-4">
          {orders.map((order) => (
            <article
              key={order._id}
              className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800"
            >
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    Order #{order._id?.slice(-6)}
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <span className="w-fit rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold capitalize text-slate-700 dark:bg-slate-600 dark:text-slate-300">
                  {order.status}
                </span>
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {order.items?.map((item, index) => (
                  <div
                    key={`${order._id}-${index}`}
                    className="rounded-lg bg-slate-50 p-3 dark:bg-slate-700"
                  >
                    <p className="font-medium text-slate-900 dark:text-white">
                      {item.itemName}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                ))}
              </div>
            </article>
          ))}

          {!loading && orders.length === 0 && (
            <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400">
              You have not created any orders yet.
            </div>
          )}
          {loading && (
            <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
              Loading orders...
            </div>
          )}
        </div>
      </div>
    </>
  );
}
