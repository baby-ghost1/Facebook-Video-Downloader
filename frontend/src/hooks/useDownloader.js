import { useState } from "react";
import { fetchVideoInfo } from "../services/api";
import { toast } from "react-hot-toast";

export const useDownloader = () => {
  const [loading, setLoading] = useState(false);
  const [video, setVideo] = useState(null);

  const getVideo = async (url) => {
    try {
      setLoading(true);
      setVideo(null);

      const data = await fetchVideoInfo(url);
      setVideo(data);

      toast.success("Video fetched successfully");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        "Failed to fetch video";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    video,
    getVideo,
  };
};
