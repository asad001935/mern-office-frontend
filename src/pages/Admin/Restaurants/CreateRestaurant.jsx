import { useState } from "react";
import { createRestaurant } from "../../../api/restaurantApi";
import { toast } from "react-toastify";
import { Plus } from "lucide-react";
import Loader from "../../../components/Loader";

function CreateRestaurant({ refresh }) {
  const [form, setForm] = useState({
    restaurantName: "",
    location: "",
    menu: [
      {
        itemName: "",
        price: "",
        category: "",
      },
    ],
  });

  const [loading, setLoading] = useState(false);

  // handle menu change
  const handleMenuChange = (index, field, value) => {
    const updatedMenu = [...form.menu];
    updatedMenu[index][field] = value;
    setForm({ ...form, menu: updatedMenu });
  };

  // add new item
  const addMenuItem = () => {
    setForm({
      ...form,
      menu: [...form.menu, { itemName: "", price: "", category: "" }],
    });
  };

  // remove item
  const removeMenuItem = (index) => {
    const updated = form.menu.filter((_, i) => i !== index);
    setForm({ ...form, menu: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        restaurantName: form.restaurantName,
        location: form.location,
        menu: form.menu.map((item) => ({
          itemName: item.itemName,
          price: Number(item.price),
          category: item.category,
        })),
      };

      await createRestaurant(payload);

      toast.success("Restaurant created successfully");

      setForm({
        restaurantName: "",
        location: "",
        menu: [{ itemName: "", price: "", category: "" }],
      });

      refresh();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error creating restaurant");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader text="Creating restaurant..." />}

      <div className="flex justify-center mt-6">
        <form
          className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-lg border dark:bg-slate-800 dark:border-slate-700"
          onSubmit={handleSubmit}
        >
          <h2 className="text-2xl font-bold text-center mb-6 dark:text-white">
            Create Restaurant
          </h2>

          {/* Restaurant Name */}
          <input
            className="w-full border p-2 mb-3 rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder:text-slate-400"
            placeholder="Restaurant Name"
            value={form.restaurantName}
            onChange={(e) =>
              setForm({ ...form, restaurantName: e.target.value })
            }
            required
          />

          {/* Location */}
          <input
            className="w-full border p-2 mb-5 rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder:text-slate-400"
            placeholder="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            required
          />

          {/* MENU ITEMS */}
          <h3 className="font-semibold mb-2 dark:text-white">Menu Items</h3>

          {form.menu.map((item, index) => (
            <div
              key={index}
              className="border p-3 rounded mb-3 bg-gray-50 space-y-2 dark:bg-slate-700 dark:border-slate-600"
            >
              <input
                className="w-full border p-2 rounded dark:bg-slate-600 dark:border-slate-500 dark:text-white dark:placeholder:text-slate-400"
                placeholder="Item Name"
                value={item.itemName}
                onChange={(e) =>
                  handleMenuChange(index, "itemName", e.target.value)
                }
                required
              />

              <input
                type="number"
                className="w-full border p-2 rounded dark:bg-slate-600 dark:border-slate-500 dark:text-white dark:placeholder:text-slate-400"
                placeholder="Price"
                value={item.price}
                onChange={(e) =>
                  handleMenuChange(index, "price", e.target.value)
                }
                required
              />

              <input
                className="w-full border p-2 rounded dark:bg-slate-600 dark:border-slate-500 dark:text-white dark:placeholder:text-slate-400"
                placeholder="Category (optional)"
                value={item.category}
                onChange={(e) =>
                  handleMenuChange(index, "category", e.target.value)
                }
              />

              <button
                type="button"
                onClick={() => removeMenuItem(index)}
                className="text-red-500 text-sm dark:text-red-400"
              >
                Remove
              </button>
            </div>
          ))}

          {/* Add Item Button */}
          <button
            type="button"
            onClick={addMenuItem}
            className="flex items-center gap-2 text-blue-600 mb-5 dark:text-blue-400"
          >
            <Plus size={16} /> Add Item
          </button>

          {/* Submit */}
          <button
            disabled={loading}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            {loading ? "Creating..." : "Create Restaurant"}
          </button>
        </form>
      </div>
    </>
  );
}

export default CreateRestaurant;
