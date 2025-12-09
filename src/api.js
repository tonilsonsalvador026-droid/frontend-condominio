// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.1.238:5000", // endereço backend
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