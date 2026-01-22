import { useEffect, useState } from "react";
import { isValidFacebookUrl } from "../utils/validators";
import { fetchInfo, downloadByQuality } from "../services/api";
import { toast } from "react-hot-toast";
import Footer from "../components/Footer";
import Header from "../components/Header";

/* -------- Duration Formatter -------- */
const formatDuration = (seconds) => {
  if (!seconds || seconds <= 0) return "0:00";

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

/* -------- THEME INIT -------- */
const getInitialTheme = () => {
  const saved = localStorage.getItem("theme");
  if (saved === "light" || saved === "dark") return saved;

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const Home = () => {
  const [url, setUrl] = useState("");
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloadStage, setDownloadStage] = useState(null);
  const [theme, setTheme] = useState(getInitialTheme);

  /* -------- APPLY THEME -------- */
  useEffect(() => {
    document.body.classList.remove("dark", "light");
    document.body.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((p) => (p === "dark" ? "light" : "dark"));
  };

  /* -------- Fetch Metadata -------- */
  const fetchMeta = async () => {
    if (!isValidFacebookUrl(url)) {
      toast.error("Invalid Facebook URL");
      return;
    }

    try {
      setLoading(true);
      const data = await fetchInfo(url);
      setInfo(data);
      toast.success("Video ready");
    } catch {
      toast.error("Failed to fetch video info");
    } finally {
      setLoading(false);
    }
  };

  /* -------- Download with Progress -------- */
  const download = async (quality) => {
    try {
      setLoading(true);

      setDownloadStage("Fetching streams…");
      await new Promise((r) => setTimeout(r, 400));

      setDownloadStage("Merging audio & video…");
      await new Promise((r) => setTimeout(r, 600));

      setDownloadStage("Preparing file…");
      const res = await downloadByQuality(url, quality);

      setDownloadStage("Starting download…");

      const blob = new Blob([res.data], { type: "video/mp4" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `facebook-${quality}.mp4`;
      link.click();

      setDownloadStage(null);
      toast.success("Download started");
    } catch {
      setDownloadStage(null);
      toast.error("Download failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* HEADER */}
      <Header theme={theme} toggleTheme={toggleTheme} />

      <div className="min-h-screen pt-24 flex items-center justify-center px-4">
        <div
          // ref={cardRef}
          className="
          w-full max-w-xl rounded-2xl
          bg-white/10 backdrop-blur-xl
          border border-white/15
          shadow-[0_20px_50px_rgba(0,0,0,0.35)]
          p-6 transition-all
        "
        >
          {/* TITLE */}
          <h1 className="text-2xl font-semibold text-center tracking-tight mb-1">
            Facebook Video Downloader
          </h1>

          <p className="text-sm text-white/60 text-center mb-6">
            Paste Facebook video or reel link below
          </p>

          {/* INPUT + FETCH BUTTON */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="https://www.facebook.com/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="
      flex-1 px-4 py-3 rounded-xl
      bg-black/40 text-white
      placeholder:text-white/40
      outline-none
      border border-white/10
      focus:border-blue-500
      focus:ring-2 focus:ring-blue-500/40
      transition
    "
            />

            <button
              onClick={fetchMeta}
              disabled={!isValidFacebookUrl(url) || loading}
              className="
      px-4.5 py-1.5 ml-1 rounded-xl font-medium
      transition-all duration-200
      bg-blue-600 hover:bg-blue-700
      active:translate-y-0
      disabled:bg-blue-600/40
      disabled:cursor-not-allowed
    "
            >
              {loading ? "Processing…" : "Download"}
            </button>
          </div>

          {/* RESULT */}
          {info && (
            <div className="mt-6 animate-[fadeIn_0.35s_ease-out]">
              {/* THUMBNAIL + META */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-32 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-black/30">
                  <img
                    src={info.thumbnail}
                    alt="thumbnail"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="text-sm text-white/80 truncate">
                  <span className="font-medium">Facebook Video</span>
                  <span className="text-white/50">
                    {" "}
                    · {formatDuration(info.duration)}
                  </span>
                </div>
              </div>

              {/* PROGRESS */}
              {downloadStage && (
                <div className="mb-4 px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <div className="flex items-center gap-3 text-sm text-blue-300">
                    <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                    <span>{downloadStage}</span>
                  </div>
                </div>
              )}

              {/* DESKTOP TABLE */}
              <div className="hidden md:block border border-white/10 rounded-lg overflow-hidden">
                <div className="grid grid-cols-3 bg-white/10 text-sm font-semibold px-4 py-2">
                  <div>Quality</div>
                  <div>Render</div>
                  <div className="text-right pr-6">Download</div>
                </div>

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

                    <div className="text-white/50">No</div>

                    {/* RIGHT ALIGNED DOWNLOAD BUTTON */}
                    <div className="flex justify-end pr-2">
                      <button
                        onClick={() => download(q)}
                        disabled={loading}
                        className="
                        px-4 py-1.5 rounded-md
                        bg-green-600 hover:bg-green-700
                        transition-all
                        hover:translate-y-[-1px]
                        disabled:opacity-50
                        disabled:cursor-not-allowed
                      "
                      >
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* MOBILE CARDS (unchanged) */}
              <div className="md:hidden space-y-3">
                {info.qualities.map((q) => (
                  <div
                    key={q}
                    className="border border-white/10 rounded-lg p-4 bg-white/5"
                  >
                    <div className="text-sm mb-2">
                      <span className="font-medium">
                        {q === "Full HD"
                          ? "1080p (Full HD)"
                          : q === "HD"
                            ? "720p (HD)"
                            : "360p (SD)"}
                      </span>
                      <span className="text-white/50"> · No render</span>
                    </div>

                    <button
                      onClick={() => download(q)}
                      disabled={loading}
                      className="
                      w-full py-2 rounded-lg
                      bg-green-600 hover:bg-green-700
                      transition-all
                      hover:translate-y-[-1px]
                      disabled:opacity-50
                      disabled:cursor-not-allowed
                    "
                    >
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Home;
