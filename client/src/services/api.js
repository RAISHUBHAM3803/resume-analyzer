import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.PROD ? "/api" : "http://localhost:3000/api",
  // Send HTTPOnly cookies automatically with every cross-origin request
  withCredentials: true,
});

// ── Response interceptor: auto-logout on 401 Unauthorized ───────────────
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url ?? "";
    // Only auto-reload for auth endpoints (not for data endpoints like /resume/history)
    // This prevents the history/dashboard pages from going blank on 401
    const isAuthEndpoint = url.includes("/auth/") && !url.includes("/auth/me");
    const isDataEndpoint = url.includes("/resume/");
    if (error.response?.status === 401 && isAuthEndpoint && !isDataEndpoint) {
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export const login = (data) => API.post("/auth/login", data);
export const register = (data) => API.post("/auth/register", data);
export const logout = () => API.post("/auth/logout");
export const getMe = () => API.get("/auth/me");
export const forgotPassword = (data) => API.post("/auth/forgotpassword", data);
export const resetPassword = (token, data) => API.put(`/auth/resetpassword/${token}`, data);

export const uploadResume = (formData) =>
  API.post("/resume/upload", formData);

export const getHistory = () =>
  API.get("/resume/history");

export const deleteHistory = (timeframe) =>
  API.delete(`/resume/history?timeframe=${timeframe}`);

export const rewriteBullet = (data) => 
  API.post("/resume/rewrite", data);

export const generateCoverLetter = (data) =>
  API.post("/resume/cover-letter", data);

export const mockInterview = (data) =>
  API.post("/resume/mock-interview", data);
