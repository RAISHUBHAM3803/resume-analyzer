import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.PROD ? "/api" : "http://localhost:3000/api",
});

// ── Request interceptor: attach token to every request ──────────────────
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// ── Response interceptor: auto-logout on 401 Unauthorized ───────────────
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token is expired or invalid — clear it so the user is logged out
      localStorage.removeItem("token");
      // Reload to let App.jsx re-initialize in a logged-out state
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export const login = (data) => API.post("/auth/login", data);
export const register = (data) => API.post("/auth/register", data);
export const getMe = () => API.get("/auth/me");

export const uploadResume = (formData) =>
  API.post("/resume/upload", formData);

export const getHistory = () => 
  API.get("/resume/history");

export const deleteHistory = (timeframe) =>
  API.delete(`/resume/history?timeframe=${timeframe}`);
