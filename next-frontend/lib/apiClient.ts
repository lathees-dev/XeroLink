import axios from "axios";
import { API_BASE_URL } from "./endpoints";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("xl_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
