import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/auth",
});

export const loginUser = (email, password) =>
  API.post("/login", { email, password });

export const registerUser = (name, email, password) =>
  API.post("/register", { name, email, password });
