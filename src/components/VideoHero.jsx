import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "../context/LanguageContext";
import { heroImages } from "../data/categories";

export default function VideoHero() {
  const { t, isAr } = useLang();
  const videoRef = useRef(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const [current, setCurrent] = useState(0);
  const [muted, setMuted] = useState(true);

  const slides = videoFailed
    ? heroImages.map((slide) => ({ type: "image", ...slide }))
    : [
        {
          type: "video",
          src: "/videos/hero.mp4",
          category: "Premium Furniture — Zarqa, Jordan",
        },
        ...heroImages.map((slide) => ({ type: "image", ...slide })),
      ];

  React.useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(
      () => setCurrent((c) => (c + 1) % slides.length),
      5500,
    );
    return () => clearInterval(timer);
  }, [slides.length]);

  const activeSlide = slides[current];
  const isVideoSlide = activeSlide.type === "video";

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: "100dvh", minHeight: 600, maxHeight: 1000 }}
    >
      {/* ── Video layer or image slide ────────────────────── */}
      {activeSlide.type === "video" ? (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted={muted}
          loop
          playsInline
          onError={() => {
            setVideoFailed(true);
            setCurrent((c) => (c === 0 ? 1 : c));
          }}
          onStalled={() =>
            setTimeout(() => {
              setVideoFailed(true);
              setCurrent((c) => (c === 0 ? 1 : c));
            }, 3000)
          }
          style={{ filter: "brightness(0.45) saturate(1.1)" }}
        >
          <source src={activeSlide.src} type="video/mp4" />
        </video>
      ) : (
        <div
          className="absolute inset-0"
          style={{ opacity: 1, transition: "opacity 1.5s ease", zIndex: 0 }}
        >
          <img
            src={activeSlide.src}
            alt={activeSlide.category}
            loading={current === 0 ? "eager" : "lazy"}
            className="w-full h-full object-cover"
            style={{ filter: "brightness(0.45) saturate(1.1)" }}
          />
        </div>
      )}

      {/* ── Gradient overlays ────────────────────────────── */}
      <div
        className="absolute inset-0 z-[2]"
        style={{
          background:
            "linear-gradient(to right, rgba(13,11,9,0.85) 0%, rgba(13,11,9,0.3) 60%, transparent 100%)",
        }}
      />
      <div
        className="absolute inset-0 z-[2]"
        style={{
          background:
            "linear-gradient(to top, rgba(13,11,9,0.7) 0%, transparent 60%)",
        }}
      />

      {/* ── Mute toggle (only if video exists) ───────────── */}
      {isVideoSlide && (
        <button
          onClick={() => {
            const nextMuted = !muted;
            setMuted(nextMuted);
            if (videoRef.current) videoRef.current.muted = nextMuted;
          }}
          className="absolute bottom-10 right-8 z-20 w-10 h-10 flex items-center justify-center border border-white/20 text-white/60 hover:border-yellow-500 hover:text-yellow-400 transition-all duration-300"
          aria-label={muted ? "Unmute" : "Mute"}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {muted ? (
              <>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                />
              </>
            ) : (
              <>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15.536 8.464a5 5 0 010 7.072M12 6v12m-3.536-9.536a5 5 0 000 7.072"
                />
              </>
            )}
          </svg>
        </button>
      )}

      {/* ── Content ──────────────────────────────────────── */}
      <div className="absolute inset-0 z-10 flex items-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-16 w-full">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="max-w-3xl"
            dir={isAr ? "rtl" : "ltr"}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="flex items-center gap-4 mb-6"
            >
              <span className="w-12 h-px" style={{ background: "#B8903C" }} />
              <span className="font-body text-xs tracking-[0.4em] uppercase text-yellow-400">
                {isVideoSlide
                  ? "Premium Furniture — Zarqa, Jordan"
                  : activeSlide.category}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="font-display font-300 text-white leading-[1.05] mb-4"
              style={{ fontSize: "clamp(3rem, 8vw, 6rem)" }}
            >
              {t.hero.headline1}
              <br />
              <em
                className="not-italic font-400"
                style={{
                  background:
                    "linear-gradient(135deg,#B8903C 0%,#F0D483 50%,#D4AC5A 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {t.hero.headline2}
              </em>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="font-display text-xl md:text-2xl font-300 italic text-white/70 mb-10"
            >
              {t.hero.sub}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/collections" className="btn-gold">
                {t.hero.cta1} →
              </Link>
              <Link to="/contact" className="btn-outline">
                {t.hero.cta2}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ── Slide indicators ────────────────────────────── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="block transition-all duration-500"
            style={{
              width: i === current ? 32 : 8,
              height: 2,
              background: i === current ? "#D4AC5A" : "rgba(255,255,255,0.3)",
            }}
          />
        ))}
      </div>
    </section>
  );
}
