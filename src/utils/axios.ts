// import axios from "axios";

// const instance = axios.create({
//   baseURL: "http://localhost:8000/api",
// });

// export default instance;

// import axios from "axios";
// const instance = axios.create({ baseURL: "http://127.0.0.1:8000/api" });
// export default instance;

import axios from "axios";
import toast from "react-hot-toast";

const instance = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  withCredentials: true,
});

// Attach token automatically
instance.interceptors.request.use((config) => {
  if (typeof window === "undefined") return config;

  // support multiple possible token keys (frontend may store under different names)
  const tokenKeys = ["token", "admin_token", "access_token"];
  let token: string | null = null;
  for (const k of tokenKeys) {
    const t = localStorage.getItem(k);
    if (t) {
      token = t;
      break;
    }
  }

  // ensure headers object exists
  config.headers = config.headers || {};
  if (token) {
    // set Authorization header
    (
      config.headers as Record<string, string>
    ).Authorization = `Bearer ${token}`;
    // helpful debug during development
    // console.debug('[axios] Attaching Authorization header');
  }

  return config;
});

// Global response handler: surface 401s with a friendly message
instance.interceptors.response.use(
  (resp) => resp,
  (error) => {
    if (error?.response?.status === 401) {
      // show a toast to indicate authentication is required
      try {
        toast.error("Unauthenticated. Please login.");
      } catch {
        /* ignore if toast can't run in this context */
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
