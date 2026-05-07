import { useEffect, useState } from "react";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createOrder } from "../../api/orderApi";
import { getRestaurantById, getRestaurants } from "../../api/restaurantApi";
import Loader from "../../components/Loader";

export default function CreateOrder() {
  const navigate = useNavigate();

  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState("");
  const [restaurantMenu, setRestaurantMenu] = useState([]);
  const [selectedMenuItem, setSelectedMenuItem] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await getRestaurants();
        setRestaurants(data || []);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to fetch restaurants",
        );
      }
    };

    fetchRestaurants();
  }, []);

  const handleRestaurantChange = async (restaurantId) => {
    setSelectedRestaurant(restaurantId);
    setSelectedMenuItem("");

    try {
      const data = await getRestaurantById(restaurantId);

      const availableMenu = (data.menu || []).filter(
        (item) => item.isAvailable,
      );

      setRestaurantMenu(availableMenu);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch restaurant menu",
      );
    }
  };

  const selectedItem = restaurantMenu.find(
    (item) => item.itemName === selectedMenuItem,
  );

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const addItem = () => {
    if (!selectedRestaurant) {
      toast.error("Select restaurant first");
      return;
    }

    if (!selectedItem) {
      toast.error("Select menu item");
      return;
    }

    setCart((current) => {
      const existing = current.find(
        (item) => item.itemName === selectedItem.itemName,
      );

      if (existing) {
        return current.map((item) =>
          item.itemName === selectedItem.itemName
            ? {
                ...item,
                quantity: item.quantity + quantity,
              }
            : item,
        );
      }

      return [
        ...current,
        {
          itemName: selectedItem.itemName,
          quantity,
          price: selectedItem.price,
        },
      ];
    });

    setSelectedMenuItem("");
    setQuantity(1);
  };

  const submitOrder = async () => {
    if (!cart.length) {
      toast.error("Add at least one item");
      return;
    }

    try {
      setLoading(true);

      await createOrder({
        restaurantId: selectedRestaurant,
        items: cart.map((item) => ({
          itemName: item.itemName,
          quantity: item.quantity,
        })),
      });

      toast.success("Order placed successfully");

      navigate("/employee/orders");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    {loading && <Loader text="Creating order..." />}

    <div className="grid gap-6 bg-slate-100 p-4 text-slate-900 dark:bg-slate-900 dark:text-white xl:grid-cols-[1.15fr_0.85fr]">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-800">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Create Lunch Order
          </h2>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">
            Select a restaurant and order your favorite meal.
          </p>
        </div>

        <div className="grid gap-4">
          <label>
            <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
              Select Restaurant
            </span>

            <select
              value={selectedRestaurant}
              onChange={(e) => handleRestaurantChange(e.target.value)}
              className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:ring-emerald-800"
            >
              <option value="">Select Restaurant</option>

              {restaurants.map((restaurant) => (
                <option key={restaurant._id} value={restaurant._id}>
                  {restaurant.restaurantName}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
              Select Menu Item
            </span>

            <select
              value={selectedMenuItem}
              onChange={(e) => setSelectedMenuItem(e.target.value)}
              disabled={!selectedRestaurant}
              className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:disabled:bg-slate-800 dark:focus:ring-emerald-800"
            >
              <option value="">Select Menu Item</option>

              {restaurantMenu.map((item, index) => (
                <option key={`${item.itemName}-${index}`} value={item.itemName}>
                  {item.itemName} - Rs. {item.price}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
              Quantity
            </span>

            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
              className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:ring-emerald-800"
            />
          </label>

          <button
            type="button"
            onClick={addItem}
            className="h-11 rounded-xl bg-emerald-600 text-sm font-semibold text-white transition hover:bg-emerald-700 active:scale-[0.98]"
          >
            Add To Cart
          </button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {restaurantMenu.map((item, index) => (
            <button
              key={`${item.itemName}-${index}`}
              type="button"
              onClick={() => setSelectedMenuItem(item.itemName)}
              className="rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-emerald-400 hover:bg-emerald-50 dark:border-slate-600 dark:bg-slate-700 dark:hover:bg-slate-600"
            >
              <p className="font-semibold text-slate-900 dark:text-white">
                {item.itemName}
              </p>

              <p className="mt-2 text-sm font-medium text-emerald-700 dark:text-emerald-400">
                Rs. {item.price}
              </p>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">
                {item.category}
              </p>
            </button>
          ))}
        </div>
      </section>

      <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Order Box
          </h3>

          <ShoppingBag
            size={22}
            className="text-slate-500 dark:text-slate-300"
          />
        </div>

        <div className="mt-5 space-y-3">
          {cart.map((item) => (
            <div
              key={item.itemName}
              className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-600 dark:bg-slate-700"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {item.itemName}
                  </p>

                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Rs. {item.price} each
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setCart((current) =>
                      current.filter(
                        (cartItem) => cartItem.itemName !== item.itemName,
                      ),
                    )
                  }
                  className="rounded-lg p-2 text-slate-500 transition hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-900/30"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-3 rounded-lg border border-slate-300 bg-white px-2 py-1 dark:border-slate-500 dark:bg-slate-800">
                  <button
                    type="button"
                    onClick={() =>
                      setCart((current) =>
                        current.map((cartItem) =>
                          cartItem.itemName === item.itemName
                            ? {
                                ...cartItem,
                                quantity: Math.max(1, cartItem.quantity - 1),
                              }
                            : cartItem,
                        ),
                      )
                    }
                    className="text-slate-600 dark:text-slate-300"
                  >
                    <Minus size={14} />
                  </button>

                  <span className="min-w-[20px] text-center text-sm font-semibold text-slate-900 dark:text-white">
                    {item.quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setCart((current) =>
                        current.map((cartItem) =>
                          cartItem.itemName === item.itemName
                            ? {
                                ...cartItem,
                                quantity: cartItem.quantity + 1,
                              }
                            : cartItem,
                        ),
                      )
                    }
                    className="text-slate-600 dark:text-slate-300"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <p className="font-semibold text-slate-900 dark:text-white">
                  Rs. {item.price * item.quantity}
                </p>
              </div>
            </div>
          ))}

          {cart.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-600 dark:text-slate-300">
              No items added yet.
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-5 dark:border-slate-600">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Total
          </span>

          <span className="text-3xl font-bold text-slate-900 dark:text-white">
            Rs. {total}
          </span>
        </div>

        <button
          type="button"
          disabled={loading || cart.length === 0}
          onClick={submitOrder}
          className="mt-5 h-11 w-full rounded-xl bg-emerald-600 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {loading ? "Creating Order..." : "Place Order"}
        </button>
      </aside>
    </div>
    </>
  );
}
