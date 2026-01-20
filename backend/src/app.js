import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";

import downloadRoutes from "./routes/download.routes.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

dotenv.config();

const app = express();

/* ---------- Middlewares ---------- */
app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

app.use("/api", limiter);

/* ---------- Routes ---------- */
app.use("/api/download", downloadRoutes);

/* ---------- Health Check ---------- */
app.get("/", (req, res) => {
  res.send("FB Video Downloader API is running 🚀");
});

/* ---------- Error Middleware ---------- */
app.use(errorMiddleware);

export default app;
