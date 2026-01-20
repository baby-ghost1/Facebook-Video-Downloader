import { useState } from "react";
import { isValidFacebookUrl } from "../utils/validators";
import { fetchInfo, downloadByQuality } from "../services/api";
import { toast } from "react-hot-toast";

const formatDuration = (seconds) => {
  if (!seconds || seconds <= 0) return "0:00";

  // ensure integer (remove decimals)
  const total = Math.floor(seconds);

  const hrs = Math.floor(total / 3600);
  const mins = Math.floor((total % 3600) / 60);
  const secs = total % 60;

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }

  return `${mins}:${secs.toString().padStart(2, "0")}`;
};



const Home = () => {
  const [url, setUrl] = useState("");
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchMeta = async () => {
    if (!isValidFacebookUrl(url)) {
      toast.error("Invalid Facebook URL");
      return;
    }

    try {
      setLoading(true);
      const data = await fetchInfo(url);
      setInfo(data);
      toast.success("Video fetched");
    } catch {
      toast.error("Failed to fetch video info");
    } finally {
      setLoading(false);
    }
  };

  const download = async (quality) => {
    try {
      setLoading(true);
      toast.loading("Preparing download...");

      const res = await downloadByQuality(url, quality);

      const blob = new Blob([res.data], { type: "video/mp4" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `facebook-${quality}.mp4`;
      link.click();

      toast.dismiss();
      toast.success("Download started");
    } catch {
      toast.dismiss();
      toast.error("Download failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-xl rounded-2xl bg-white/10 backdrop-blur-xl border border-white/15 shadow-2xl p-6">

        {/* TITLE */}
        <h1 className="text-2xl font-semibold text-center mb-2">
          Facebook Video Downloader
        </h1>

        <p className="text-sm text-white/60 text-center mb-6">
          {/* Paste Facebook video or reel link below */}
        </p>

        {/* INPUT */}
        <input
          type="text"
          placeholder="https://www.facebook.com/..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="
            w-full px-4 py-3 rounded-xl
            bg-black/40 text-white
            placeholder:text-white/40
            outline-none
            border border-white/10
            focus:border-blue-500
            focus:ring-2 focus:ring-blue-500/40
            transition
          "
        />

        {/* FETCH BUTTON */}
        <button
          onClick={fetchMeta}
          disabled={!isValidFacebookUrl(url) || loading}
          className="
            mt-4 w-full py-3 rounded-xl font-medium
            transition-all
            bg-blue-600 hover:bg-blue-700
            disabled:bg-blue-600/40
            disabled:cursor-not-allowed
          "
        >
          {loading ? "Processing..." : "Fetch Video"}
        </button>

        {/* RESULT */}
        {info && (
          <div className="mt-6">

            {/* THUMBNAIL + TEXT (HORIZONTAL, ONE LINE) */}
            <div className="flex items-center gap-3 mb-4">

              {/* Thumbnail – resized, no crop */}
              <div className="w-32 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-black/30">
                <img
                  src={info.thumbnail}
                  alt="thumbnail"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Right side single-line text */}
              <div className="text-sm text-white/80 truncate">
                <span className="font-medium">
                  Facebook Video
                </span>
                <span className="text-white/50">
                   {" "}· {formatDuration(info.duration)}
                </span>
              </div>
            </div>

            {/* QUALITY + DOWNLOAD TABLE */}
            <div className="border border-white/10 rounded-lg overflow-hidden">

              {/* HEADER */}
              <div className="grid grid-cols-3 bg-white/10 text-sm font-semibold px-4 py-2">
                <div>Quality</div>
                <div>Render</div>
                <div>Download</div>
              </div>

              {/* ROWS */}
              {info.qualities.map((q) => (
                <div
                  key={q}
                  className="grid grid-cols-3 items-center px-4 py-3 border-t border-white/10 text-sm"
                >
                  <div>
                    {q === "Full HD"
                      ? "1080p (Full HD)"
                      : q === "HD"
                      ? "720p (HD)"
                      : "360p (SD)"}
                  </div>

                  <div>No</div>

                  <div>
                    <button
                      onClick={() => download(q)}
                      disabled={loading}
                      className="
                        px-4 py-1.5 rounded
                        bg-green-600 hover:bg-green-700
                        transition
                        disabled:opacity-50
                      "
                    >
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default Home;
