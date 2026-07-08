import { spawn, execSync } from "child_process";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { fileURLToPath } from "url";
import { getPlatformOptions } from "./platform.service.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOWNLOAD_DIR = path.join(__dirname, "../../downloads");
if (!fs.existsSync(DOWNLOAD_DIR)) {
  fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
}

// Periodic cleanup of old downloaded files (runs every 10 min, deletes files older than 30 min)
const cleanupDownloads = () => {
  try {
    const files = fs.readdirSync(DOWNLOAD_DIR);
    const now = Date.now();
    let cleaned = 0;
    for (const file of files) {
      const filePath = path.join(DOWNLOAD_DIR, file);
      try {
        const stat = fs.statSync(filePath);
        if (stat.isFile() && now - stat.mtimeMs > 30 * 60 * 1000) {
          fs.unlinkSync(filePath);
          cleaned++;
        }
      } catch {}
    }
    if (cleaned > 0) console.log(`[Cliply] Cleaned ${cleaned} old download files`);
  } catch {}
};
cleanupDownloads();
setInterval(cleanupDownloads, 10 * 60 * 1000);

const CACHE = new Map();
const CACHE_TTL = 5 * 60 * 1000;

const findYtDlp = () => {
  const isWin = process.platform === "win32";
  const bundled = path.join(__dirname, "../../bin", isWin ? "yt-dlp.exe" : "yt-dlp");

  try {
    const cmd = isWin ? "where.exe yt-dlp" : "which yt-dlp";
    const result = execSync(cmd, { encoding: "utf-8", stdio: "pipe" }).trim();
    const firstLine = result.split("\n")[0].trim();
    if (firstLine && fs.existsSync(firstLine)) return firstLine;
  } catch {}

  if (fs.existsSync(bundled)) return bundled;

  try {
    const cmd = isWin ? "where.exe yt-dlp.exe" : "which yt-dlp";
    const result = execSync(cmd, { encoding: "utf-8", stdio: "pipe" }).trim();
    const firstLine = result.split("\n")[0].trim();
    if (firstLine && fs.existsSync(firstLine)) return firstLine;
  } catch {}

  throw new Error(
    "yt-dlp not found. Install it:\n" +
    (isWin ? "  Windows: winget install yt-dlp" : "  macOS: brew install yt-dlp\n  Linux: sudo apt install yt-dlp")
  );
};

const YTDLP_PATH = findYtDlp();
console.log(`[Cliply] Using yt-dlp: ${YTDLP_PATH}`);

const COOKIES_FILE = path.join(DOWNLOAD_DIR, "cookies.txt");
const COOKIES_PLATFORMS = new Set([
  "instagram", "facebook", "tiktok", "youtube",
  "x", "reddit", "pinterest", "twitch", "threads",
]);
let cookiesAttempted = false;

const ensureCookies = () => {
  if (cookiesAttempted) return;
  if (fs.existsSync(COOKIES_FILE) && fs.statSync(COOKIES_FILE).size > 50) return;

  const browsers = process.platform === "win32"
    ? ["chrome", "edge", "firefox", "brave"]
    : ["chrome", "firefox", "brave", "edge"];

  for (const browser of browsers) {
    try {
      console.log(`[Cliply] Trying to extract cookies from ${browser}...`);
      const nullDev = process.platform === "win32" ? "nul" : "/dev/null";
      execSync(
        `"${YTDLP_PATH}" --cookies-from-browser ${browser} --cookies "${COOKIES_FILE}" --skip-download --no-warnings "https://www.youtube.com" 2>${nullDev}`,
        { timeout: 15000, windowsHide: true, shell: true }
      );
      if (fs.existsSync(COOKIES_FILE) && fs.statSync(COOKIES_FILE).size > 100) {
        console.log(`[Cliply] Cookies extracted from ${browser}`);
        return;
      }
    } catch {}
  }
  console.log("[Cliply] No browser cookies available. Log into sites in Chrome/Edge for best results.");
  cookiesAttempted = true;
};

const getCookieArgs = (platform) => {
  if (!COOKIES_PLATFORMS.has(platform)) return [];
  ensureCookies();
  if (fs.existsSync(COOKIES_FILE) && fs.statSync(COOKIES_FILE).size > 100) {
    return ["--cookies", COOKIES_FILE];
  }
  return [];
};

const buildArgs = (extraArgs, tailArgs) => {
  return [
    "--no-warnings",
    "--no-check-certificate",
    "-N", "4",
    ...extraArgs,
    ...tailArgs,
  ];
};

const runYtDlp = (args) => {
  return new Promise((resolve, reject) => {
    const proc = spawn(YTDLP_PATH, args, { windowsHide: true });

    let stdout = "";
    let stderr = "";

    proc.stdout.on("data", (chunk) => { stdout += chunk; });
    proc.stderr.on("data", (chunk) => { stderr += chunk; });

    proc.on("close", (code) => {
      if (code === 0) resolve({ stdout, stderr });
      else {
        const err = new Error(stderr || "yt-dlp failed");
        err.stderr = stderr;
        reject(err);
      }
    });
    proc.on("error", reject);
  });
};

export const getVideoInfo = async (url) => {
  if (!url) throw new Error("URL is required");

  const cached = CACHE.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log(`[Cliply] Cache hit for: ${url.slice(0, 50)}`);
    return cached.data;
  }

  const { platform, extraArgs } = getPlatformOptions(url);
  const cookieArgs = getCookieArgs(platform);
  const args = buildArgs([...extraArgs, ...cookieArgs], ["-J", url]);

  const { stdout, stderr } = await runYtDlp(args);

  const info = JSON.parse(stdout);

  const hasVideo = (f) => f.vcodec && f.vcodec !== "none";
  const hasAudio = (f) => f.acodec && f.acodec !== "none";

  const mergedHeights = new Set();
  const singleFileHeights = new Set();

  for (const format of info.formats || []) {
    if (!format.height) continue;
    if (hasVideo(format) && hasAudio(format)) {
      singleFileHeights.add(format.height);
    }
    if (hasVideo(format)) {
      mergedHeights.add(format.height);
    }
  }

  const availableHeights = mergedHeights.size > 0 ? mergedHeights : singleFileHeights;

  const QUALITY_MAP = [
    { label: "4320p", minHeight: 4320 },
    { label: "2160p", minHeight: 2160 },
    { label: "1440p", minHeight: 1440 },
    { label: "1080p", minHeight: 1080 },
    { label: "720p",  minHeight: 720 },
    { label: "480p",  minHeight: 480 },
    { label: "360p",  minHeight: 360 },
    { label: "240p",  minHeight: 240 },
    { label: "144p",  minHeight: 144 },
  ];

  const qualities = [];
  for (const q of QUALITY_MAP) {
    if ([...availableHeights].some((h) => h >= q.minHeight)) {
      qualities.push(q.label);
    }
  }

  if (qualities.length === 0 && info.formats && info.formats.length > 0) {
    qualities.push("360p");
  }

  const result = {
    title: info.title,
    thumbnail: info.thumbnail,
    duration: info.duration,
    uploader: info.uploader || info.channel || "Unknown",
    viewCount: info.view_count,
    uploadDate: info.upload_date,
    extractor: info.extractor,
    webpageUrl: info.webpage_url,
    platform,
    qualities,
    filesize: info.filesize || info.filesize_approx,
  };

  CACHE.set(url, { data: result, timestamp: Date.now() });

  setTimeout(() => {
    if (CACHE.has(url) && CACHE.get(url).data === result) {
      CACHE.delete(url);
    }
  }, CACHE_TTL + 1000);

  return result;
};

const QUALITY_HEIGHT_MAP = {
  "4320p": 4320, "2160p": 2160, "1440p": 1440,
  "1080p": 1080, "720p": 720, "480p": 480,
  "360p": 360, "240p": 240, "144p": 144,
};

export const downloadAndMergeByQuality = async (url, quality, onProgress) => {
  const { platform } = getPlatformOptions(url);

  const heightLimit = QUALITY_HEIGHT_MAP[quality] || 480;

  const uid = crypto.randomUUID();
  const outputTemplate = path.join(DOWNLOAD_DIR, `${uid}.%(ext)s`);
  const finalFile = path.join(DOWNLOAD_DIR, `${uid}.mp4`);

  const { extraArgs } = getPlatformOptions(url);
  const cookieArgs = getCookieArgs(platform);

  const formatStrategies = [
    `bestvideo[height<=${heightLimit}][ext=mp4]+bestaudio[ext=m4a]/bestvideo[height<=${heightLimit}]+bestaudio`,
    `best[height<=${heightLimit}]/best`,
    `bestvideo+bestaudio/best`,
  ];

  const playerClients = ["web,mweb", "mweb", "tv", "tv_embedded", "web"];

  let lastError = null;

  for (const client of playerClients) {
    for (const formatStr of formatStrategies) {
      const clientArgs = platform === "youtube"
        ? ["--extractor-args", `youtube:player_client=${client}`]
        : [];

      const args = buildArgs([...extraArgs, ...cookieArgs, ...clientArgs], [
        "-f", formatStr,
        "--merge-output-format", "mp4",
        "--no-playlist",
        "--newline",
        "-o", outputTemplate,
        url,
      ]);

      console.log(`[Cliply] Downloading: ${url.slice(0, 60)}... [${quality}] client=${client}`);

      if (onProgress) onProgress({ stage: "fetching", percent: 0, message: "Fetching video streams..." });

      try {
        const result = await runDownload(args, finalFile, onProgress);
        return result;
      } catch (err) {
        lastError = err;
        const stderr = err.stderr || "";
        if (stderr.includes("Requested format is not available") || stderr.includes("format")) {
          console.log(`[Cliply] Format not available, trying next...`);
          if (fs.existsSync(finalFile)) fs.unlinkSync(finalFile);
          continue;
        }
        if (stderr.includes("Sign in") || stderr.includes("429") || stderr.includes("Too Many Requests")) {
          console.log(`[Cliply] Auth/rate limit issue, trying next client...`);
          if (fs.existsSync(finalFile)) fs.unlinkSync(finalFile);
          break;
        }
        throw err;
      }
    }
  }

  throw lastError || new Error("No available format for this video");
};

const runDownload = (args, finalFile, onProgress) => {
  return new Promise((resolve, reject) => {
    const proc = spawn(YTDLP_PATH, args, { windowsHide: true });
    let stderr = "";

    proc.stderr.on("data", (chunk) => {
      stderr += chunk;
      const text = chunk.toString();

      const progressMatch = text.match(/(\d+\.?\d*)%/);
      if (progressMatch && onProgress) {
        const pct = parseFloat(progressMatch[1]);
        if (pct <= 100) {
          onProgress({ stage: "downloading", percent: pct, message: `Downloading... ${pct.toFixed(0)}%` });
        }
      }

      if (text.includes("Merging") && onProgress) {
        onProgress({ stage: "merging", percent: 90, message: "Merging audio & video streams..." });
      }
    });

    proc.on("close", async (code) => {
      if (code !== 0) {
        if (fs.existsSync(finalFile)) fs.unlinkSync(finalFile);
        const err = new Error(stderr || "Download failed");
        err.stderr = stderr;
        return reject(err);
      }

      await waitForFile(finalFile, 10000);

      if (!fs.existsSync(finalFile)) {
        return reject(new Error("Video download failed. The format may not be available."));
      }

      if (onProgress) onProgress({ stage: "finalizing", percent: 100, message: "Finalizing download..." });

      resolve({
        filePath: finalFile,
        fileName: `cliply-${Date.now()}.mp4`,
        uid: path.basename(finalFile, ".mp4"),
      });
    });

    proc.on("error", reject);
  });
};

function waitForFile(filePath, timeout) {
  return new Promise((resolve) => {
    const start = Date.now();
    const check = () => {
      if (fs.existsSync(filePath)) return resolve();
      if (Date.now() - start > timeout) return resolve();
      setTimeout(check, 200);
    };
    check();
  });
}

const DOWNLOADED_FILES = new Map();

export const getDownloadByUid = (uid) => {
  return DOWNLOADED_FILES.get(uid) || null;
};

// In downloadAndMergeByQuality, register the completed file
// (this is done via a patch at the call site in downloadQueue.js)

export const clearCache = () => {
  const count = CACHE.size;
  CACHE.clear();
  console.log(`[Cliply] Cache cleared (${count} entries)`);
  return count;
};

export const registerDownload = (uid, filePath, fileName) => {
  DOWNLOADED_FILES.set(uid, { filePath, fileName });
  setTimeout(() => {
    DOWNLOADED_FILES.delete(uid);
  }, 5 * 60 * 1000);
};
