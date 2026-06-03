import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { heroImages } from '../data/categories'

export default function HeroSlideshow() {
  const [current, setCurrent] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const timerRef = useRef(null)

  const goTo = useCallback((idx) => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrent(idx)
    setTimeout(() => setIsAnimating(false), 1500)
  }, [isAnimating])

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % heroImages.length)
    }, 6000)
    return () => clearInterval(timerRef.current)
  }, [])

  const handleMouseMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePos({
      x: (e.clientX - rect.left) / rect.width - 0.5,
      y: (e.clientY - rect.top) / rect.height - 0.5,
    })
  }, [])

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: '100dvh', minHeight: '600px', maxHeight: '1000px' }}
      onMouseMove={handleMouseMove}
    >
      {/* Slides */}
      {heroImages.map((slide, i) => (
        <div
          key={slide.src}
          className="absolute inset-0"
          style={{
            opacity: i === current ? 1 : 0,
            transition: 'opacity 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            zIndex: i === current ? 1 : 0,
          }}
        >
          {/* Parallax Image */}
          <div
            className="absolute inset-0 will-change-transform"
            style={{
              transform: i === current
                ? `scale(1.08) translate(${mousePos.x * -15}px, ${mousePos.y * -15}px)`
                : 'scale(1.15)',
              transition: 'transform 0.8s ease-out',
            }}
          >
            <img
              src={slide.src}
              alt={slide.category}
              loading={i === 0 ? 'eager' : 'lazy'}
              className="w-full h-full object-cover"
              style={{ filter: 'brightness(0.55) saturate(1.1)' }}
            />
          </div>

          {/* Gradient Overlays */}
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(to right, rgba(13,11,9,0.75) 0%, rgba(13,11,9,0.3) 60%, transparent 100%)'
          }} />
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(to top, rgba(13,11,9,0.6) 0%, transparent 60%)'
          }} />
        </div>
      ))}

      {/* Decorative vertical text */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-20 hidden xl:block">
        <span className="writing-vertical font-body text-[10px] tracking-[0.4em] uppercase text-white/30">
          Premium Furniture — Amman Jordan
        </span>
      </div>

      {/* Slide number */}
      <div className="absolute right-8 bottom-12 z-20 hidden md:flex flex-col items-center gap-2">
        <span className="font-body text-xs text-white/40 tracking-widest">
          0{current + 1} / 0{heroImages.length}
        </span>
        <div className="w-px bg-white/20" style={{ height: 60 }}>
          <div
            className="w-full bg-yellow-400 transition-all duration-300"
            style={{ height: `${((current + 1) / heroImages.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Hero Content */}
      <div className="absolute inset-0 z-10 flex items-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-16 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="max-w-3xl"
            >
              {/* Eyebrow */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="flex items-center gap-4 mb-6"
              >
                <span className="w-12 h-px" style={{ background: '#B8903C' }} />
                <span className="font-body text-xs tracking-[0.4em] uppercase text-yellow-400">
                  {heroImages[current].category}
                </span>
              </motion.div>

              {/* Main Title */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.7 }}
                className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-300 text-white leading-[1.05] mb-4"
              >
                EMDAD<br />
                <em className="not-italic" style={{
                  background: 'linear-gradient(135deg, #B8903C 0%, #F0D483 50%, #D4AC5A 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  Wooden & Smart
                </em>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.6 }}
                className="font-display text-xl md:text-2xl font-300 italic text-white/70 mb-10"
              >
                {heroImages[current].caption}
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="flex flex-wrap gap-4"
              >
                <Link to="/collections" className="btn-gold">
                  Explore Collections
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link to="/contact" className="btn-outline">
                  Contact Us
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {heroImages.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="group relative flex items-center justify-center"
            aria-label={`Go to slide ${i + 1}`}
          >
            <span
              className="block transition-all duration-500"
              style={{
                width: i === current ? '32px' : '8px',
                height: '2px',
                background: i === current ? '#D4AC5A' : 'rgba(255,255,255,0.3)',
              }}
            />
          </button>
        ))}
      </div>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-10 left-10 z-20 hidden md:flex flex-col items-center gap-2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="w-px h-10 overflow-hidden">
          <div className="w-full bg-yellow-400" style={{ height: '40%', animation: 'scroll-line 2s ease-in-out infinite' }} />
        </div>
        <span className="font-body text-[9px] tracking-[0.3em] uppercase text-white/30 writing-vertical rotate-180">Scroll</span>
      </motion.div>
    </section>
  )
}
