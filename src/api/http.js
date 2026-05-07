import axios from "axios";
import { API_URL } from "./config";

export const http = axios.create({
  baseURL: API_URL,
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const readPayload = (response, fallback = []) => {
  if (Array.isArray(response?.data?.data)) return response.data.data;
  if (Array.isArray(response?.data?.orders)) return response.data.orders;
  if (Array.isArray(response?.data)) return response.data;
  return response?.data?.data || response?.data?.orders || fallback;
};
