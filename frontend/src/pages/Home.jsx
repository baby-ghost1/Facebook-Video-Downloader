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
            transition-all duration-200
            bg-blue-600 hover:bg-blue-700
            hover:translate-y-[-1px]
            active:translate-y-0
            disabled:bg-blue-600/40
            disabled:cursor-not-allowed
          "
        >
          {loading ? "Processing…" : "Fetch Video"}
        </button>

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
                  {" "}· {formatDuration(info.duration)}
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
        <Footer/>
      </div>
    </div>
    </>
  );
};

export default Home;








// import { useEffect, useState } from "react";
// import { isValidFacebookUrl } from "../utils/validators";
// import { fetchInfo, downloadByQuality } from "../services/api";
// import { toast } from "react-hot-toast";
// import Footer from "../components/Footer";
// import Header from "../components/Header";

// /* -------- Duration Formatter -------- */
// const formatDuration = (seconds) => {
//   if (!seconds || seconds <= 0) return "0:00";
//   const t = Math.floor(seconds);
//   const h = Math.floor(t / 3600);
//   const m = Math.floor((t % 3600) / 60);
//   const s = t % 60;
//   return h > 0
//     ? `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
//     : `${m}:${s.toString().padStart(2, "0")}`;
// };

// /* -------- THEME INIT -------- */
// const getInitialTheme = () => {
//   const saved = localStorage.getItem("theme");
//   if (saved === "light" || saved === "dark") return saved;
//   return window.matchMedia("(prefers-color-scheme: dark)").matches
//     ? "dark"
//     : "light";
// };

// const Home = () => {
//   const [url, setUrl] = useState("");
//   const [info, setInfo] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [theme, setTheme] = useState(getInitialTheme);

//   const isValid = isValidFacebookUrl(url);

//   /* -------- APPLY THEME -------- */
//   useEffect(() => {
//     document.body.classList.remove("dark", "light");
//     document.body.classList.add(theme);
//     localStorage.setItem("theme", theme);
//   }, [theme]);

//   /* -------- SIMPLE ANALYTICS (SAFE) -------- */
//   const track = (event) => {
//     console.log("[analytics]", event);
//     // future: window.gtag / plausible.track
//   };

//   /* -------- Fetch Metadata -------- */
//   const fetchMeta = async () => {
//     if (!isValid) {
//       toast.error("Invalid Facebook URL");
//       return;
//     }
//     try {
//       setLoading(true);
//       track("fetch_video");
//       const data = await fetchInfo(url);
//       setInfo(data);
//       setUrl("");
//       toast.success("Video ready");
//     } catch {
//       toast.error("Failed to fetch video info");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* -------- Download -------- */
//   const download = async (quality) => {
//     try {
//       setLoading(true);
//       track(`download_${quality}`);
//       const res = await downloadByQuality(info.sourceUrl || "", quality);
//       const blob = new Blob([res.data], { type: "video/mp4" });
//       const link = document.createElement("a");
//       link.href = URL.createObjectURL(blob);
//       link.download = `facebook-${quality}.mp4`;
//       link.click();
//       toast.success("Download started");
//     } catch {
//       toast.error("Download failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const copyLink = (link) => {
//     navigator.clipboard.writeText(link);
//     toast.success("Link copied");
//     track("copy_link");
//   };

//   return (
//     <>
//       <Header theme={theme} toggleTheme={() => setTheme(p => p === "dark" ? "light" : "dark")} />

//       <div className="min-h-screen pt-24 px-4 flex justify-center">
//         <div className="w-full max-w-xl rounded-2xl bg-white/10 backdrop-blur-xl border border-white/15 p-6">

//           {/* TITLE */}
//           <h1 className="text-2xl font-semibold text-center text-white mb-1">
//             Facebook Video Downloader
//           </h1>
//           <p className="text-sm text-white/60 text-center mb-6">
//             Paste Facebook video or reel link below
//           </p>

//           {/* INPUT ROW */}
//           <div className="flex gap-2 flex-col sm:flex-row">
//             <input
//               value={url}
//               onChange={(e) => setUrl(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && fetchMeta()}
//               placeholder="https://www.facebook.com/..."
//               className="flex-1 px-4 py-3 rounded-xl bg-black/40 text-white border border-white/10 outline-none"
//             />
//             <button
//               onClick={fetchMeta}
//               disabled={!isValid || loading}
//               className="px-6 py-3 rounded-xl bg-blue-600 text-white disabled:opacity-50"
//             >
//               {loading ? "…" : "Download"}
//             </button>
//           </div>

//           {/* EMPTY STATE */}
//           {!info && !loading && (
//             <div className="mt-10 text-center text-white/50 text-sm">
//               Paste a Facebook video link above to get started.
//             </div>
//           )}

//           {/* LOADING SKELETON */}
//           {loading && !info && (
//             <div className="mt-6 animate-pulse space-y-3">
//               <div className="h-20 bg-white/10 rounded-lg" />
//               <div className="h-4 bg-white/10 rounded w-2/3" />
//             </div>
//           )}

//           {/* RESULT */}
//           {info && (
//             <div className="mt-6 space-y-3">
//               <div className="flex gap-3 items-center">
//                 <img src={info.thumbnail} className="w-32 h-20 object-contain bg-black/30 rounded" />
//                 <div className="text-white/80 text-sm">
//                   Facebook Video · {formatDuration(info.duration)}
//                 </div>
//               </div>

//               {info.qualities.map((q) => (
//                 <div key={q} className="flex justify-between items-center border border-white/10 rounded-lg px-4 py-3">
//                   <span className="text-white text-sm">{q}</span>
//                   <div className="flex gap-2">
//                     <button
//                       onClick={() => download(q)}
//                       className="px-3 py-1.5 bg-green-600 text-white rounded"
//                     >
//                       Download
//                     </button>
//                     <button
//                       onClick={() => copyLink(info.directLinks?.[q])}
//                       className="px-3 py-1.5 bg-white/10 text-white rounded"
//                     >
//                       Copy
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}

//           <Footer />
//         </div>
//       </div>
//     </>
//   );
// };

// export default Home;

