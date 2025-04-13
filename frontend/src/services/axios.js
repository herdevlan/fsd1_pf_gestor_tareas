
import axios from "axios";

// Usamos la variable de entorno para la URL de la API
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:4000/api", // Valor por defecto en desarrollo
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;
