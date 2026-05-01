import { http, readPayload } from "./http";

export const getAllData = async () => {
  const res = await http.get("/api/admin/");
  return res.data?.data || {};
};

export const getEmployees = async () => {
  const res = await http.get("/api/user/");
  return readPayload(res);
};

export const getOrders = async () => {
  const res = await http.get("/api/admin/all-orders");
  return readPayload(res);
};
