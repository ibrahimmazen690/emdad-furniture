import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { LanguageProvider } from "./context/LanguageContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoadingScreen from "./components/LoadingScreen";
import VoiceAvatar from "./components/VoiceAvatar";
import Home from "./pages/Home";
import Collections from "./pages/Collections";
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import ARPage from "./pages/AR";
import Contact from "./pages/Contact";
import QuoteEstimator from "./pages/QuoteEstimator";
import Wishlist from "./pages/Wishlist";
import Timeline from "./pages/Timeline";
import Appointment from "./pages/Appointment";
import Portal from "./pages/Portal";
import Admin from "./pages/Admin";
import RoomAnalyzer from "./pages/RoomAnalyzer";

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: { opacity: 0, y: -8, transition: { duration: 0.25 } },
};

// Routes that use their own full-screen layout (no site nav/footer)
const STANDALONE_ROUTES = ["/portal", "/admin"];

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
}

function ScrollToHash() {
  const { hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    }
  }, [hash]);
  return null;
}

function AppContent() {
  const location = useLocation();
  const [loading, setLoading] = useState(
    () => sessionStorage.getItem("emdad-loaded") !== "1",
  );

  const isStandalone = STANDALONE_ROUTES.some((r) =>
    location.pathname.startsWith(r),
  );

  const handleLoaded = () => {
    sessionStorage.setItem("emdad-loaded", "1");
    setLoading(false);
  };

  return (
    <>
      {loading && !isStandalone && <LoadingScreen onDone={handleLoaded} />}

      <div
        className="min-h-screen"
        style={{
          background: "#FAF7F2",
          visibility: loading && !isStandalone ? "hidden" : "visible",
        }}
      >
        <ScrollToTop />
        <ScrollToHash />

        {/* Global nav — hidden on standalone portal/admin pages */}
        {!isStandalone && <Navbar />}

        <AnimatePresence mode="wait" initial={false}>
          {isStandalone ? (
            // Standalone pages: no animation wrapper needed, they control their own layout
            <Routes location={location} key={location.pathname}>
              <Route path="/portal" element={<Portal />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          ) : (
            <motion.main
              key={location.pathname}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <Routes location={location}>
                <Route path="/" element={<Home />} />
                <Route path="/collections" element={<Collections />} />
                <Route path="/product" element={<ProductDetail />} />
                <Route path="/about" element={<About />} />
                <Route path="/ar" element={<ARPage />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/quote" element={<QuoteEstimator />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/timeline" element={<Timeline />} />
                <Route path="/appointment" element={<Appointment />} />
                <Route path="/analyze" element={<RoomAnalyzer />} />
                <Route path="*" element={<Home />} />
              </Routes>
            </motion.main>
          )}
        </AnimatePresence>

        {!isStandalone && <Footer />}
        {!isStandalone && <VoiceAvatar />}

        {/* WhatsApp Float Button — hidden on standalone pages */}
        {!isStandalone && (
          <motion.a
            href="https://wa.me/962779989944?text=Hello%20EMDAD%2C%20I%27d%20like%20to%20inquire%20about%20your%20furniture."
            target="_blank"
            rel="noopener noreferrer"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 3.5, type: "spring" }}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl"
            style={{ background: "#25D366" }}
            aria-label="Chat on WhatsApp"
          >
            <svg
              className="w-7 h-7 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </motion.a>
        )}
      </div>
    </>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
