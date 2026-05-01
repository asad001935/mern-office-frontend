import { http, readPayload } from "./http";

export const createOfficeBoy = async (data) => {
  const res = await http.post("/api/admin/create-officeBoy", data);
  return res.data;
};

export const getOfficeBoys = async () => {
  const res = await http.get("/api/admin/all-officeBoys");
  return readPayload(res);
};

export const deleteOfficeBoy = async (id) => {
  const res = await http.patch(`/api/admin/officeBoy/${id}/deactivate`);
  return res.data;
};

export const restoreOfficeBoy = async (id) => {
  const res = await http.patch(`/api/admin/officeBoy/${id}/restore`);
  return res.data;
};
