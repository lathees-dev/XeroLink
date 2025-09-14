import axios from "axios";

// Use Next.js rewrite (proxy) or set NEXT_PUBLIC_API_BASE_URL to http://localhost:5000/api
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";

export const api = axios.create({
  baseURL,
  withCredentials: false, // Important: keep false if using Bearer tokens
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("xl_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
