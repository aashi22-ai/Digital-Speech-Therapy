import api from "./api";

export const registerUser = (name, email, password, confirmPassword) =>
  api
    .post("/auth/register", { name, email, password, confirmPassword })
    .then((res) => res.data);

export const loginUser = (email, password) =>
  api.post("/auth/login", { email, password }).then((res) => res.data);

export const getCurrentUser = () => api.get("/auth/me").then((res) => res.data);
