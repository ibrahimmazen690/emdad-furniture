import React, { useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'
import { motion } from 'framer-motion'

export default function CategoryCard({ category, index }) {
  const { t, isAr } = useLang()
  const cardRef = useRef(null)
  const innerRef = useRef(null)

  const handleMouseMove = useCallback((e) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    const rotX = y * -12
    const rotY = x * 12
    card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.03, 1.03, 1.03)`
    const inner = innerRef.current
    if (inner) {
      inner.style.transform = `translateZ(20px)`
    }
  }, [])

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current
    if (card) card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)'
    const inner = innerRef.current
    if (inner) inner.style.transform = 'translateZ(0px)'
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="group relative overflow-hidden cursor-pointer will-change-transform"
        style={{
          transition: 'transform 0.2s ease, box-shadow 0.4s ease',
          transformStyle: 'preserve-3d',
          borderRadius: '2px',
        }}
      >
        {/* Image Container */}
        <div className="relative overflow-hidden" style={{ aspectRatio: '3/4', background: '#1C1917' }}>
          <img
            src={category.coverImage}
            alt={category.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            style={{ filter: 'brightness(0.75) saturate(1.05)' }}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(to top, rgba(13,11,9,0.95) 0%, rgba(13,11,9,0.4) 50%, rgba(13,11,9,0.1) 100%)',
            transition: 'opacity 0.5s ease',
          }} />

          {/* Gold accent corner */}
          <div className="absolute top-4 right-4 w-8 h-8 border-t border-r border-yellow-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b border-l border-yellow-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Count badge */}
          <div
            className="absolute top-4 left-4 px-3 py-1 text-xs font-body tracking-widest uppercase"
            style={{
              background: 'rgba(13,11,9,0.7)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(184,144,60,0.3)',
              color: '#D4AC5A',
            }}
          >
            {category.count} pieces
          </div>
        </div>

        {/* Text Content */}
        <div
          ref={innerRef}
          className="absolute bottom-0 left-0 right-0 p-6 transition-transform duration-300"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Subtitle */}
          <p className="font-body text-[10px] tracking-[0.3em] uppercase text-yellow-400/80 mb-2">
            {category.subtitle}
          </p>

          {/* Title */}
          <h3 className="font-display text-2xl font-400 text-white mb-4 leading-tight">
            {isAr && t.catNames[category.id] ? t.catNames[category.id] : category.title}
          </h3>

          {/* CTA */}
          <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
            <Link
              to={`/collections?cat=${category.id}`}
              className="flex items-center gap-2 font-body text-xs tracking-[0.2em] uppercase text-white hover:text-yellow-400 transition-colors duration-300"
            >
              View Collection
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
