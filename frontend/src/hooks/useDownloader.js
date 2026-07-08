import { useCallback } from "react";
import { toast } from "react-hot-toast";
import { useDownloadStore } from "../store/downloadStore";
import { useSocket } from "./useSocket";
import { fetchInfo, downloadByQuality } from "../services/api";
import { isValidVideoUrl } from "../utils/detectPlatform";

export const useDownloader = () => {
  const {
    url, setUrl, setInfo, setPlatform, setLoading, setDownloadStage, setDownloadQuality,
    setDownloadingQuality,
    info, loading, downloadStage, downloadProgress, platform, socketConnected,
    downloadingQuality,
    reset,
  } = useDownloadStore();

  const { startDownload } = useSocket();

  const fetchMeta = useCallback(async () => {
    if (!isValidVideoUrl(url)) {
      toast.error("Please enter a valid video URL");
      return;
    }

    try {
      setLoading(true);
      reset();

      const data = await fetchInfo(url);
      setInfo(data);
      setPlatform(data.platform);
      toast.success(`${data.platform || "Video"} detected!`, {
        icon: "✨",
        duration: 2000,
      });
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to fetch video info";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [url]);

  const download = useCallback(async (quality) => {
    if (!isValidVideoUrl(url)) return;
    setDownloadQuality(quality);
    setDownloadingQuality(quality);

    const usedSocket = startDownload(url, quality);
    if (usedSocket) {
      return;
    }

    try {
      setLoading(true);
      setDownloadStage("fetching", 10);

      const res = await downloadByQuality(url, quality);

      setDownloadStage("downloading", 70);

      const blob = new Blob([res.data], { type: "video/mp4" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `cliply-${quality}-${platform || "video"}.mp4`;
      link.click();
      URL.revokeObjectURL(link.href);

      setDownloadStage("complete", 100);
      setTimeout(() => setDownloadStage(null), 1500);

      useDownloadStore.getState().addToHistory({
        url,
        title: info?.title || "Video",
        quality,
        platform,
        thumbnail: info?.thumbnail,
      });

      toast.success("Download started!", { icon: "📥" });
    } catch (err) {
      setDownloadStage(null);
      const msg = err?.response?.data?.message || "Download failed. Try a different quality.";
      toast.error(msg);
    } finally {
      setLoading(false);
      setDownloadingQuality(null);
    }
  }, [url, info, platform, startDownload]);

  return {
    url, setUrl, info, loading, downloadStage, downloadProgress, platform,
    socketConnected, downloadingQuality, fetchMeta, download, reset,
  };
};
