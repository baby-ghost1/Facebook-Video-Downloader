import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Home from "./pages/Home";
import HowTo from "./pages/HowTo";
import Formats from "./pages/Formats";
import Privacy from "./pages/Privacy";
import About from "./pages/About";

const App = () => {
  return (
    <BrowserRouter>
      {/* Global toaster */}
      <Toaster position="top-right" />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/how-to" element={<HowTo />} />
        <Route path="/formats" element={<Formats />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
