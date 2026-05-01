import { http, readPayload } from "./http";

export const getEmployeeOrders = async () => {
  const res = await http.get("/api/order/getMyOrders");
  return readPayload(res);
};

export const getAdminOrders = async () => {
  const res = await http.get("/api/admin/all-orders");
  return readPayload(res);
};

export const getOfficeBoyOrders = async () => {
  const res = await http.get("/api/officeBoy/pending");
  return readPayload(res);
};

export const getOrderAnalytics = async () => {
  const res = await http.get("/api/order/analytics");
  return res.data?.data || {};
};

export const createOrder = async (orderData) => {
  const res = await http.post("/api/order/create", orderData);
  return res.data;
};

export const acceptOrder = async (orderId) => {
  const res = await http.patch(`/api/order/update/${orderId}`, {
    status: "preparing",
  });
  return res.data;
};

export const markOrderDelivered = async (orderId) => {
  const res = await http.patch(`/api/order/update/${orderId}`, {
    status: "delivered",
  });
  return res.data;
};

export const updateOrderStatus = async (orderId, status) => {
  const res = await http.patch(`/api/order/update/${orderId}`, { status });
  return res.data;
};

export const getOrders = getEmployeeOrders;
