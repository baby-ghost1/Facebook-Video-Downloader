import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, History, Download, Trash2 } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useDownloadStore } from "../store/downloadStore";
import { PLATFORM_CONFIG } from "../config/platforms";

const navItems = [
  { path: "/", label: "Home", icon: "home" },
  { path: "/how-to", label: "Guide", icon: "guide" },
  { path: "/formats", label: "Formats", icon: "formats" },
  { path: "/about", label: "About", icon: "about" },
  { path: "/privacy", label: "Privacy", icon: "privacy" },
];

const Header = ({ theme, toggleTheme }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const historyRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { history, clearHistory } = useDownloadStore();

  useEffect(() => {
    setMenuOpen(false);
    setHistoryOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!historyOpen) return;
    const handleClick = (e) => {
      if (historyRef.current && !historyRef.current.contains(e.target)) {
        setHistoryOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [historyOpen]);

  const PlatformIcon = ({ name }) => {
    const config = PLATFORM_CONFIG[name] || PLATFORM_CONFIG.default;
    const color = config.color || "var(--primary)";
    return (
      <span
        className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold uppercase"
        style={{ background: `${color}20`, color: color }}
      >
        {(name || "C")[0]}
      </span>
    );
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        {/* Animated gradient line at bottom of header */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] overflow-hidden">
          <div
            className="absolute inset-0 animate-gradient-shift bg-[length:200%_100%]"
            style={{
              background: "linear-gradient(90deg, transparent, var(--primary), transparent, var(--primary), transparent)",
              backgroundSize: "200% 100%",
            }}
          />
        </div>

        <div
          className="mx-auto px-4 h-16 flex items-center justify-between backdrop-blur-2xl"
          style={{
            background: "var(--card-bg)",
            boxShadow: "var(--shadow-md)",
          }}
        >
          {/* Logo - moved right with ml-2 */}
          <motion.div
            onClick={() => navigate("/")}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-3 cursor-pointer group ml-1"
          >
            <div className="relative">
              {/* Glow behind logo */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-shadow duration-500">
                <Download size={17} className="text-white drop-shadow-sm" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-200% animate-gradient bg-clip-text text-transparent leading-none">
                Cliply
              </span>
              <span className="text-[9px] font-medium tracking-[0.2em] uppercase text-[var(--text-tertiary)] mt-0.5">
                Universal Downloader
              </span>
            </div>
          </motion.div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 p-1 rounded-2xl" style={{ background: "var(--bg-tertiary)" }}>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300"
                  style={{
                    color: isActive ? "var(--primary)" : "var(--text-secondary)",
                  }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-active-pill"
                      className="absolute inset-0 rounded-xl"
                      style={{
                        background: "var(--card-bg)",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.06), 0 0 0 1px var(--card-border)",
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right side - reduced gap */}
          <div className="flex items-center gap-1">
            {/* History button - bigger and moved left */}
            <div className="relative">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setHistoryOpen(!historyOpen)}
                className="relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 hover:shadow-md"
                style={{
                  background: historyOpen ? "var(--primary-surface)" : "transparent",
                  color: historyOpen ? "var(--primary)" : "var(--text-tertiary)",
                }}
              >
                <History size={18} />
                {history.length > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 min-w-[18px] h-4.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-[9px] font-bold flex items-center justify-center text-white px-1 shadow-lg shadow-blue-500/30"
                  >
                    {history.length > 9 ? "9+" : history.length}
                  </motion.span>
                )}
              </motion.button>

              <AnimatePresence>
                {historyOpen && (
                  <>
                    <div ref={historyRef}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -8, filter: "blur(4px)" }}
                      animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, scale: 0.95, y: -8, filter: "blur(4px)" }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute right-0 top-12 w-80 z-50 backdrop-blur-2xl rounded-2xl overflow-hidden"
                      style={{
                        background: "var(--bg-secondary)",
                        border: "1px solid var(--card-border)",
                        boxShadow: "var(--shadow-xl)",
                      }}
                    >
                      {/* Header with gradient accent */}
                      <div className="relative px-4 py-3 border-b overflow-hidden" style={{ borderColor: "var(--card-border)" }}>
                        <div className="absolute inset-0 opacity-30" style={{ background: "var(--primary-surface)" }} />
                        <div className="relative flex items-center justify-between">
                          <span className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
                            <Download size={14} style={{ color: "var(--primary)" }} />
                            Downloads
                          </span>
                          {history.length > 0 && (
                            <button
                              onClick={clearHistory}
                              className="text-xs flex items-center gap-1 transition-all duration-300 px-2 py-1 rounded-lg hover:shadow-sm"
                              style={{ color: "var(--danger)", background: "var(--danger-light)" }}
                            >
                              <Trash2 size={12} />
                              Clear
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {history.length === 0 ? (
                          <div className="px-4 py-10 text-center">
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background: "var(--bg-tertiary)" }}>
                              <Download size={20} className="text-[var(--text-tertiary)] opacity-40" />
                            </div>
                            <p className="text-sm font-medium text-[var(--text-tertiary)]">No downloads yet</p>
                            <p className="text-xs text-[var(--text-tertiary)] opacity-60 mt-1">Your history will appear here</p>
                          </div>
                        ) : (
                          history.map((item, i) => (
                            <motion.div
                              key={item.id}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.03 }}
                              className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--bg-tertiary)] transition-all duration-200 border-b last:border-0 group/item cursor-pointer"
                              style={{ borderColor: "var(--card-border)" }}
                            >
                              {item.thumbnail ? (
                                <div className="relative flex-shrink-0">
                                  <img src={item.thumbnail} alt="" className="w-10 h-7 rounded-lg object-cover" style={{ background: "var(--bg-tertiary)" }} />
                                  <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-black/5" />
                                </div>
                              ) : (
                                <PlatformIcon name={item.platform} />
                              )}
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-[var(--text-primary)] truncate group-hover/item:text-[var(--primary)] transition-colors">
                                  {item.title || "Unknown"}
                                </p>
                                <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
                                  {item.platform || "video"} · {item.quality}
                                </p>
                              </div>
                            </motion.div>
                          ))
                        )}
                      </div>
                    </motion.div>
                    </div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />

            {/* Mobile menu button - animated hamburger */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300"
              style={{
                background: menuOpen ? "var(--primary-surface)" : "transparent",
                color: menuOpen ? "var(--primary)" : "var(--text-secondary)",
              }}
            >
              <div className="w-[18px] h-[14px] flex flex-col justify-between">
                <span
                  className="block h-[2px] rounded-full transition-all duration-300 ease-[cubic-bezier(0.68,-0.6,0.32,1.6)]"
                  style={{
                    background: "currentColor",
                    transform: menuOpen ? "translateY(6px) rotate(45deg)" : "translateY(0) rotate(0deg)",
                  }}
                />
                <span
                  className="block h-[2px] rounded-full transition-all duration-300 ease-[cubic-bezier(0.68,-0.6,0.32,1.6)]"
                  style={{
                    background: "currentColor",
                    opacity: menuOpen ? 0 : 1,
                    transform: menuOpen ? "scaleX(0)" : "scaleX(1)",
                  }}
                />
                <span
                  className="block h-[2px] rounded-full transition-all duration-300 ease-[cubic-bezier(0.68,-0.6,0.32,1.6)]"
                  style={{
                    background: "currentColor",
                    transform: menuOpen ? "translateY(-6px) rotate(-45deg)" : "translateY(0) rotate(0deg)",
                  }}
                />
              </div>
            </motion.button>
          </div>
        </div>
      </header>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-40 backdrop-blur-sm"
              style={{ background: "rgba(0,0,0,0.3)" }}
            />
            <motion.div
              initial={{ opacity: 0, x: "100%", filter: "blur(8px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: "100%", filter: "blur(8px)" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-72 z-50 backdrop-blur-2xl border-l overflow-hidden"
              style={{
                background: "var(--bg-secondary)",
                borderColor: "var(--card-border)",
                boxShadow: "var(--shadow-xl)",
              }}
            >
              {/* Decorative gradient blob */}
              <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-20" style={{ background: "var(--primary)" }} />

              {/* Close button top right */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setMenuOpen(false)}
                className="absolute top-4 right-4 w-9 h-9 rounded-xl flex items-center justify-center z-10 transition-all duration-300"
                style={{
                  background: "var(--danger-light)",
                  color: "var(--danger)",
                }}
              >
                <X size={18} />
              </motion.button>

              {/* Nav items */}
              <div className="relative px-4 pt-20 space-y-2">
                {navItems.map((item, i) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <motion.button
                      key={item.path}
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 + 0.1 }}
                      onClick={() => navigate(item.path)}
                      className="w-full px-4 py-3.5 rounded-xl text-left text-sm font-medium transition-all duration-300 flex items-center gap-3"
                      style={{
                        background: isActive ? "var(--primary-surface)" : "transparent",
                        color: isActive ? "var(--primary)" : "var(--text-secondary)",
                        boxShadow: isActive ? "0 2px 8px rgba(0,0,0,0.05)" : "none",
                      }}
                    >
                      {isActive && (
                        <div className="w-1 h-5 rounded-full" style={{ background: "var(--primary)" }} />
                      )}
                      {item.label}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </>
  );
};

export default Header;
