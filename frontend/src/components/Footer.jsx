import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer
      className="
        mt-10 text-center text-xs leading-relaxed
        text-slate-600 dark:text-white/40
      "
    >
      {/* Made with */}
      <div className="font-bold flex justify-center items-center gap-1 select-none leading-none">
  Made with 
  <Heart
    className="
      heart-icon
      w-4.5 h-4.5
      text-red-500 fill-red-500
      dark:text-red-400 dark:fill-red-400
    "
  /> 
  by Me
</div>

      {/* Year */}
      <div className="mt-1 text-slate-500 dark:text-white/40">
        &copy; {new Date().getFullYear()}
      </div>

      {/* Disclaimer */}
      <div
        className="
          mt-3 max-w-md mx-auto
          text-[11px]
          text-slate-500 dark:text-white/30
        "
      >
        Disclaimer: This tool is provided for personal and educational use only.
        The developer does not host, store, or claim ownership of any downloaded
        media. All rights to the content belong to their respective copyright
        owners. Users are responsible for ensuring that their use of downloaded
        content complies with applicable laws and platform policies.
      </div>
    </footer>
  );
};

export default Footer;
