import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function LoadingScreen({ onDone }) {
  const [phase, setPhase] = useState(0) // 0=logo, 1=text, 2=exit

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 600)
    const t2 = setTimeout(() => setPhase(2), 2200)
    const t3 = setTimeout(() => onDone(), 3000)
    return () => [t1,t2,t3].forEach(clearTimeout)
  }, [onDone])

  return (
    <AnimatePresence>
      {phase < 2 && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center"
          style={{ background: '#0D0B09' }}
        >
          {/* Animated rings */}
          <div className="relative mb-10">
            {[80, 60, 40].map((size, i) => (
              <motion.div
                key={size}
                className="absolute rounded-full border border-yellow-600/20"
                style={{ width: size * 2, height: size * 2, top: -size, left: -size }}
                animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 2.5, delay: i * 0.3, repeat: Infinity, ease: 'easeInOut' }}
              />
            ))}

            {/* Crown / Logo circle */}
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
              className="relative w-20 h-20 rounded-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #B8903C, #F0D483, #B8903C)' }}
            >
              <span className="font-accent text-3xl font-700 text-white">E</span>
            </motion.div>
          </div>

          <AnimatePresence>
            {phase >= 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center"
              >
                <motion.h1
                  className="font-accent text-4xl font-700 text-white tracking-[0.2em] mb-2"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  EMDAD
                </motion.h1>
                <p className="font-body text-[10px] tracking-[0.4em] uppercase text-yellow-500/70">
                  Wooden & Smart Furniture
                </p>

                {/* Progress bar */}
                <div className="mt-8 w-48 h-px mx-auto overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <motion.div
                    className="h-full"
                    style={{ background: 'linear-gradient(90deg, #B8903C, #F0D483)' }}
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1.8, ease: 'easeInOut' }}
                  />
                </div>
                <p className="font-body text-[9px] tracking-widest uppercase text-white/20 mt-3">
                  Zarqa · Jordan · Est. 2023
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
