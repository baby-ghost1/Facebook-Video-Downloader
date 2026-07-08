import fs from "fs";
import { isValidVideoUrl, detectPlatform } from "../utils/detectPlatform.js";
import { getVideoInfo, downloadAndMergeByQuality, clearCache, getDownloadByUid } from "../services/ytDlp.service.js";

export const fetchInfo = async (req, res, next) => {
  try {
    const { url } = req.body;

    if (!url || !isValidVideoUrl(url)) {
      return res.status(400).json({
        success: false,
        message: "Invalid or unsupported video URL",
      });
    }

    const platform = detectPlatform(url);

    try {
      const info = await getVideoInfo(url);
      return res.json({ success: true, platform, ...info });
    } catch (err) {
      const msg = parseYtDlpError(err, platform);
      return res.status(400).json({ success: false, message: msg });
    }
  } catch (err) {
    next(err);
  }
};

export const downloadVideo = async (req, res, next) => {
  try {
    const { url, quality } = req.body;

    if (!url || !quality || !isValidVideoUrl(url)) {
      return res.status(400).json({
        success: false,
        message: "URL and quality are required",
      });
    }

    const platform = detectPlatform(url);

    try {
      const { filePath, fileName } = await downloadAndMergeByQuality(url, quality);

      res.download(filePath, fileName, (err) => {
        if (err) console.error("Download error:", err.message);
        if (fs.existsSync(filePath)) {
          fs.unlink(filePath, () => {});
        }
      });
    } catch (err) {
      const msg = parseYtDlpError(err, platform);
      return res.status(500).json({ success: false, message: msg });
    }
  } catch (err) {
    next(err);
  }
};

export const downloadByUid = async (req, res, next) => {
  try {
    const { uid } = req.params;
    const file = getDownloadByUid(uid);
    if (!file || !fs.existsSync(file.filePath)) {
      return res.status(404).json({ success: false, message: "File not found or expired" });
    }

    res.download(file.filePath, file.fileName, (err) => {
      if (err) console.error("Download error:", err.message);
      if (fs.existsSync(file.filePath)) {
        fs.unlink(file.filePath, () => {});
      }
    });
  } catch (err) {
    next(err);
  }
};

export const cacheStatus = async (_req, res, next) => {
  try {
    const count = clearCache();
    res.json({ success: true, message: `Cache cleared (${count} entries)` });
  } catch (err) {
    next(err);
  }
};

function parseYtDlpError(err, platform) {
  const stderr = err.stderr || "";
  const msg = err.message || "";

  if (stderr.includes("Video unavailable") || msg.includes("Video unavailable"))
    return "Video is unavailable or has been removed.";
  if (stderr.includes("Private video") || msg.includes("Private video"))
    return "This is a private video. Cannot download private content.";
  if (stderr.includes("Sign in") || msg.includes("Sign in"))
    return `This ${platform || "platform"} content requires login.`;
  if (stderr.includes("HTTP Error 403") || msg.includes("403"))
    return "Access denied by the platform.";
  if (stderr.includes("HTTP Error 404") || msg.includes("404"))
    return "Video not found. Check the URL.";
  if (stderr.includes("Unsupported URL") || msg.includes("Unsupported URL"))
    return `URL not supported for ${platform || "this platform"}.`;
  if (stderr.includes("geoblocked") || msg.includes("geoblocked"))
    return "This content is geoblocked.";
  if (stderr.includes("login") || msg.includes("login"))
    return "This content requires login.";
  if (stderr.includes("cookies") || stderr.includes("cookie"))
    return `${platform || "This platform"} requires login. Log into ${platform || "the site"} in Chrome or Edge, then try again.`;

  return `Failed: ${stderr.slice(0, 200) || msg.slice(0, 200)}`.trim();
}
