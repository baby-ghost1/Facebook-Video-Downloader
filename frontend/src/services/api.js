
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // baseURL: "http://localhost:5000/api",
  timeout: 30000,
});

export const fetchInfo = (url) =>
  api.post("/download/info", { url }).then((r) => r.data);

export const downloadByQuality = (url, quality) =>
  api.post(
    "/download",
    { url, quality },
    { responseType: "blob" }
  );
