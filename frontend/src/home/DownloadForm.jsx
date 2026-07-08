import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, Download, Globe, Sparkles, Trash2, Clipboard, CheckCircle, Loader } from "lucide-react";
import Button from "../components/ui/Button";
import { PLATFORM_CONFIG } from "../config/platforms";
import { isValidVideoUrl } from "../utils/detectPlatform";

const DownloadForm = ({ url, setUrl, loading, isDownloading, fetchMeta, platform }) => {
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [errorTouched, setErrorTouched] = useState(false);
  const inputRef = useRef(null);

  const urlValid = url && isValidVideoUrl(url);
  const error = errorTouched && !!url && !urlValid;

  const currentPlatform = PLATFORM_CONFIG[platform] || PLATFORM_CONFIG.default;
  const platformColor = currentPlatform.color || "var(--primary)";
  const showSupported = !platform && !url;

  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }
    } catch {}
  }, [setUrl]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "v") {
        if (document.activeElement !== inputRef.current) {
          handlePaste();
        }
      }
      if (e.key === "Enter" && urlValid && !loading) {
        fetchMeta();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [url, loading, fetchMeta, handlePaste]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const text = e.dataTransfer.getData("text");
    if (text && isValidVideoUrl(text)) setUrl(text);
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <motion.div
          className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 border border-[var(--card-border)]"
          style={{
            background: `linear-gradient(135deg, ${platformColor}25, ${platformColor}15)`,
          }}
        >
          <Download size={24} style={{ color: platformColor }} />
        </motion.div>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[var(--text-primary)]">
          {platform
            ? <span>{currentPlatform.name} Downloader</span>
            : <span>Universal Video Downloader</span>
          }
        </h1>
        <p className="mt-2 text-sm text-[var(--text-secondary)] max-w-md mx-auto">
          {currentPlatform.description}
        </p>
      </motion.div>

      {showSupported && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="flex flex-wrap justify-center gap-1.5">
            {Object.entries(PLATFORM_CONFIG)
              .filter(([key]) => key !== "default" && key !== "facebook_reels")
              .slice(0, 10)
              .map(([key, config]) => (
                <motion.span
                  key={key}
                  whileHover={{ scale: 1.08, y: -1 }}
                  className="px-2.5 py-1 rounded-full border text-[11px] font-medium transition-all duration-200 cursor-default"
                  style={{
                    borderColor: `${config.color}25`,
                    background: `${config.color}0a`,
                    color: config.color,
                  }}
                >
                  {config.name}
                </motion.span>
              ))}
            <span
              className="px-2.5 py-1 rounded-full border text-[11px] font-medium"
              style={{
                borderColor: "var(--card-border)",
                background: "var(--bg-tertiary)",
                color: "var(--text-tertiary)",
              }}
            >
              +1000 more
            </span>
          </div>
          <p className="text-center mt-3 text-[11px] text-[var(--text-tertiary)] opacity-60">
            Paste a URL to get started &mdash; works with 1000+ platforms
          </p>
        </motion.div>
      )}

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative transition-all duration-300 rounded-2xl border-2 p-1
          ${isDragging
            ? "border-[var(--primary)] bg-[var(--primary-surface)] border-solid"
            : error
            ? "border-[var(--danger)] bg-[var(--danger-light)] border-solid"
            : "border-dashed border-[var(--input-border)] hover:border-[var(--primary-light)] bg-[var(--input-bg)]"
          }`}
      >
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Link size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
            <input
              ref={inputRef}
              value={url}
              onChange={(e) => { setUrl(e.target.value); setErrorTouched(true); }}
              onFocus={() => !errorTouched && setErrorTouched(false)}
              onBlur={() => { if (url && !urlValid) { setErrorTouched(true); } }}
              placeholder={currentPlatform.placeholder}
              className={`w-full pl-11 pr-4 py-3.5 rounded-xl outline-none transition-all duration-300 bg-[var(--input-bg)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] border ${error ? "border-[var(--danger)] focus:border-[var(--danger)] focus:ring-[var(--danger-light)]" : "border-[var(--input-border)] focus:border-[var(--input-focus)] focus:ring-[var(--primary-glow)]"} focus:ring-2 text-sm`}
            />
          </div>
          <div className="flex gap-2 shrink-0">
            <Button
              onClick={() => { setUrl(""); inputRef.current?.focus(); }}
              variant="secondary"
              size="md"
              icon={Trash2}
            >
              Clear
            </Button>
            <Button
              onClick={handlePaste}
              variant="secondary"
              size="md"
              icon={copied ? CheckCircle : Clipboard}
            >
              {copied ? "Pasted!" : "Paste"}
            </Button>
          </div>
        </div>

        {isDragging && (
          <div className="absolute inset-0 rounded-xl flex items-center justify-center bg-[var(--primary-surface)] backdrop-blur-sm">
            <div className="text-center">
              <Globe size={28} className="mx-auto mb-2 text-[var(--primary)]" />
              <p className="text-sm font-medium text-[var(--primary)]">Drop URL here</p>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="mt-2"
          >
            <p className="text-xs text-[var(--danger)] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--danger)]" />
              Unsupported URL — paste a link from Facebook, YouTube, Instagram, or 1000+ sites
            </p>
          </motion.div>
        )}

        {platform && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex justify-center mt-3"
          >
            <span
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium"
              style={{
                background: `${platformColor}15`,
                border: `1px solid ${platformColor}30`,
                color: platformColor,
              }}
            >
              <CheckCircle size={12} />
              {currentPlatform.name} URL detected
            </span>
          </motion.div>
        )}

        {!platform && urlValid && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex justify-center mt-3"
          >
            <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium bg-[var(--info-light)] border border-[var(--info)]/20 text-[var(--info)]">
              <Sparkles size={12} />
              URL detected — ready to download
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="mt-4"
        initial={false}
        animate={urlValid ? { y: 0, opacity: 1 } : { y: 0, opacity: 0.6 }}
      >
        <Button
          onClick={fetchMeta}
          disabled={!urlValid || loading || isDownloading}
          loading={loading}
          size="xl"
          className="w-full group relative overflow-hidden"
          style={{
            background: urlValid && !loading && !isDownloading
              ? `linear-gradient(135deg, ${platformColor}, ${platformColor}dd)`
              : undefined,
          }}
        >
          <span className="relative z-10 flex items-center gap-2">
            {isDownloading ? (
              <><Loader className="animate-spin" size={18} /> Downloading...</>
            ) : loading ? (
              <><Loader className="animate-spin" size={18} /> Fetching Video Info</>
            ) : (
              <><Download size={20} /> Get Video Info</>
            )}
          </span>
          {urlValid && !loading && !isDownloading && (
            <motion.div
              className="absolute inset-0 bg-white/10"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          )}
        </Button>
      </motion.div>

      <AnimatePresence>
        {!url && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-4 text-center"
          >
            <p className="text-xs text-[var(--text-tertiary)]">
              Press <kbd className="px-1.5 py-0.5 rounded bg-[var(--bg-tertiary)] text-[10px] text-[var(--text-muted)] font-mono">Ctrl+V</kbd> to paste or drag & drop a URL
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DownloadForm;
