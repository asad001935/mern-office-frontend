import { http, readPayload } from "./http";

export const createEmployee = async (data) => {
  const res = await http.post("/api/admin/create-employee", data);
  return res.data;
};

export const getEmployees = async () => {
  const res = await http.get("/api/user/");
  return readPayload(res);
};

export const deleteEmployee = async (id) => {
  const res = await http.patch(`/api/admin/employee/${id}/deactivate`);
  return res.data;
};

export const restoreEmployee = async (id) => {
  const res = await http.patch(`/api/admin/employee/${id}/restore`);
  return res.data;
};
