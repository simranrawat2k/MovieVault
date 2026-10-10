import axiosInstance from "../utils/axiosInstance";

async function authRequest(endpoint, data) {
  try {
    const response = await axiosInstance.post(`/auth${endpoint}`, data);

    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message || error.message || "Something went wrong.";

    throw new Error(message, { cause: error });
  }
}

export const signup = (data) => authRequest("/signup", data);
export const verifyEmail = (data) => authRequest("/verify-email", data);
export const resendOtp = (data) => authRequest("/resend-otp", data);
export const login = (data) => authRequest("/login", data);
export const forgotPassword = (data) => authRequest("/forgot-password", data);
export const resetPassword = (data) => authRequest("/reset-password", data);