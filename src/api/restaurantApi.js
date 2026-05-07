import { http, readPayload } from "./http";

export const createRestaurant = async (data) => {
  const res = await http.post("/api/admin/create-restaurant", data);
  return res.data;
};

export const getRestaurants = async () => {
  const res = await http.get("/api/admin/restaurants");
  return readPayload(res);
};

export const getRestaurantItems = async () => {
  const res = await http.get("/api/restaurant/items");
  return readPayload(res);
};

export const getRestaurantById = async (restaurantId) => {
  const res = await http.get(`/api/admin/restaurant/${restaurantId}`);
  return readPayload(res);
};

export const deactivateRestaurant = async (id) => {
  const res = await http.patch(`/api/admin/restaurant/${id}/deactivate`);
  return res.data;
};

export const restoreRestaurant = async (id) => {
  const res = await http.patch(`/api/admin/restaurant/${id}/restore`);
  return res.data;
};
