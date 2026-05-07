import { useEffect, useState } from "react";
import CreateRestaurant from "./CreateRestaurant";
import RestaurantList from "./RestaurantList";
import { getRestaurants } from "../../../api/restaurantApi";
import { toast } from "react-toastify";
import AddMenuItem from "./AddMenuItem";

function Restaurant() {
  const [activeTab, setActiveTab] = useState("list");
  const [data, setData] = useState([]);

  const fetchRestaurants = async () => {
    try {
      const res = await getRestaurants();
      setData(res || []);
    } catch {
      toast.error("Failed to load restaurants");
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const activeRestaurants = data.filter((restaurant) => !restaurant.isDeleted);
  const inactiveRestaurants = data.filter((restaurant) => restaurant.isDeleted);

  return (
    <div className="p-6">
      {/* 🔹 HEADER */}
      <h1 className="text-2xl font-bold mb-6">Restaurant Management</h1>

      {/* 🔹 STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 shadow rounded">
          <p className="text-gray-500">Total Restaurants</p>
          <p className="text-2xl font-bold">{data.length}</p>
        </div>

        <div className="bg-white p-4 shadow rounded">
          <p className="text-gray-500">Active Restaurants</p>
          <p className="text-2xl font-bold text-green-500">
            {activeRestaurants.length}
          </p>
        </div>

        <div className="bg-white p-4 shadow rounded">
          <p className="text-gray-500">Inactive Restaurants</p>
          <p className="text-2xl font-bold text-rose-500">
            {inactiveRestaurants.length}
          </p>
        </div>
      </div>

      {/* 🔹 TABS */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("list")}
          className={`cursor-pointer px-4 py-2 rounded font-medium transition ${
            activeTab === "list"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          View Restaurants
        </button>

        <button
          onClick={() => setActiveTab("create")}
          className={`cursor-pointer px-4 py-2 rounded font-medium transition ${
            activeTab === "create"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Create Restaurant
        </button>

        <button
          onClick={() => setActiveTab("menu")}
          className={`cursor-pointer px-4 py-2 rounded font-medium transition ${
            activeTab === "menu"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Manage Menu
        </button>
      </div>

      {/* 🔹 CONTENT */}
      {activeTab === "list" && (
        <RestaurantList data={data} refresh={fetchRestaurants} />
      )}

      {activeTab === "create" && (
        <CreateRestaurant refresh={fetchRestaurants} />
      )}

      {activeTab === "menu" && (
        <AddMenuItem restaurants={data} refresh={fetchRestaurants} />
      )}
    </div>
  );
}

export default Restaurant;
