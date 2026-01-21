import { Sun, Moon, Menu } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const Header = ({ theme, toggleTheme }) => {
  return (
    <header
      className="
        w-full fixed top-0 left-0 z-50
        backdrop-blur bg-white/5
        border-b border-white/10
      "
    >
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">

        {/* LEFT: LOGO / BRAND */}
        <div
          className="
            text-xl font-extrabold tracking-tight
            font-[ui-rounded]
          "
        >
          Cliply
        </div>

        {/* RIGHT: MENU + THEME */}
        <div className="flex items-center gap-4">

          {/* Day / Night Toggle */}
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />

          {/* Hamburger (future use) */}
          <button
            className="
              w-9 h-9 rounded-lg
              flex items-center justify-center
              hover:bg-white/10
              transition
            "
          >
            <Menu size={24} />
          </button>

        </div>
      </div>
    </header>
  );
};

export default Header;
