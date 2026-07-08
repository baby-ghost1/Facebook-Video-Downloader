import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

const ThemeToggle = ({ theme, toggleTheme }) => {
  const isDark = theme === "dark";

  return (
    <motion.button
      onClick={toggleTheme}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      className="relative w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-300"
      style={{
        background: isDark ? "var(--primary-surface)" : "rgba(234,179,8,0.12)",
        border: "1px solid var(--card-border)",
      }}
    >
      <motion.div
        key={isDark ? "moon" : "sun"}
        initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {isDark ? (
          <Moon size={16} className="text-[var(--primary)]" />
        ) : (
          <Sun size={16} className="text-[var(--warning)]" />
        )}
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
