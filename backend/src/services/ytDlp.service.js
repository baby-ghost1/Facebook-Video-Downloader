// // import YTDlpWrap from "yt-dlp-wrap";

// // const ytDlp = new YTDlpWrap();

// // export const getVideoInfo = async (url) => {
// //   try {
// //     const info = await ytDlp.getVideoInfo(url);

// //     if (!info || !info.formats) {
// //       throw new Error("No video formats found");
// //     }

// //     const qualityMap = new Map();

// //     info.formats.forEach((format) => {
// //       // Only mp4 video (no audio-only)
// //       if (
// //         format.ext === "mp4" &&
// //         format.vcodec !== "none" &&
// //         format.url
// //       ) {
// //         const height = format.height || 0;

// //         let label = "SD";
// //         if (height >= 720) label = "HD";
// //         if (height >= 1080) label = "Full HD";

// //         // keep best bitrate per quality
// //         if (
// //           !qualityMap.has(label) ||
// //           (format.tbr || 0) > qualityMap.get(label).tbr
// //         ) {
// //           qualityMap.set(label, {
// //             quality: label,
// //             height,
// //             url: format.url,
// //             tbr: format.tbr || 0,
// //           });
// //         }
// //       }
// //     });

// //     const formats = Array.from(qualityMap.values())
// //       .sort((a, b) => b.height - a.height)
// //       .map(({ quality, url }) => ({ quality, url }));

// //     return {
// //       title: info.title,
// //       thumbnail: info.thumbnail,
// //       formats,
// //     };
// //   } catch (error) {
// //     console.error("yt-dlp error:", error.message);
// //     throw new Error("Unable to fetch Facebook video");
// //   }
// // };



// import { exec } from "child_process";
// import { promisify } from "util";

// const execAsync = promisify(exec);

// export const getVideoInfo = async (url) => {
//   try {
//     const command = `yt-dlp -J "${url}"`;
//     const { stdout } = await execAsync(command);

//     const info = JSON.parse(stdout);

//     if (!info.formats) {
//       throw new Error("No formats found");
//     }

//     const qualityMap = new Map();

//     info.formats.forEach((format) => {
//       if (
//         format.ext === "mp4" &&
//         format.vcodec !== "none" &&
//         format.url
//       ) {
//         const height = format.height || 0;

//         let label = "SD";
//         if (height >= 720) label = "HD";
//         if (height >= 1080) label = "Full HD";

//         if (
//           !qualityMap.has(label) ||
//           (format.tbr || 0) > qualityMap.get(label).tbr
//         ) {
//           qualityMap.set(label, {
//             quality: label,
//             height,
//             url: format.url,
//             tbr: format.tbr || 0,
//           });
//         }
//       }
//     });

//     const formats = Array.from(qualityMap.values())
//       .sort((a, b) => b.height - a.height)
//       .map(({ quality, url }) => ({ quality, url }));

//     return {
//       title: info.title,
//       thumbnail: info.thumbnail,
//       formats,
//     };
//   } catch (error) {
//     console.error("yt-dlp error:", error.message);
//     throw new Error("Unable to fetch Facebook video");
//   }
// };






// import { exec } from "child_process";
// import { promisify } from "util";
// import path from "path";
// import fs from "fs";

// const execAsync = promisify(exec);
// const DOWNLOAD_DIR = path.resolve("downloads");

// /* -------- INFO (FAST, NO DOWNLOAD) -------- */
// export const getVideoInfo = async (url) => {
//   const { stdout } = await execAsync(`yt-dlp -J "${url}"`);
//   const info = JSON.parse(stdout);

//   const heights = new Set();
//   info.formats?.forEach((f) => {
//     if (f.height) heights.add(f.height);
//   });

//   const qualities = [];
//   if ([...heights].some((h) => h >= 1080)) qualities.push("Full HD");
//   if ([...heights].some((h) => h >= 720)) qualities.push("HD");
//   qualities.push("SD");

//   return {
//     title: info.title,
//     thumbnail: info.thumbnail,
//     qualities,
//   };
// };

// /* -------- DOWNLOAD + MERGE (WITH SOUND) -------- */
// export const downloadAndMergeByQuality = async (url, quality) => {
//   let heightLimit = 480;
//   if (quality === "HD") heightLimit = 720;
//   if (quality === "Full HD") heightLimit = 1080;

//   const outputTemplate = path.join(
//     DOWNLOAD_DIR,
//     "fb-%(id)s.%(ext)s"
//   );

//   const cmd = `
//     yt-dlp
//     -f "bestvideo[height<=${heightLimit}]+bestaudio/best"
//     --merge-output-format mp4
//     -o "${outputTemplate}"
//     "${url}"
//   `;

//   await execAsync(cmd);

//   const file = fs
//     .readdirSync(DOWNLOAD_DIR)
//     .find((f) => f.endsWith(".mp4"));

//   if (!file) throw new Error("Merged file not found");

//   return {
//     filePath: path.join(DOWNLOAD_DIR, file),
//     fileName: file,
//   };
// };





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
