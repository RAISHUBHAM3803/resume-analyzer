import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.PROD ? "/api" : "http://localhost:3000/api",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const login = (data) => API.post("/auth/login", data);
export const register = (data) => API.post("/auth/register", data);
export const getMe = () => API.get("/auth/me");

export const uploadResume = (formData) =>
  API.post("/resume/upload", formData);

export const getHistory = () => 
  API.get("/resume/history");

export const deleteHistory = (timeframe) =>
  API.delete(`/resume/history?timeframe=${timeframe}`);
