import api from "../api/axios";

export const loginUser = async (data) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const registerUser = async (data) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const requestLoginOtp = async (mobileNumber) => {
  const response = await api.post("/auth/login-otp/request", { mobileNumber });
  return response.data;
};

export const loginWithOtp = async (data) => {
  const response = await api.post("/auth/login-otp/verify", data);
  return response.data;
};