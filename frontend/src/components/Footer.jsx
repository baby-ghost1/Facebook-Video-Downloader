import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-16 pb-8 text-center">
      <div className="flex items-center justify-center gap-1.5 text-sm text-[var(--text-tertiary)]">
        <span>Made with</span>
        <Heart className="heartbeat w-4 h-4 text-[var(--danger)]" style={{ fill: "var(--danger-light)" }} />
        <span>by <span className="font-semibold text-[var(--text-secondary)]">Cliply</span></span>
      </div>
      <div className="mt-1 text-xs text-[var(--text-tertiary)]">
        &copy; {new Date().getFullYear()} Cliply &middot; v2.0.0
      </div>
      <div className="mt-4 max-w-xl mx-auto text-[11px] leading-relaxed text-[var(--text-tertiary)] opacity-50">
        This tool is for personal and educational use only. No media is stored or hosted.
        Users must comply with applicable laws and platform terms.
      </div>
    </footer>
  );
};

export default Footer;
