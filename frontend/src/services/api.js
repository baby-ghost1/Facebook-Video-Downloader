// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:5000/api",
//   timeout: 20000,
// });

// export const fetchVideoInfo = async (url) => {
//   const res = await api.post("/download", { url });
//   return res.data;
// };



import axios from "axios";
import dotenv from 'dotenv';

dotenv.config();

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
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
