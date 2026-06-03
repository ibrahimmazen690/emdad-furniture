import { useState, useEffect, useRef } from 'react'

export function useCountUp(target, duration = 2000, startOnView = true) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!startOnView) { setStarted(true); return }
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setStarted(true); obs.disconnect() } },
      { threshold: 0.4 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [startOnView])

  useEffect(() => {
    if (!started) return
    // For year values like '2023', count from a nearby start
    const isYear = /^\d{4}$/.test(target.trim())
    const num = parseInt(target.replace(/\D/g, '')) || 0
    if (num === 0) { setCount(target); return }
    const suffix = target.replace(/[0-9]/g, '')
    const startVal = isYear ? num - 50 : 0
    let current = startVal
    const step = duration / 60
    const increment = (num - startVal) / 60
    const timer = setInterval(() => {
      current += increment
      if (current >= num) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(current) + suffix)
    }, step)
    return () => clearInterval(timer)
  }, [started, target, duration])

  return { count, ref }
}
