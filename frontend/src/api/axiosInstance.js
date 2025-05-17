import axios from "axios";
import toast from "react-hot-toast"
// ✅ 1. Base Axios Instance
const api = axios.create({
  baseURL: "http://localhost:3000", // Apna backend URL set karein
  withCredentials: true // Automatically cookies send karega
});

// ✅ 2. Axios Response Interceptor
api.interceptors.response.use(
  (response) => response, // Success response return karega
  async (error) => {
    if (error.response && error.response.status === 401) {
      try {
        // ✅ 3. Refresh Token Call
        await api.get("/api/users/refresh-token"); // Refresh token automatically send hoga (via cookies)

        // ✅ 4. Retry Original Request
        return api(error.config);
      } catch (err) {
        toast.error("Session expired! Please login again.");
        console.log("Session expired, redirecting to login...");
        setTimeout(() => {
          window.location.href = "/auth/login"; // User ko login page par bhej do

        }, 4000)

      }
    }
    return Promise.reject(error);
  }
);

// ✅ 5. Export Axios Instance
export default api;
