import { motion } from "framer-motion";
import { Download, Check, Zap, Monitor, Smartphone, AudioLines, ArrowDownToLine, Sparkles } from "lucide-react";
import Button from "../components/ui/Button";

const qualityMeta = {
  "4320p": { label: "4320p", badge: "8K", icon: Monitor, desc: "Ultra HD 8K — max quality", bars: 5, color: "purple" },
  "2160p": { label: "2160p", badge: "4K", icon: Monitor, desc: "Ultra HD 4K — stunning detail", bars: 5, color: "purple" },
  "1440p": { label: "1440p", badge: "2K", icon: Monitor, desc: "Quad HD — sharp & smooth", bars: 4, color: "indigo" },
  "1080p": { label: "1080p", badge: "Full HD", icon: Monitor, desc: "Full HD — great quality", bars: 3, color: "blue" },
  "720p":  { label: "720p",  badge: "HD", icon: Monitor, desc: "HD — balanced & reliable", bars: 3, color: "blue" },
  "480p":  { label: "480p",  badge: "SD", icon: Smartphone, desc: "480p — good for mobile", bars: 2, color: "green" },
  "360p":  { label: "360p",  badge: "SD", icon: Smartphone, desc: "360p — smaller file", bars: 2, color: "green" },
  "240p":  { label: "240p",  badge: "LD", icon: Smartphone, desc: "240p — low bandwidth", bars: 1, color: "orange" },
  "144p":  { label: "144p",  badge: "LD", icon: Smartphone, desc: "144p — minimal size", bars: 1, color: "orange" },
};

const colorMap = {
  purple: { bg: "var(--purple-light)", border: "var(--purple)", text: "var(--purple)", bar: "var(--purple)", glow: "var(--purple-light)" },
  indigo: { bg: "var(--indigo-light)", border: "var(--indigo)", text: "var(--indigo)", bar: "var(--indigo)", glow: "var(--indigo-light)" },
  blue: { bg: "var(--glow-blue)", border: "var(--info)", text: "var(--info)", bar: "var(--info)", glow: "var(--glow-blue)" },
  green: { bg: "var(--glow-green)", border: "var(--success)", text: "var(--success)", bar: "var(--success)", glow: "var(--glow-green)" },
  orange: { bg: "var(--glow-orange)", border: "var(--warning)", text: "var(--warning)", bar: "var(--warning)", glow: "var(--glow-orange)" },
};

const QualityCard = ({ quality, loading, download, platform, index, isDownloadingThis }) => {
  const meta = qualityMeta[quality] || qualityMeta.SD;
  const Icon = meta.icon;
  const c = colorMap[meta.color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.01, y: -2 }}
      className="rounded-2xl p-4 transition-all duration-300 cursor-pointer hover:shadow-lg group/card"
      style={{
        background: c.bg,
        border: `1px solid ${c.border}30`,
        boxShadow: `0 0 30px ${c.glow}`,
      }}
      onClick={() => { if (!loading && !isDownloadingThis) download(quality); }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: c.bg }}
          >
            <Icon size={22} style={{ color: c.text }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg text-[var(--text-primary)]">{meta.label}</h3>
              <span
                className="px-2 py-0.5 rounded-md text-[10px] font-bold"
                style={{ background: c.bg, color: c.text }}
              >
                {meta.badge}
              </span>
            </div>
            <p className="text-xs text-[var(--text-tertiary)] mt-0.5">{meta.desc}</p>
            <div className="flex gap-1 mt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="w-4 h-1.5 rounded-full transition-all duration-300"
                  style={{
                    background: i < meta.bars ? c.bar : "var(--progress-track)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <div className="flex -space-x-1">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center"
              style={{ background: c.bg }}
            >
              <AudioLines size={10} style={{ color: c.text }} />
            </div>
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center"
              style={{ background: c.bg }}
            >
              <Check size={10} style={{ color: c.text }} />
            </div>
          </div>
          <Button
            variant="primary"
            size="md"
            icon={Zap}
            loading={isDownloadingThis}
            disabled={loading || isDownloadingThis}
          >
            {isDownloadingThis ? "Downloading..." : "Download"}
          </Button>
        </div>
      </div>

      <div className="sm:hidden mt-3">
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          icon={Download}
          loading={isDownloadingThis}
          disabled={loading || isDownloadingThis}
        >
          {isDownloadingThis ? "Downloading..." : `Download ${meta.label}`}
        </Button>
      </div>
    </motion.div>
  );
};

const QualityList = ({ qualities, loading, download, platform, downloadingQuality }) => {
  if (!qualities || qualities.length === 0) return null;

  const bestQuality = qualities[0];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Zap size={16} className="text-[var(--info)]" />
          <h3 className="text-sm font-semibold text-[var(--text-secondary)]">Select Quality</h3>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon={Sparkles}
          onClick={() => download(bestQuality)}
          disabled={loading || !!downloadingQuality}
          loading={downloadingQuality === bestQuality}
        >
          {downloadingQuality === bestQuality ? "Downloading..." : `Best · ${bestQuality}`}
        </Button>
      </div>
      {qualities.map((quality, index) => (
        <QualityCard
          key={quality}
          quality={quality}
          loading={loading}
          download={download}
          platform={platform}
          index={index}
          isDownloadingThis={downloadingQuality === quality}
        />
      ))}
    </div>
  );
};

export default QualityList;
