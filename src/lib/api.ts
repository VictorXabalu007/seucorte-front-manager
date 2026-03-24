import axios from "axios";
import { getToken } from "./auth";
import { toast } from "sonner";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3333/api/v1",
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const message = error.response?.data?.message || "Erro ao processar solicitação.";
    const status = error.response?.status;

    if (status === 401) {
      // Token expirado ou inválido - Redirecionar para login
      localStorage.removeItem("@SeuCorte:token");
      localStorage.removeItem("@SeuCorte:user");
      window.location.href = "/login";
      toast.error("Sessão expirada. Faça login novamente.");
    } else {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default api;
