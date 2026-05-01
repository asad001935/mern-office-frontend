import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const loginApi = async (email, password) => {
  const res = await axios.post(`${API}/api/auth/login`, { email, password });
  return res.data;
};
