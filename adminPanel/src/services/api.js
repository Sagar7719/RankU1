import axios from "axios";

const apiBaseURL = import.meta.env.VITE_API_BASE_URL;

if (!apiBaseURL) {
  // Hard-fail in misconfigured environments instead of silently defaulting to localhost.
  throw new Error(
    "Missing VITE_API_BASE_URL for adminPanel. Set it to your backend URL like https://your-domain/api"
  );
}

const api = axios.create({
  baseURL: apiBaseURL,
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
