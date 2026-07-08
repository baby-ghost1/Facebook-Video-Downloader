import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, DownloadCloud, FileCheck, Merge, Zap } from "lucide-react";

const stageConfig = {
  connecting: {
    label: "Connecting",
    icon: Loader2,
    color: "var(--info)",
    bg: "var(--info-light)",
    border: "var(--info)",
  },
  fetching: {
    label: "Fetching Video",
    icon: DownloadCloud,
    color: "var(--purple)",
    bg: "var(--purple-light)",
    border: "var(--purple)",
  },
  downloading: {
    label: "Downloading",
    icon: Loader2,
    color: "var(--info)",
    bg: "var(--info-light)",
    border: "var(--info)",
  },
  merging: {
    label: "Merging Streams",
    icon: Merge,
    color: "var(--warning)",
    bg: "var(--warning-light)",
    border: "var(--warning)",
  },
  finalizing: {
    label: "Finalizing",
    icon: FileCheck,
    color: "var(--success)",
    bg: "var(--success-light)",
    border: "var(--success)",
  },
  complete: {
    label: "Complete!",
    icon: Zap,
    color: "var(--success)",
    bg: "var(--success-light)",
    border: "var(--success)",
  },
};

const ProgressBar = ({ stage, percent }) => {
  if (!stage) return null;

  const config = stageConfig[stage] || stageConfig.fetching;
  const Icon = config.icon;
  const isSpinning = stage === "connecting" || stage === "downloading" || stage === "fetching";
  const displayPercent = percent || 0;

  const progressGradient = stage === "complete"
    ? "var(--progress-complete)"
    : stage === "merging"
    ? "var(--progress-merging)"
    : "var(--progress-default)";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10, height: 0 }}
        animate={{ opacity: 1, y: 0, height: "auto" }}
        exit={{ opacity: 0, y: -10, height: 0 }}
        className="rounded-xl border p-4"
        style={{
          borderColor: `${config.border}20`,
          background: config.bg,
        }}
      >
        <div className="flex items-center gap-3">
          <div className={isSpinning ? "animate-spin" : ""}>
            <Icon size={18} style={{ color: config.color }} />
          </div>
          <span className="text-sm font-medium" style={{ color: config.color }}>
            {config.label}
          </span>
          <span className="ml-auto flex items-center gap-2">
            {displayPercent > 0 && (
              <span className="text-xs text-[var(--text-tertiary)] font-mono">
                {displayPercent.toFixed(0)}%
              </span>
            )}
            {stage === "downloading" && displayPercent > 0 && (
              <span className="text-[10px] text-[var(--text-tertiary)] opacity-60 hidden sm:inline">
                {(displayPercent * 0.15 + 0.5).toFixed(1)} MB/s
              </span>
            )}
          </span>
        </div>

        <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--progress-track)" }}>
          <motion.div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{ background: progressGradient }}
            initial={{ width: 0 }}
            animate={{ width: `${Math.max(displayPercent, stage === "complete" ? 100 : 5)}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProgressBar;
