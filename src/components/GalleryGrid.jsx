import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useWishlist } from '../hooks/useWishlist'

export default function GalleryGrid({ images, category }) {
  const [hoveredIdx, setHoveredIdx] = useState(null)
  const { toggle, isSaved } = useWishlist()
  const navigate = useNavigate()

  // Clicking a piece opens its full product page (identified by unique src).
  const openProduct = useCallback((img) => {
    navigate(`/product?src=${encodeURIComponent(img.src)}`)
  }, [navigate])

  const getGridClass = (i) => {
    const p = i % 9
    if (p === 0 || p === 4 || p === 7) return 'col-span-2 row-span-2'
    return 'col-span-1 row-span-1'
  }

  return (
    <div className="grid gap-3" style={{ gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))', gridAutoRows:'200px' }}>
      {images.map((img, i) => (
        <motion.div
          key={img.src} initial={{ opacity:0, scale:0.95 }} whileInView={{ opacity:1, scale:1 }}
          viewport={{ once:true, margin:'-40px' }} transition={{ duration:0.5, delay:Math.min(i*0.04,0.4) }}
          className={`relative overflow-hidden cursor-pointer group ${getGridClass(i)}`}
          onMouseEnter={() => setHoveredIdx(i)} onMouseLeave={() => setHoveredIdx(null)}
          onClick={() => openProduct(img)}
        >
          <img src={img.src} alt={img.alt} loading="lazy"
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
            style={{ filter: hoveredIdx===i ? 'brightness(0.65) saturate(1.2)' : 'brightness(0.85)' }}
          />

          {/* Overlay info */}
          <div className="absolute inset-0 pointer-events-none transition-opacity duration-500"
            style={{ background:'linear-gradient(to top, rgba(13,11,9,0.9) 0%, rgba(13,11,9,0.2) 60%, transparent 100%)', opacity: hoveredIdx===i?1:0 }} />
          <div className="absolute bottom-0 left-0 right-0 p-4 pointer-events-none transition-all duration-500"
            style={{ opacity:hoveredIdx===i?1:0, transform:hoveredIdx===i?'translateY(0)':'translateY(10px)' }}>
            <p className="font-body text-[9px] tracking-[0.3em] uppercase text-yellow-400 mb-1">{category}</p>
            <p className="font-display text-sm font-400 text-white">{img.title||img.alt}</p>
          </div>

          {/* View icon */}
          <div className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center transition-all duration-400 pointer-events-none"
            style={{ background:'rgba(184,144,60,0.9)', opacity:hoveredIdx===i?1:0, transform:hoveredIdx===i?'scale(1)':'scale(0.8)' }}>
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>

          {/* Wishlist Heart */}
          <button
            onClick={(e) => { e.stopPropagation(); toggle(img) }}
            className="absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-125"
            style={{ background: isSaved(img.src) ? 'rgba(184,144,60,0.9)' : 'rgba(13,11,9,0.5)', border:'1px solid rgba(184,144,60,0.3)', opacity: hoveredIdx===i||isSaved(img.src) ? 1 : 0 }}
            aria-label={isSaved(img.src)?'Remove from wishlist':'Add to wishlist'}
          >
            <svg className="w-4 h-4" fill={isSaved(img.src)?'white':'none'} viewBox="0 0 24 24" stroke="white" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </motion.div>
      ))}
    </div>
  )
}
