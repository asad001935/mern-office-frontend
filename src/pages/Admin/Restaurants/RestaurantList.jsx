import { RotateCcw, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { deactivateRestaurant, restoreRestaurant } from "../../../api/restaurantApi";

function RestaurantList({ data, refresh }) {
  const changeStatus = async (restaurant) => {
    try {
      if (restaurant.isDeleted) {
        await restoreRestaurant(restaurant._id);
        toast.success("Restaurant restored");
      } else {
        await deactivateRestaurant(restaurant._id);
        toast.success("Restaurant deactivated");
      }
      refresh();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update restaurant");
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-700 dark:text-slate-300">
            <tr>
              <th className="px-5 py-3">Restaurant</th>
              <th className="px-5 py-3">Location</th>
              <th className="px-5 py-3">Menu</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {data.map((item) => (
              <tr key={item._id} className={item.isDeleted ? "bg-slate-50 dark:bg-slate-700" : ""}>
                <td className="px-5 py-4 font-medium text-slate-900 dark:text-white">{item.restaurantName}</td>
                <td className="px-5 py-4 text-slate-600 dark:text-slate-300">{item.location}</td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-2">
                    {item.menu?.map((menuItem, index) => (
                      <span key={`${item._id}-${index}`} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-600 dark:text-slate-300">
                        {menuItem.itemName} - Rs. {menuItem.price}
                      </span>
                    ))}
                    {(!item.menu || item.menu.length === 0) && <span className="text-slate-400">No menu</span>}
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      item.isDeleted ? "bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400" : "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                    }`}
                  >
                    {item.isDeleted ? "Inactive" : "Open"}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => changeStatus(item)}
                    className={`inline-flex h-9 items-center gap-2 rounded-lg px-3 text-xs font-semibold ${
                      item.isDeleted
                        ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50"
                        : "bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-900/30 dark:text-rose-400 dark:hover:bg-rose-900/50"
                    }`}
                  >
                    {item.isDeleted ? <RotateCcw size={14} /> : <Trash2 size={14} />}
                    {item.isDeleted ? "Restore" : "Deactivate"}
                  </button>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan="5" className="px-5 py-10 text-center text-slate-500 dark:text-slate-400">
                  No restaurants found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RestaurantList;
