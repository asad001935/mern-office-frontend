import { useEffect, useState } from "react";
import { Plus, Utensils } from "lucide-react";
import { toast } from "react-toastify";
import Loader from "../../../components/Loader";
import { getRestaurants, addMenuItem } from "../../../api/restaurantApi";

function AddMenuItem() {
  const [restaurants, setRestaurants] = useState([]);
  const [restaurantId, setRestaurantId] = useState("");
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await getRestaurants();
        setRestaurants(data || []);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to load restaurants",
        );
      }
    };

    fetchRestaurants();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!restaurantId) return toast.error("Please select a restaurant");
    if (!itemName || !price) return toast.error("Item name and price required");

    try {
      setLoading(true);
      console.log(`RestaurantId og selected restaurant is: :${restaurantId}`)

      await addMenuItem(restaurantId, {
        itemName,
        price: Number(price),
        category,
      });

      toast.success("Menu item added successfully");

      setItemName("");
      setPrice("");
      setCategory("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add menu item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader text="Adding menu item..." />}

      <div className="min-h-screen bg-slate-100 dark:bg-slate-950 px-4 py-10">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 rounded-2xl border bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-emerald-100 p-3 dark:bg-emerald-900/30">
                <Utensils className="text-emerald-600" />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Add Menu Item
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Add items to existing restaurants
                </p>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900"
          >
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Select Restaurant
            </label>

            <select
              value={restaurantId}
              onChange={(e) => setRestaurantId(e.target.value)}
              className="mb-5 h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-emerald-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            >
              <option value="">Choose restaurant</option>

              {restaurants.map((r) => (
                <option key={r._id} value={r._id}>
                  {r.restaurantName}
                </option>
              ))}
            </select>

            <div className="grid gap-4 md:grid-cols-2">
              <input
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="Item Name"
                className="h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-emerald-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              />

              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Price"
                className="h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-emerald-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Category (optional)"
              className="mt-4 h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-emerald-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            />

            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-slate-400"
            >
              <Plus size={18} />
              {loading ? "Adding..." : "Add Menu Item"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddMenuItem;
