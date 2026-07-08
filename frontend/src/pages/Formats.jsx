import Layout from "../components/Layout";
import { motion } from "framer-motion";
import { Monitor, Smartphone, Zap, Download, Check } from "lucide-react";

const formats = [
  { name: "8K Ultra HD", res: "4320p", icon: Monitor, desc: "Insane detail — 7680x4320", note: "Requires high-end hardware", color: "purple", popular: false },
  { name: "4K Ultra HD", res: "2160p", icon: Monitor, desc: "Stunning clarity — 3840x2160", note: "Requires fast connection", color: "purple", popular: false },
  { name: "Quad HD", res: "1440p", icon: Monitor, desc: "Sharp & smooth — 2560x1440", note: "Great for monitors", color: "indigo", popular: false },
  { name: "Full HD", res: "1080p", icon: Monitor, desc: "Best quality — 1920x1080", note: "Requires good connection", color: "blue", popular: true },
  { name: "HD", res: "720p", icon: Monitor, desc: "Balanced quality — 1280x720", note: "Recommended for most users", color: "blue", popular: false },
  { name: "SD", res: "480p", icon: Smartphone, desc: "Good for mobile — 854x480", note: "Moderate file size", color: "green", popular: false },
  { name: "Low", res: "360p", icon: Smartphone, desc: "Small file — 640x360", note: "Fast download", color: "green", popular: false },
  { name: "Very Low", res: "240p", icon: Smartphone, desc: "Minimal bandwidth — 426x240", note: "Lowest usable quality", color: "orange", popular: false },
  { name: "Tiny", res: "144p", icon: Smartphone, desc: "Smallest size — 256x144", note: "Ultra compressed", color: "orange", popular: false },
];

const colorMap = {
  purple: { border: "var(--purple)", bg: "var(--purple-light)", text: "var(--purple)" },
  indigo: { border: "var(--indigo)", bg: "var(--indigo-light)", text: "var(--indigo)" },
  blue: { border: "var(--info)", bg: "var(--glow-blue)", text: "var(--info)" },
  green: { border: "var(--success)", bg: "var(--glow-green)", text: "var(--success)" },
  orange: { border: "var(--warning)", bg: "var(--glow-orange)", text: "var(--warning)" },
};

const Formats = () => {
  return (
    <Layout>
      <div className="glass-card rounded-2xl p-6 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl font-black text-[var(--text-primary)]">Supported Formats</h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">Choose from 9 quality tiers — 144p to 8K</p>
        </motion.div>

        <div className="grid gap-3">
          {formats.map((fmt, i) => {
            const Icon = fmt.icon;
            const c = colorMap[fmt.color];
            return (
              <motion.div
                key={fmt.res}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.01, y: -2 }}
                className="relative rounded-xl p-4"
                style={{
                  background: c.bg,
                  border: `1px solid ${c.border}40`,
                  boxShadow: `0 0 20px ${c.border}15, inset 0 0 20px ${c.border}08${fmt.popular ? `, 0 0 0 2px ${c.border}` : ""}`,
                }}
              >
                {fmt.popular && (
                  <span
                    className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white"
                    style={{ background: c.border, boxShadow: `0 2px 10px ${c.border}60` }}
                  >
                    POPULAR
                  </span>
                )}
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: `${c.border}30`, // darker than card bg
                      border: `1px solid ${c.border}55`,
                      boxShadow: `inset 0 1px 3px ${c.border}30`,
                    }}
                  >
                    <Icon size={20} style={{ color: c.text }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-[var(--text-primary)]">{fmt.name}</h3>
                      <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded" style={{ color: c.text, background: `${c.border}15` }}>{fmt.res}</span>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">{fmt.desc}</p>
                    <p className="text-[11px] text-[var(--text-tertiary)] mt-0.5">{fmt.note}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-[var(--success)]">
                    <Check size={12} />
                    <span>MP4</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default Formats;
