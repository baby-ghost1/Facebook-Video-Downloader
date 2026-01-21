import { Sun, Moon } from "lucide-react";

const ThemeToggle = ({ theme, toggleTheme }) => {
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className={`
        h-8.5 rounded-full
        flex items-center
        transition-all duration-300 ease-in-out
        cursor-pointer
        bg-gray-300 dark:bg-black
        hover:bg-gray-400 dark:hover:bg-zinc-800
        ${isDark ? "pl-3 pr-1.99999" : "pl-1.999999999 pr-3"}
      `}
    >
      {/* CONTENT WRAPPER */}
      <div
        className={`
          flex items-center gap-1.5
          transition-all duration-300
          ${isDark ? "flex-row-reverse" : "flex-row"}
        `}
      >
        {/* ICON */}
        <div
          className="
            w-7.5 h-7.5 rounded-full
            bg-white
            shadow-md
            flex items-center justify-center
          "
        >
          {isDark ? (
            <Moon size={16} className="text-black" />
          ) : (
            <Sun size={16} className="text-yellow-500" />
          )}
        </div>

        {/* TEXT */}
        <span
          className="
            text-xs font-semibold tracking-wide
            text-black dark:text-white
            select-none whitespace-nowrap
          "
        >
          {isDark ? "DARK MODE" : "LIGHT MODE"}
        </span>
      </div>
    </button>
  );
};

export default ThemeToggle;
