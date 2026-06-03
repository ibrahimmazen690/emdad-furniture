import React, { useRef, useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function BeforeAfterSlider({ before, after, beforeLabel='Before', afterLabel='After' }) {
  const [pos, setPos] = useState(50)
  const containerRef = useRef(null)
  const isDragging = useRef(false)

  const updatePos = useCallback((clientX) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = Math.max(5, Math.min(95, ((clientX - rect.left) / rect.width) * 100))
    setPos(x)
  }, [])

  const onMouseDown = useCallback(() => { isDragging.current = true }, [])
  const onMouseUp   = useCallback(() => { isDragging.current = false }, [])
  const onMouseMove = useCallback((e) => { if (isDragging.current) updatePos(e.clientX) }, [updatePos])
  const onTouchMove = useCallback((e) => { updatePos(e.touches[0].clientX) }, [updatePos])

  useEffect(() => {
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('mousemove', onMouseMove)
    return () => { window.removeEventListener('mouseup', onMouseUp); window.removeEventListener('mousemove', onMouseMove) }
  }, [onMouseUp, onMouseMove])

  return (
    <motion.div
      initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }}
      viewport={{ once:true }} transition={{ duration:0.7 }}
      className="relative overflow-hidden select-none" style={{ aspectRatio:'16/9', cursor:'col-resize', borderRadius:2 }}
      ref={containerRef}
      onMouseDown={onMouseDown}
      onTouchMove={onTouchMove}
    >
      {/* After (full width bottom) */}
      <img src={after} alt={afterLabel} className="absolute inset-0 w-full h-full object-cover" draggable={false} />

      {/* Before (clipped left) */}
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
        <img src={before} alt={beforeLabel} className="absolute inset-0 w-full h-full object-cover" style={{ width:'100vw', maxWidth:'none' }} draggable={false} />
      </div>

      {/* Divider line */}
      <div className="absolute top-0 bottom-0 w-px" style={{ left:`${pos}%`, background:'#F0D483', zIndex:10 }}>
        {/* Handle */}
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background:'#B8903C', border:'2px solid #F0D483', boxShadow:'0 0 20px rgba(184,144,60,0.5)', zIndex:11 }}>
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l-3 3 3 3M16 9l3 3-3 3" />
          </svg>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute bottom-4 left-4 px-3 py-1 font-body text-[10px] tracking-widest uppercase" style={{ background:'rgba(13,11,9,0.75)', color:'rgba(255,255,255,0.7)', zIndex:10 }}>{beforeLabel}</div>
      <div className="absolute bottom-4 right-4 px-3 py-1 font-body text-[10px] tracking-widest uppercase" style={{ background:'rgba(184,144,60,0.85)', color:'white', zIndex:10 }}>{afterLabel}</div>
    </motion.div>
  )
}
