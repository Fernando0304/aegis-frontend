import axios from "axios";

const api = axios.create({
  baseURL: "https://aegis-backend-8vb.onrender.com/api/",
});

// 🔥 Interceptor que adiciona automaticamente o token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
