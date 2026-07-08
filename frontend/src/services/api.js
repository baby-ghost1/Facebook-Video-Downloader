import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 300000,
  headers: { "Accept": "application/json" },
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.code === "ECONNABORTED") {
      err.response = { data: { message: "Request timed out. The server may be busy." } };
    }
    return Promise.reject(err);
  }
);

export const fetchInfo = (url) =>
  api.post("/download/info", { url }).then((r) => r.data);

export const downloadByQuality = (url, quality) =>
  api.post("/download", { url, quality }, { responseType: "blob" });
