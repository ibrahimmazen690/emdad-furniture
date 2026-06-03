import { useRef, useCallback } from 'react'

export function useTilt(maxAngle = 14) {
  const ref = useRef(null)

  const onMouseMove = useCallback((e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    const rotateY = (x - 0.5) * maxAngle
    const rotateX = (0.5 - y) * maxAngle
    const shadowX = -rotateY * 1.2
    const shadowY = rotateX * 1.2
    el.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.025, 1.025, 1.025)`
    el.style.boxShadow = `${shadowX}px ${shadowY}px 40px rgba(0,0,0,0.25), 0 8px 24px rgba(0,0,0,0.15)`
  }, [maxAngle])

  const onMouseLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)'
    el.style.boxShadow = '0 8px 24px rgba(0,0,0,0.10)'
  }, [])

  return { ref, onMouseMove, onMouseLeave }
}
