import React from 'react'
import { useCountUp } from '../hooks/useCountUp'
import { useLang } from '../context/LanguageContext'

function StatItem({ value, label, delay = 0 }) {
  const { count, ref } = useCountUp(value, 2000)
  return (
    <div ref={ref} className="flex flex-col items-center justify-center py-12 px-6 text-center" style={{ background: '#FAF7F2' }}>
      <span className="font-display text-5xl md:text-6xl font-300 mb-2" style={{ background: 'linear-gradient(135deg, #B8903C, #F0D483)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
        {count}
      </span>
      <span className="font-body text-xs tracking-[0.2em] uppercase text-charcoal/50">{label}</span>
    </div>
  )
}

export default function StatsCounter() {
  const { t } = useLang()
  const stats = [
    { value: '2023', label: t.stats.s1 },
    { value: '160+', label: t.stats.s2 },
    { value: '6+', label: t.stats.s3 },
    { value: '100%', label: t.stats.s4 },
  ]
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-px" style={{ background: 'rgba(184,144,60,0.1)' }}>
      {stats.map((s, i) => <StatItem key={s.label} {...s} delay={i * 0.1} />)}
    </div>
  )
}
