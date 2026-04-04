import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

export const register = async ({userName, email, password}) => {
  try {
    const response = await api.post("/api/auth/register", {
      userName,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.log("frontend register error aaa gya hai!", error);
    throw error
  }
};

export const login = async ({email, password}) => {
  try {
    const response = await api.post("/api/auth/login", { email, password });
    return response.data;
  } catch (error) {
    console.log("frontend login error aaa gya hai!", error);
    throw error
  }
};

export const logout = async () => {
  try {
    const response = await api.get("/api/auth/logout");
    return response.data;
  } catch (error) {
    console.log("frontend logout error aa gya hai!", error);
  }
};

export const getUser = async () => {
  try {
    const response = await api.get("/api/auth/get-me");
    return response.data;
  } catch (error) {
    console.log("frontend get-me user error aa gya hai!", error);
  }
};
