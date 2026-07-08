import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "react-hot-toast";

import Home from "./pages/Home";
import HowTo from "./pages/HowTo";
import Formats from "./pages/Formats";
import Privacy from "./pages/Privacy";
import About from "./pages/About";

const pageVariants = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -10, scale: 0.98, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } },
};

const AnimatedPage = ({ children }) => (
  <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
    {children}
  </motion.div>
);

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<AnimatedPage><Home /></AnimatedPage>} />
        <Route path="/how-to" element={<AnimatedPage><HowTo /></AnimatedPage>} />
        <Route path="/formats" element={<AnimatedPage><Formats /></AnimatedPage>} />
        <Route path="/privacy" element={<AnimatedPage><Privacy /></AnimatedPage>} />
        <Route path="/about" element={<AnimatedPage><About /></AnimatedPage>} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Toaster
        position="bottom-center"
        gutter={12}
        toastOptions={{
          duration: 3000,
          style: {
            background: "var(--toast-bg, #fff)",
            color: "var(--toast-color, #0f172a)",
            border: "1px solid var(--toast-border, #e2e8f0)",
            borderRadius: "14px",
            fontSize: "14px",
            padding: "12px 18px",
            boxShadow: "var(--shadow-lg)",
            maxWidth: "420px",
          },
        }}
      />
      <AnimatedRoutes />
    </BrowserRouter>
  );
};

export default App;
