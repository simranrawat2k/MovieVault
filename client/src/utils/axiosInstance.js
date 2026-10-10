import axios from "axios";
import { toast } from "react-toastify";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message;

    if (
      error.response?.status === 401 &&
      (message === "Invalid or expired token" ||
        message === "No token provided")
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      toast.error("Your session has expired. Please log in again.");

      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;