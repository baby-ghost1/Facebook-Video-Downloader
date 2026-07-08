import { useEffect, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { useDownloadStore } from "../store/downloadStore";
import { toast } from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const SOCKET_URL = API_URL.replace("/api", "") || "http://localhost:5000";

const triggerFileDownload = async (uid, fileName) => {
  try {
    const res = await axios.get(`${API_URL}/download/file/${uid}`, {
      responseType: "blob",
      timeout: 300000,
    });

    const blob = new Blob([res.data], { type: "video/mp4" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName || "cliply-video.mp4";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(link.href), 10000);
  } catch (err) {
    toast.error("File expired or not found. Try downloading again.");
  }
};

export const useSocket = () => {
  const socketRef = useRef(null);
  const {
    setSocketConnected, setDownloadStage, setInfo, setLoading, setJobId,
    setDownloadingQuality,
    addToHistory, setUrl,
  } = useDownloadStore();

  useEffect(() => {
    const socket = io(SOCKET_URL, { transports: ["websocket", "polling"] });
    socketRef.current = socket;

    socket.on("connect", () => setSocketConnected(true));
    socket.on("disconnect", () => setSocketConnected(false));

    socket.on("progress", (data) => {
      setDownloadStage(data.stage, data.percent || 0);
    });

    socket.on("download-complete", (data) => {
      const state = useDownloadStore.getState();
      setLoading(false);
      setDownloadingQuality(null);

      if (data.uid) {
        triggerFileDownload(data.uid, data.fileName);
      }

      setTimeout(() => {
        setDownloadStage(null);
        setJobId(null);
      }, 1000);

      addToHistory({
        url: state.url,
        title: state.info?.title || "Video",
        quality: data.quality || state.downloadQuality || "HD",
        platform: state.platform,
        thumbnail: state.info?.thumbnail,
      });

      toast.success("Download started!", { icon: "📥" });
    });

    socket.on("error", (data) => {
      setLoading(false);
      setDownloadStage(null);
      setJobId(null);
      setDownloadingQuality(null);
      toast.error(data.message || "Download failed");
    });

    socket.on("job-queued", (data) => {
      setJobId(data.jobId);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const startDownload = useCallback((downloadUrl, quality) => {
    if (!socketRef.current?.connected) {
      return false;
    }

    setLoading(true);
    setDownloadStage("connecting", 0);

    socketRef.current.emit("download", { url: downloadUrl, quality });
    return true;
  }, []);

  return { startDownload, socket: socketRef.current };
};
