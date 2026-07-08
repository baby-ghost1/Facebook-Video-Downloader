import { getVideoInfo, downloadAndMergeByQuality, registerDownload } from "./ytDlp.service.js";
import fs from "fs";
import crypto from "crypto";

const MAX_CONCURRENT = 2;
let activeDownloads = 0;
const pendingQueue = [];
const activeJobs = new Map();

export const setupSocketHandlers = (io) => {
  io.on("connection", (socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`);

    socket.on("fetch-info", async (url, callback) => {
      try {
        const info = await getVideoInfo(url);
        callback({ success: true, ...info });
      } catch (err) {
        callback({ success: false, message: parseError(err) });
      }
    });

    socket.on("download", (data) => {
      const { url, quality, jobId } = data;
      const id = jobId || crypto.randomUUID();

      const emit = (event, payload) => {
        io.to(socket.id).emit(event, { ...payload, jobId: id });
      };

      const job = { url, quality, socketId: socket.id, jobId: id, emit };
      enqueueDownload(job);
      socket.emit("job-queued", { jobId: id, position: pendingQueue.length + activeDownloads + 1 });
    });

    socket.on("disconnect", () => {
      console.log(`[Socket] Client disconnected: ${socket.id}`);
      for (const [id, job] of activeJobs) {
        if (job.socketId === socket.id) {
          job.cancelled = true;
          activeJobs.delete(id);
        }
      }
    });
  });
};

function enqueueDownload(job) {
  if (activeDownloads < MAX_CONCURRENT) {
    processJob(job);
  } else {
    pendingQueue.push(job);
  }
}

async function processJob(job) {
  activeDownloads++;
  activeJobs.set(job.jobId, job);

  try {
    job.emit("progress", { stage: "fetching", percent: 0, message: "Fetching video info..." });

    const info = await getVideoInfo(job.url);
    job.emit("info-ready", { success: true, ...info });

    job.emit("progress", { stage: "downloading", percent: 0, message: "Starting download..." });

    const result = await downloadAndMergeByQuality(job.url, job.quality, (progress) => {
      if (job.cancelled) return;
      job.emit("progress", progress);
    });

    if (job.cancelled) {
      if (fs.existsSync(result.filePath)) fs.unlinkSync(result.filePath);
      return;
    }

    registerDownload(result.uid, result.filePath, result.fileName);

    job.emit("progress", { stage: "complete", percent: 100, message: "Download complete! Sending file..." });
    job.emit("download-complete", { ...result, quality: job.quality });
  } catch (err) {
    if (!job.cancelled) {
      job.emit("error", { message: parseError(err) });
    }
  } finally {
    activeDownloads--;
    activeJobs.delete(job.jobId);
    if (pendingQueue.length > 0) {
      const next = pendingQueue.shift();
      processJob(next);
    }
  }
}

function parseError(err) {
  const stderr = err.stderr || "";
  const msg = err.message || "";

  if (stderr.includes("Video unavailable") || msg.includes("Video unavailable"))
    return "Video is unavailable or has been removed.";
  if (stderr.includes("Private video") || msg.includes("Private video"))
    return "This is a private video. Cannot download private content.";
  if (stderr.includes("Sign in") || msg.includes("Sign in"))
    return "This content requires login. Cannot download.";
  if (stderr.includes("HTTP Error 403") || msg.includes("403"))
    return "Access denied by the platform. The content may be restricted.";
  if (stderr.includes("HTTP Error 404") || msg.includes("404"))
    return "Video not found. Check the URL and try again.";
  if (stderr.includes("Unsupported URL") || msg.includes("Unsupported URL"))
    return "This URL is not supported.";
  if (stderr.includes("geoblocked") || msg.includes("geoblocked"))
    return "This content is geoblocked.";
  if (stderr.includes("login") || msg.includes("login"))
    return "This content requires you to be logged in.";
  if (stderr.includes("cookies") || stderr.includes("cookie"))
    return "Login required. Log into this site in Chrome or Edge and try again.";

  return `Download failed: ${stderr.slice(0, 200) || msg.slice(0, 200)}`.trim();
}
