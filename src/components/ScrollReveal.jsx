import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const variants = {
  fadeUp:   { hidden: { opacity: 0, y: 50 },  visible: { opacity: 1, y: 0 } },
  fadeIn:   { hidden: { opacity: 0 },           visible: { opacity: 1 } },
  fadeLeft: { hidden: { opacity: 0, x: -60 },  visible: { opacity: 1, x: 0 } },
  fadeRight:{ hidden: { opacity: 0, x: 60 },   visible: { opacity: 1, x: 0 } },
  scaleUp:  { hidden: { opacity: 0, scale: 0.88 }, visible: { opacity: 1, scale: 1 } },
}

export default function ScrollReveal({
  children,
  variant = 'fadeUp',
  delay = 0,
  duration = 0.7,
  className = '',
  once = true,
  threshold = 0.1,
}) {
  const [ref, inView] = useInView({ threshold, triggerOnce: once })
  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={variants[variant]}
      transition={{ duration, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  )
}
