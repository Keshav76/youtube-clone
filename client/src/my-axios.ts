import axios from "axios";

const api = axios.create({
  baseURL: "https://youtube-9r1a.onrender.com/",
  // baseURL: "http://localhost:3001",
  withCredentials: true,
});

export default api;
