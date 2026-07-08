import Layout from "../components/Layout";
import { motion } from "framer-motion";
import { Download, Zap, Globe, Heart } from "lucide-react";

const About = () => {
  return (
    <Layout>
      <div className="glass-card rounded-2xl p-6 md:p-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4 shadow-xl">
            <Download size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-[var(--text-primary)]">Cliply</h1>
          <p className="mt-1 text-sm text-[var(--text-tertiary)]">v2.0.0</p>
          <p className="mt-4 text-sm text-[var(--text-secondary)] max-w-sm mx-auto leading-relaxed">
            A fast, modern, and secure universal video downloader powered by yt-dlp.
            Supports 1000+ platforms with real-time progress and batch downloads.
          </p>

          <div className="flex justify-center gap-3 mt-6">
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border"
              style={{ background: "var(--bg-secondary)", borderColor: "var(--card-border)" }}
            >
              <Zap size={14} className="text-[var(--info)]" />
              <span className="text-xs text-[var(--text-secondary)]">Real-time</span>
            </div>
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border"
              style={{ background: "var(--bg-secondary)", borderColor: "var(--card-border)" }}
            >
              <Globe size={14} className="text-[var(--purple)]" />
              <span className="text-xs text-[var(--text-secondary)]">1000+ Sites</span>
            </div>
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border"
              style={{ background: "var(--bg-secondary)", borderColor: "var(--card-border)" }}
            >
              <Heart size={14} className="text-[var(--danger)]" />
              <span className="text-xs text-[var(--text-secondary)]">Free</span>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t" style={{ borderColor: "var(--card-border)" }}>
            <p className="text-xs text-[var(--text-tertiary)] opacity-60">
              Built with React 19, Vite, Tailwind v4, Framer Motion, Zustand, TanStack Query, and Socket.io
            </p>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default About;
