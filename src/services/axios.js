import axios from "axios";

export const server = axios.create({
  baseURL: "http://localhost:3005",
  timeout: 4000
})