import { motion } from "framer-motion";
import { User, Eye, Calendar, Film } from "lucide-react";
import { PLATFORM_CONFIG } from "../config/platforms";
import formatDuration from "../utils/formatDuration";

const ResultCard = ({ info, platform }) => {
  const currentPlatform = PLATFORM_CONFIG[platform] || PLATFORM_CONFIG.default;
  const platformColor = currentPlatform.color || "var(--primary)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="group rounded-2xl overflow-hidden border transition-all duration-500"
      style={{
        borderColor: "var(--card-border)",
        background: "var(--card-bg)",
      }}
    >
      <div className="flex flex-col sm:flex-row">
        <div className="relative sm:w-48 h-32 sm:h-auto flex-shrink-0 overflow-hidden" style={{ background: "var(--bg-tertiary)" }}>
          {info.thumbnail ? (
            <img
              src={info.thumbnail}
              alt={info.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <Film size={32} className="text-[var(--text-tertiary)] opacity-30" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />

          {info.duration && (
            <div className="absolute bottom-2 right-2 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-xs font-medium text-white/90">
              {formatDuration(info.duration)}
            </div>
          )}

          {platform && (
            <div
              className="absolute top-2 left-2 px-2 py-1 rounded-lg backdrop-blur-sm text-[10px] font-bold tracking-wider uppercase"
              style={{ background: `${platformColor}20`, color: platformColor }}
            >
              {currentPlatform.name}
            </div>
          )}
        </div>

        <div className="flex-1 p-4 min-w-0">
          <h3 className="text-base font-semibold text-[var(--text-primary)] leading-snug line-clamp-2">
            {info.title || "Untitled Video"}
          </h3>

          {info.uploader && (
            <div className="flex items-center gap-1.5 mt-2 text-xs text-[var(--text-secondary)]">
              <User size={12} />
              <span className="truncate">{info.uploader}</span>
            </div>
          )}

          <div className="flex flex-wrap gap-3 mt-3">
            {info.viewCount && (
              <div className="flex items-center gap-1 text-[11px] text-[var(--text-tertiary)]">
                <Eye size={11} />
                <span>{formatCount(info.viewCount)} views</span>
              </div>
            )}
            {info.uploadDate && (
              <div className="flex items-center gap-1 text-[11px] text-[var(--text-tertiary)]">
                <Calendar size={11} />
                <span>{formatDate(info.uploadDate)}</span>
              </div>
            )}
          </div>

          {info.qualities && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {info.qualities.map((q) => {
                const color = q === "4320p" || q === "2160p"
                  ? { bg: "var(--glow-purple)", text: "var(--purple)", border: "var(--purple)" }
                  : q === "1440p"
                  ? { bg: "var(--glow-indigo)", text: "var(--indigo)", border: "var(--indigo)" }
                  : q === "1080p" || q === "720p"
                  ? { bg: "var(--glow-blue)", text: "var(--info)", border: "var(--info)" }
                  : q === "480p" || q === "360p"
                  ? { bg: "var(--glow-green)", text: "var(--success)", border: "var(--success)" }
                  : { bg: "var(--glow-orange)", text: "var(--warning)", border: "var(--warning)" };
                return (
                  <span
                    key={q}
                    className="px-2 py-0.5 rounded-md text-[10px] font-medium border"
                    style={{ background: color.bg, color: color.text, borderColor: `${color.border}30` }}
                  >
                    {q}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

function formatCount(num) {
  if (!num) return "0";
  if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
  return num.toString();
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const s = dateStr.toString();
  if (s.length === 8) return `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;
  return s;
}

export default ResultCard;
