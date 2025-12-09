// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://momentum-si.onrender.com", // URL pública do backend
});

// Adiciona token automaticamente em todas as chamadas
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;