// import { isValidFacebookUrl } from "../utils/validateUrl.js";
// import { getVideoInfo } from "../services/ytDlp.service.js";

// export const downloadVideo = async (req, res, next) => {
//   try {
//     const { url } = req.body;

//     if (!url) {
//       return res.status(400).json({
//         success: false,
//         message: "Video URL is required",
//       });
//     }

//     if (!isValidFacebookUrl(url)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid Facebook URL",
//       });
//     }

//     const videoData = await getVideoInfo(url);

//     res.status(200).json({
//       success: true,
//       ...videoData,
//     });
//   } catch (error) {
//     next(error);
//   }
// };




import fs from "fs";
import { isValidFacebookUrl } from "../utils/validateUrl.js";
import {
  getVideoInfo,
  downloadAndMergeByQuality,
} from "../services/ytDlp.service.js";

/* -------- INFO (FAST) -------- */
export const fetchInfo = async (req, res, next) => {
  try {
    const { url } = req.body;

    if (!url || !isValidFacebookUrl(url)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Facebook URL",
      });
    }

    const info = await getVideoInfo(url);

    res.json({
      success: true,
      ...info,
    });
  } catch (e) {
    next(e);
  }
};

/* -------- DOWNLOAD (MERGE + STREAM) -------- */
export const downloadVideo = async (req, res, next) => {
  try {
    const { url, quality } = req.body;

    if (!url || !quality || !isValidFacebookUrl(url)) {
      return res.status(400).json({
        success: false,
        message: "URL and quality are required",
      });
    }

    const { filePath, fileName } =
      await downloadAndMergeByQuality(url, quality);

    res.download(filePath, fileName, (err) => {
      if (err) console.error(err);
      fs.unlink(filePath, () => {}); // cleanup
    });
  } catch (e) {
    next(e);
  }
};
