import React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useWishlist } from "../hooks/useWishlist";
import { useLang } from "../context/LanguageContext";

export default function Wishlist() {
  const { items, toggle, clear } = useWishlist();
  const { t, isAr } = useLang();

  const handleInquiry = () => {
    const names = items
      .map((i) => i.title || i.alt || "EMDAD Piece")
      .join("\n- ");
    window.open(
      `https://wa.me/962779989944?text=${encodeURIComponent(`Hello EMDAD, I'm interested in the following pieces from my wishlist:\n${names}\n\nCould you provide more details?`)}`,
      "_blank",
    );
  };

  return (
    <div
      className="min-h-screen pt-24"
      style={{ background: "#FAF7F2" }}
      dir={isAr ? "rtl" : "ltr"}
    >
      <div className="py-16 text-center" style={{ background: "#0D0B09" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="section-eyebrow text-yellow-500">
            {isAr ? "قائمتك الشخصية" : t.wishlist.personalList}
          </span>
          <div className="gold-divider" />
          <h1 className="font-display text-5xl font-300 text-white mt-4">
            {t.wishlist.title}
          </h1>
          <p className="font-body text-sm text-white/40 mt-3">
            {items.length} {isAr ? "قطعة محفوظة" : t.wishlist.piecesLabel}
          </p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        {items.length === 0 ? (
          <div className="text-center py-32">
            <div className="text-6xl mb-6">♡</div>
            <h3 className="font-display text-3xl font-300 text-onyx mb-4">
              {t.wishlist.empty}
            </h3>
            <p className="font-body text-sm text-charcoal/50 max-w-sm mx-auto mb-10">
              {t.wishlist.emptyDesc}
            </p>
            <Link to="/collections" className="btn-gold">
              {t.wishlist.browse}
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-10">
              <p className="font-body text-sm text-charcoal/50">
                {items.length}{" "}
                {isAr ? "قطع محفوظة" : t.wishlist.piecesLabel}
              </p>
              <div className="flex gap-4">
                <button
                  onClick={clear}
                  className="font-body text-xs text-charcoal/40 hover:text-red-500 transition-colors tracking-wide uppercase"
                >
                  {isAr ? "مسح الكل" : t.wishlist.clearAll}
                </button>
                <button
                  onClick={handleInquiry}
                  className="btn-gold text-xs py-3 px-6"
                >
                  {isAr ? "إرسال استفسار واتساب" : t.wishlist.send}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              <AnimatePresence>
                {items.map((img, i) => (
                  <motion.div
                    key={img.src}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                    className="group relative overflow-hidden"
                    style={{ aspectRatio: "3/4" }}
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      style={{ filter: "brightness(0.85)" }}
                    />
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: "rgba(13,11,9,0.5)" }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <p className="font-body text-[9px] tracking-wide uppercase text-yellow-400">
                        {isAr ? "محفوظ" : "Saved"}
                      </p>
                      <p className="font-display text-xs text-white">
                        {img.title || img.alt}
                      </p>
                    </div>
                    <button
                      onClick={() => toggle(img)}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
                      style={{ background: "rgba(13,11,9,0.7)" }}
                    >
                      <span className="text-base" style={{ color: "#F0D483" }}>
                        ♥
                      </span>
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div
              className="mt-16 p-8 text-center"
              style={{
                background: "#0D0B09",
                border: "1px solid rgba(184,144,60,0.15)",
              }}
            >
              <p className="font-display text-xl font-300 text-white mb-3">
                {isAr ? "أعجبتك هذه القطع؟" : t.wishlist.lovePieces}
              </p>
              <p className="font-body text-sm text-white/40 mb-6">
                {isAr
                  ? "أرسل لنا قائمتك وسنتواصل معك بعروض مخصصة."
                  : t.wishlist.loveDesc}
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <button onClick={handleInquiry} className="btn-gold">
                  {t.wishlist.send}
                </button>
                <Link to="/quote" className="btn-outline">
                  {isAr ? "احصل على تقدير سعر" : t.wishlist.getPriceEst}
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
