import axios from "axios";

export const server = axios.create({
  baseURL: "http://localhost:5000",
  timeout: 4000
})