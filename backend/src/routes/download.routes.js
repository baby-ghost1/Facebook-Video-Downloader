import express from "express";
import {
  fetchInfo,
  downloadVideo,
} from "../controllers/download.controller.js";

const router = express.Router();

router.post("/info", fetchInfo);      // NEW
router.post("/", downloadVideo);      // download

export default router;
