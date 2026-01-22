

import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import fs from "fs";
import crypto from "crypto";

const execAsync = promisify(exec);
const DOWNLOAD_DIR = path.resolve("downloads");

// ensure downloads dir exists
if (!fs.existsSync(DOWNLOAD_DIR)) {
  fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
}

/* ---------- INFO ---------- */
export const getVideoInfo = async (url) => {
  const { stdout } = await execAsync(`yt-dlp -J "${url}"`);
  const info = JSON.parse(stdout);

  const heights = new Set();
  info.formats?.forEach((f) => {
    if (f.height) heights.add(f.height);
  });

  const qualities = [];
  if ([...heights].some((h) => h >= 1080)) qualities.push("Full HD");
  if ([...heights].some((h) => h >= 720)) qualities.push("HD");
  qualities.push("SD");

  return {
    title: info.title,
    thumbnail: info.thumbnail,
    duration: info.duration,
    qualities,
  };
};

/* ---------- DOWNLOAD + MERGE ---------- */
export const downloadAndMergeByQuality = async (url, quality) => {
  let heightLimit = 480;
  if (quality === "HD") heightLimit = 720;
  if (quality === "Full HD") heightLimit = 1080;

  // unique filename (NO guessing later)
  const uid = crypto.randomBytes(6).toString("hex");
  const outputFile = path.join(DOWNLOAD_DIR, `fb-${uid}.mp4`);

  const cmd = `yt-dlp -f "bestvideo[height<=${heightLimit}]+bestaudio/best" --merge-output-format mp4 -o "${outputFile}" "${url}"`;

  console.log("▶ yt-dlp command:", cmd);

  await execAsync(cmd);

  // verify file REALLY exists
  if (!fs.existsSync(outputFile)) {
    throw new Error("Merged file not created by yt-dlp");
  }

  return {
    filePath: outputFile,
    fileName: `facebook-${quality}.mp4`,
  };
};
