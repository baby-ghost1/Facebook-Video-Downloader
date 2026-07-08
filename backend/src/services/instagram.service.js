import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOWNLOAD_DIR = path.join(__dirname, "../../downloads");

const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1",
  "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36",
];

const extractShortcode = (url) => {
  const match = url.match(/(?:instagram\.com\/(?:p|reel|reels|tv)\/)([^/?]+)/i);
  return match ? match[1] : null;
};

const fetchWithRetry = async (url, headers) => {
  for (const ua of USER_AGENTS) {
    try {
      const res = await fetch(url, {
        headers: { ...headers, "User-Agent": ua },
        redirect: "follow",
        signal: AbortSignal.timeout(10000),
      });
      if (res.ok) return res;
    } catch {}
  }
  throw new Error("Failed to fetch Instagram page");
};

const extractMediaUrl = (html) => {
  const ogVideo = html.match(/<meta\s+property="og:video"[^>]+content="([^"]+)"/i);
  if (ogVideo) return { url: ogVideo[1], type: "video" };

  const ogImage = html.match(/<meta\s+property="og:image"[^>]+content="([^"]+)"/i);
  if (ogImage) return { url: ogImage[1], type: "image" };

  const videoUrlMatch = html.match(/"video_url"\s*:\s*"([^"]+)"/);
  if (videoUrlMatch) return { url: videoUrlMatch[1].replace(/\\u0026/g, "&"), type: "video" };

  const displayUrl = html.match(/"display_url"\s*:\s*"([^"]+)"/);
  if (displayUrl) return { url: displayUrl[1].replace(/\\u0026/g, "&"), type: "image" };

  return null;
};

const extractTitle = (html) => {
  const titleMatch = html.match(/<meta\s+property="og:title"[^>]+content="([^"]+)"/i);
  if (titleMatch) return titleMatch[1].replace(/\\u0026/g, "&");
  return null;
};

export const getInstagramInfo = async (url) => {
  const shortcode = extractShortcode(url);
  if (!shortcode) throw new Error("Invalid Instagram URL");

  const pageUrl = `https://www.instagram.com/p/${shortcode}/`;

  const res = await fetchWithRetry(pageUrl, {
    Accept: "text/html,application/xhtml+xml",
    "Accept-Language": "en-US,en;q=0.9",
  });

  const html = await res.text();
  const media = extractMediaUrl(html);

  if (!media) {
    throw new Error("Could not extract media URL. Instagram may have changed their page structure.");
  }

  const title = extractTitle(html) || `Instagram ${media.type} - ${shortcode}`;

  const thumbnail = media.type === "video"
    ? html.match(/<meta\s+property="og:image"[^>]+content="([^"]+)"/i)?.[1]
    : media.url;

  const downloadUrl = media.url.startsWith("//") ? `https:${media.url}` : media.url;

  return {
    title,
    thumbnail: thumbnail?.startsWith("//") ? `https:${thumbnail}` : thumbnail || null,
    duration: null,
    uploader: null,
    viewCount: null,
    uploadDate: null,
    platform: "instagram",
    qualities: ["HD", "SD"],
    directUrl: downloadUrl,
    mediaType: media.type,
  };
};

export const downloadInstagramMedia = async (url, quality, onProgress) => {
  const info = await getInstagramInfo(url);
  if (!info.directUrl) throw new Error("No media URL found");

  if (onProgress) onProgress({ stage: "fetching", percent: 10, message: "Fetching media..." });

  const res = await fetch(info.directUrl, {
    headers: {
      "User-Agent": USER_AGENTS[0],
      Referer: "https://www.instagram.com/",
    },
    redirect: "follow",
  });

  if (!res.ok) throw new Error(`Failed to download: HTTP ${res.status}`);

  const uid = crypto.randomUUID();
  const ext = info.mediaType === "video" ? "mp4" : "jpg";
  const finalFile = path.join(DOWNLOAD_DIR, `${uid}.${ext}`);

  if (onProgress) onProgress({ stage: "downloading", percent: 30, message: "Downloading media..." });

  const reader = res.body.getReader();
  const writer = fs.createWriteStream(finalFile);
  let downloaded = 0;
  const total = parseInt(res.headers.get("content-length") || "0", 10);

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    writer.write(value);
    downloaded += value.length;
    if (total && onProgress) {
      const pct = Math.round((downloaded / total) * 100);
      onProgress({ stage: "downloading", percent: pct, message: `Downloading... ${pct}%` });
    }
  }

  writer.end();
  await new Promise((resolve) => writer.on("finish", resolve));

  if (onProgress) onProgress({ stage: "finalizing", percent: 100, message: "Finalizing..." });

  return {
    filePath: finalFile,
    fileName: `instagram-${quality || "HD"}.${ext}`,
    uid,
  };
};
