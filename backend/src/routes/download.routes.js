import express from "express";
import { fetchInfo, downloadVideo, cacheStatus, downloadByUid } from "../controllers/download.controller.js";

const router = express.Router();

router.post("/info", fetchInfo);
router.post("/", downloadVideo);
router.post("/clear-cache", cacheStatus);
router.get("/file/:uid", downloadByUid);

export default router;
