import Layout from "../components/Layout";
import { motion } from "framer-motion";
import { Copy, Link, Download, CheckCircle, Sparkles } from "lucide-react";

const steps = [
  { icon: Copy, title: "Copy URL", desc: "Copy the video URL from Facebook, YouTube, Instagram, or any supported platform.", color: "purple" },
  { icon: Link, title: "Paste Link", desc: "Paste the URL into the input box. Press Ctrl+V or click the Paste button.", color: "blue" },
  { icon: Download, title: "Fetch Info", desc: "Click 'Get Video Info' to fetch available quality options.", color: "indigo" },
  { icon: CheckCircle, title: "Select & Download", desc: "Choose your preferred quality (SD, HD, or Full HD) and download instantly.", color: "green" },
];

const stepColors = {
  purple: { bg: "var(--purple-light)", border: "var(--purple)", text: "var(--purple)" },
  blue: { bg: "var(--info-light)", border: "var(--info)", text: "var(--info)" },
  indigo: { bg: "var(--indigo-light)", border: "var(--indigo)", text: "var(--indigo)" },
  green: { bg: "var(--success-light)", border: "var(--success)", text: "var(--success)" },
};

const HowTo = () => {
  return (
    <Layout>
      <div className="glass-card rounded-2xl p-6 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl font-black text-[var(--text-primary)]">How to Download</h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">Download any video in 4 simple steps</p>
        </motion.div>

        <div className="space-y-4">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const c = stepColors[step.color] || stepColors.blue;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-4 p-4 rounded-xl border transition-all duration-300 hover:shadow-md"
                style={{ background: "var(--bg-secondary)", borderColor: "var(--card-border)" }}
              >
                <div
                  className="w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0"
                  style={{ background: c.bg, borderColor: c.border }}
                >
                  <Icon size={18} style={{ color: c.text }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold" style={{ color: c.text, opacity: 0.6 }}>STEP {i + 1}</span>
                    <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${c.border}40, transparent)` }} />
                  </div>
                  <h3 className="text-sm font-semibold text-[var(--text-primary)] mt-1">{step.title}</h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">{step.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default HowTo;
