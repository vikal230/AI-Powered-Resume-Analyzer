import axios from "axios";

const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

const backendUrl = isLocalhost
  ? "http://localhost:3000"
  : import.meta.env.VITE_BACKEND_RENDER_URL || "http://localhost:3000";

export const api = axios.create({
  baseURL: backendUrl,
  withCredentials: true,
});

export { backendUrl };
