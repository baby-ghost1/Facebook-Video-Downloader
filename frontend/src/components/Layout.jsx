import Header from "./Header";
import Footer from "./Footer";
import BackgroundEffects from "./background/BackgroundEffects";
import ScrollToTop from "./ScrollToTop";
import useTheme from "../hooks/useTheme";

const Layout = ({ children }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="relative min-h-screen">
      <BackgroundEffects />
      <Header theme={theme} toggleTheme={toggleTheme} />
      <ScrollToTop />
      <main className="relative z-10 min-h-screen pt-28 pb-8 px-4">
        <div className="max-w-3xl mx-auto mt-4">
          {children}
          <Footer />
        </div>
      </main>
    </div>
  );
};

export default Layout;
