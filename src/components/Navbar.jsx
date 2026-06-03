import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "../context/LanguageContext";
import { useWishlist } from "../hooks/useWishlist";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { t, lang, toggle: toggleLang, isAr } = useLang();
  const { count: wishCount } = useWishlist();

  const navLinks = [
    { path: "/", label: t.nav.home },
    { path: "/#categories", label: t.nav.categories },
    { path: "/collections", label: t.nav.collections },
    { path: "/about", label: t.nav.about },
    { path: "/ar", label: t.nav.ar },
    { path: "/contact", label: t.nav.contact },
    { path: "/appointment", label: t.nav.appointment },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  const isActive = (p) =>
    p === "/" ? location.pathname === "/" : location.pathname.startsWith(p);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled
            ? "rgba(13,11,9,0.97)"
            : "linear-gradient(to bottom, rgba(13,11,9,0.8), transparent)",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          boxShadow: scrolled ? "0 1px 40px rgba(0,0,0,0.5)" : "none",
        }}
        dir={isAr ? "rtl" : "ltr"}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20 md:h-24">
            <Link to="/" className="flex items-center group">
              <img
                src="/images/logo.jpeg"
                alt="EMDAD Logo"
                className="h-16 md:h-20 object-contain group-hover:opacity-80 transition-opacity duration-300"
              />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path + link.label}
                  to={link.path}
                  className="relative group font-body text-xs tracking-[0.18em] uppercase transition-colors duration-300"
                  style={{
                    color:
                      isActive(link.path) && link.path !== "/#categories"
                        ? "#D4AC5A"
                        : "rgba(255,255,255,0.85)",
                  }}
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 h-px bg-gradient-to-r from-yellow-500 to-yellow-300 w-0 group-hover:w-full transition-all duration-300" />
                </Link>
              ))}

              {/* Portal link */}
              <Link
                to="/portal"
                className="relative font-body text-xs tracking-[0.18em] uppercase text-white/85 hover:text-yellow-400 transition-colors flex items-center gap-1.5"
              >
                <svg
                  className="w-3.5 h-3.5 opacity-60"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                {t.nav.portal || "Portal"}
              </Link>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="relative text-white/70 hover:text-yellow-400 transition-colors"
                aria-label="Wishlist"
              >
                <svg
                  className="w-5 h-5"
                  fill={wishCount > 0 ? "currentColor" : "none"}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                {wishCount > 0 && (
                  <span
                    className="absolute -top-2 -right-2 w-4 h-4 rounded-full flex items-center justify-center font-body text-[9px] text-white"
                    style={{ background: "#B8903C" }}
                  >
                    {wishCount}
                  </span>
                )}
              </Link>

              {/* Language toggle */}
              <button
                onClick={toggleLang}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-white/15 text-white/60 hover:border-yellow-500 hover:text-yellow-400 transition-all duration-300 font-body text-[10px] tracking-widest uppercase"
              >
                {lang === "en" ? "🇯🇴 AR" : "🇬🇧 EN"}
              </button>

              <Link to="/quote" className="btn-gold text-xs py-3 px-5">
                {t.nav.quote}
              </Link>
            </div>

            {/* Mobile right icons */}
            <div className="flex lg:hidden items-center gap-4">
              <Link to="/wishlist" className="relative text-white/70">
                <svg
                  className="w-5 h-5"
                  fill={wishCount > 0 ? "currentColor" : "none"}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                {wishCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full text-[8px] flex items-center justify-center text-white"
                    style={{ background: "#B8903C" }}
                  >
                    {wishCount}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex flex-col justify-center items-end gap-1.5 w-10 h-10"
                aria-label="Menu"
              >
                <span
                  className={`block h-px bg-white transition-all duration-300 ${menuOpen ? "w-7 rotate-45 translate-y-2" : "w-7"}`}
                />
                <span
                  className={`block h-px bg-white transition-all duration-300 ${menuOpen ? "opacity-0 w-5" : "w-5"}`}
                />
                <span
                  className={`block h-px bg-white transition-all duration-300 ${menuOpen ? "w-7 -rotate-45 -translate-y-2" : "w-6"}`}
                />
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed inset-0 z-40 flex flex-col"
            style={{ background: "rgba(13,11,9,0.99)" }}
            dir={isAr ? "rtl" : "ltr"}
          >
            <div className="flex flex-col justify-center items-center h-full gap-8 px-8">
              <div className="mb-4 text-center">
                <span className="font-accent text-3xl tracking-[0.15em] text-white">
                  EMDAD
                </span>
                <div className="gold-divider mt-2" />
              </div>
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path + link.label}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.4 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setMenuOpen(false)}
                    className="block font-display text-3xl font-300 text-white hover:text-yellow-400 transition-colors duration-300 text-center"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => {
                    toggleLang();
                    setMenuOpen(false);
                  }}
                  className="px-4 py-2 border border-white/20 text-white/60 font-body text-xs tracking-widest uppercase hover:border-yellow-500 transition-all"
                >
                  {lang === "en" ? "🇯🇴 عربي" : "🇬🇧 English"}
                </button>
                <Link
                  to="/quote"
                  onClick={() => setMenuOpen(false)}
                  className="btn-gold text-xs py-3 px-6"
                >
                  {t.nav.quote}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
