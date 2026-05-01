import { useEffect, useMemo, useState } from "react";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createOrder } from "../../api/orderApi";
import { getRestaurantItems, getRestaurants } from "../../api/restaurantApi";

export default function CreateOrder() {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedName, setSelectedName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const [restaurantData, itemData] = await Promise.all([getRestaurants().catch(() => []), getRestaurantItems()]);
        setRestaurants(restaurantData || []);
        setItems(itemData || []);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load menu");
      }
    };

    fetchMenu();
  }, []);

  const menuOptions = useMemo(() => {
    const detailed = restaurants.flatMap((restaurant) =>
      (restaurant.menu || []).map((item) => ({
        itemName: item.itemName,
        price: item.price || 0,
        restaurantName: restaurant.restaurantName,
        category: item.category || "Menu",
      })),
    );

    if (detailed.length) return detailed;
    return items.map((itemName) => ({ itemName, price: 100, restaurantName: "Restaurant", category: "Menu" }));
  }, [items, restaurants]);

  const selectedItem = menuOptions.find((item) => item.itemName === selectedName);
  const total = cart.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);

  const addItem = () => {
    if (!selectedItem) {
      toast.error("Select a menu item first");
      return;
    }

    setCart((current) => {
      const existing = current.find((item) => item.itemName === selectedItem.itemName);
      if (existing) {
        return current.map((item) =>
          item.itemName === selectedItem.itemName ? { ...item, quantity: item.quantity + quantity } : item,
        );
      }
      return [...current, { itemName: selectedItem.itemName, quantity, price: selectedItem.price || 100 }];
    });
    setSelectedName("");
    setQuantity(1);
  };

  const submitOrder = async () => {
    if (!cart.length) {
      toast.error("Add at least one item");
      return;
    }

    try {
      setLoading(true);
      await createOrder({ items: cart });
      toast.success("Order created successfully");
      navigate("/employee/orders");
    } catch (error) {
      toast.error(error.response?.data?.message || "Order can be placed only during the allowed time");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-950 dark:text-white">Create lunch order</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Choose one or more items from restaurant menus.</p>
          </div>
          <div className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">2 PM - 3 PM</div>
        </div>

        <div className="grid gap-4 md:grid-cols-[1fr_130px_auto]">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Menu item</span>
            <select
              value={selectedName}
              onChange={(event) => setSelectedName(event.target.value)}
              className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            >
              <option value="">Select food item</option>
              {menuOptions.map((item, index) => (
                <option key={`${item.itemName}-${index}`} value={item.itemName}>
                  {item.itemName} - {item.restaurantName} - Rs. {item.price || 100}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Quantity</span>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(event) => setQuantity(Math.max(1, Number(event.target.value)))}
              className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-emerald-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            />
          </label>

          <button
            type="button"
            onClick={addItem}
            className="mt-7 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-700"
          >
            <Plus size={16} />
            Add
          </button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {menuOptions.slice(0, 9).map((item, index) => (
            <button
              type="button"
              key={`${item.itemName}-card-${index}`}
              onClick={() => setSelectedName(item.itemName)}
              className="rounded-lg border border-slate-200 p-4 text-left hover:border-emerald-400 hover:bg-emerald-50 dark:border-slate-600 dark:hover:bg-slate-700"
            >
              <p className="font-semibold text-slate-900 dark:text-white">{item.itemName}</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{item.restaurantName}</p>
              <p className="mt-3 text-sm font-bold text-emerald-700 dark:text-emerald-400">Rs. {item.price || 100}</p>
            </button>
          ))}
        </div>
      </section>

      <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-950 dark:text-white">Order box</h3>
          <ShoppingBag size={20} className="text-slate-400" />
        </div>

        <div className="mt-5 space-y-3">
          {cart.map((item) => (
            <div key={item.itemName} className="rounded-lg border border-slate-200 p-3 dark:border-slate-600">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{item.itemName}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Rs. {item.price || 0} each</p>
                </div>
                <button
                  type="button"
                  aria-label={`Remove ${item.itemName}`}
                  onClick={() => setCart((current) => current.filter((cartItem) => cartItem.itemName !== item.itemName))}
                  className="grid size-8 place-items-center rounded-lg text-slate-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/30"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-600">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() =>
                      setCart((current) =>
                        current.map((cartItem) =>
                          cartItem.itemName === item.itemName
                            ? { ...cartItem, quantity: Math.max(1, cartItem.quantity - 1) }
                            : cartItem,
                        ),
                      )
                    }
                    className="grid size-8 place-items-center text-slate-500 dark:text-slate-400"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center text-sm font-semibold dark:text-white">{item.quantity}</span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() =>
                      setCart((current) =>
                        current.map((cartItem) =>
                          cartItem.itemName === item.itemName ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
                        ),
                      )
                    }
                    className="grid size-8 place-items-center text-slate-500 dark:text-slate-400"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <p className="font-semibold text-slate-900 dark:text-white">Rs. {(item.price || 0) * item.quantity}</p>
              </div>
            </div>
          ))}

          {cart.length === 0 && (
            <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-slate-600 dark:text-slate-400">
              Your selected items will appear here.
            </div>
          )}
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-5 dark:border-slate-600">
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Total</span>
          <span className="text-2xl font-bold text-slate-950 dark:text-white">Rs. {total}</span>
        </div>

        <button
          type="button"
          disabled={loading || cart.length === 0}
          onClick={submitOrder}
          className="mt-5 h-11 w-full rounded-lg bg-emerald-600 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {loading ? "Creating order..." : "Place order"}
        </button>
      </aside>
    </div>
  );
}
