import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

const Header = ({ theme, toggleTheme }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((p) => !p);
  const closeMenu = () => setMenuOpen(false);

  const navigate = useNavigate();

  return (
    <>
      {/* HEADER */}
      <header
        className="
        w-full fixed top-0 left-0 z-50
        backdrop-blur bg-white/5
        border-b border-white/10
      "
      >
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          {/* BRAND */}
        {/* <div className="
  text-2xl font-extrabold tracking-tight
  bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500
  bg-clip-text text-transparent
  drop-shadow-[0_1px_8px_rgba(99,102,241,0.6)]
">
  Cliply.
</div> */}


{/* <div className="text-2xl font-extrabold tracking-tight 
                text-white drop-shadow-[0_0_12px_rgba(59,130,246,0.6)]">
  Cliply<span className="text-blue-400">.</span>
</div> */}


<div className="text-2xl font-extrabold tracking-tight 
                bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 
                bg-300% animate-gradient 
                bg-clip-text text-transparent">
  Cliply<span>.</span>
</div>


          {/* RIGHT */}
          <div className="flex items-center gap-4">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />

            {/* HAMBURGER / X BUTTON */}
            <button
              onClick={toggleMenu}
              className="
                relative w-9 h-9
                flex items-center justify-center
                rounded-lg
                hover:bg-white/10
                transition
              "
            >
              <span
                className={`
                  absolute h-0.5 w-5 bg-current
                  transition-all duration-300
                  ${menuOpen ? "rotate-45 translate-y-0" : "-translate-y-1.5"}
                `}
              />
              <span
                className={`
                  absolute h-0.5 w-5 bg-current
                  transition-all duration-300
                  ${menuOpen ? "opacity-0" : "opacity-100"}
                `}
              />
              <span
                className={`
                  absolute h-0.5 w-5 bg-current
                  transition-all duration-300
                  ${menuOpen ? "-rotate-45 translate-y-0" : "translate-y-1.5"}
                `}
              />
            </button>
          </div>
        </div>
      </header>

      {/* BACKDROP */}
      {menuOpen && (
        <div onClick={closeMenu} className="fixed inset-0 z-40 bg-black/40" />
      )}

      {/* MENU */}
      <div
        className={`
          fixed top-14 right-6 z-50
          w-64 rounded-xl
          bg-zinc-900/95 backdrop-blur-xl
          border border-white/10
          shadow-lg
          transition-all duration-300 ease-out
          ${
            menuOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-2 pointer-events-none"
          }
        `}
      >
        <div className="py-2 text-sm">
          <MenuItem
            onClick={() => {
              closeMenu();
              navigate("/how-to");
            }}
          >
            How to download video
          </MenuItem>

          <MenuItem
            onClick={() => {
              closeMenu();
              navigate("/formats");
            }}
          >
            Supported formats
          </MenuItem>

          <MenuItem
            onClick={() => {
              closeMenu();
              navigate("/privacy");
            }}
          >
            Privacy & Usage
          </MenuItem>

          <MenuItem
            onClick={() => {
              closeMenu();
              navigate("/about");
            }}
          >
            About Cliply
          </MenuItem>
        </div>
      </div>
    </>
  );
};

/* MENU ITEM */
const MenuItem = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="
      w-full text-left px-4 py-2
      text-white/80
      hover:bg-white/10
      transition
    "
  >
    {children}
  </button>
);

export default Header;
