import axios from "axios";

const rawBase = import.meta.env.VITE_API_URL || "/api";
const normalizedBase = rawBase.endsWith("/api")
  ? rawBase
  : rawBase.startsWith("http")
  ? `${rawBase.replace(/\/+$/, "")}/api`
  : rawBase;

const api = axios.create({
  baseURL: normalizedBase,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Centralized response handling: normalize errors so every page gets a
// readable err.response.data.message, and auto-logout on an expired/
// invalid token instead of letting the app sit in a broken auth state.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      // Network failure — backend down, no internet, CORS issue, etc.
      error.response = { data: { message: "Cannot reach the server. Is the backend running?" } };
      return Promise.reject(error);
    }

    if (error.response.status === 401 && localStorage.getItem("token")) {
      localStorage.removeItem("token");
      if (window.location.pathname !== "/login") {
        window.location.assign("/login");
      }
    }

    return Promise.reject(error);
  }
);

export default api;
