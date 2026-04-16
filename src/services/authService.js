import api from "../api/axios";

export const loginUser = async (data) => {

  const response = await api.post("/auth/login", data);

  // token store in browser
  localStorage.setItem("token", response.data.token);

  return response.data;

};

export const registerUser = async (data) => {

  const response = await api.post("/auth/register", data);

  // token store in browser
  localStorage.setItem("token", response.token);

  return response.data;

};