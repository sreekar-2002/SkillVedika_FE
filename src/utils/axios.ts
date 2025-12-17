import axios from "axios";
import toast from "react-hot-toast";

/**
 * Base URL rules:
 * - If NEXT_PUBLIC_API_BASE_URL is set → use it
 * - Else → use local backend
 */
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
  "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

/**
 * Ensure Sanctum CSRF cookie
 * MUST NOT go through /api
 */
export async function ensureCsrfCookie() {
  await axios.get(`${API_BASE}/sanctum/csrf-cookie`, {
    withCredentials: true,
  });
}

/**
 * Request interceptor
 * - Ensures CSRF cookie for write operations
 * - NO Bearer tokens (Sanctum uses cookies)
 */
api.interceptors.request.use(async (config) => {
  if (typeof window === "undefined") return config;

  const method = (config.method || "get").toLowerCase();
  const needsCsrf = !["get", "head", "options"].includes(method);

  if (needsCsrf) {
    const hasXsrf = document.cookie.includes("XSRF-TOKEN");
    if (!hasXsrf) {
      await ensureCsrfCookie();
    }
  }

  return config;
});

/**
 * Global 401 handler
 */
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;

    if (status === 401 && typeof window !== "undefined") {
      toast.error("Session expired. Please login again.");
      setTimeout(() => {
        window.location.href = "/";
      }, 800);
    }

    return Promise.reject(error);
  }
);

export default api;
