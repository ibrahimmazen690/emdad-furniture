import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '../context/LanguageContext'

const PHASES = [
  { id:'consultation', label:'Consultation & Design',    labelAr:'الاستشارة والتصميم',    icon:'🎨' },
  { id:'approval',     label:'Client Approval',           labelAr:'موافقة العميل',          icon:'✅' },
  { id:'production',   label:'Manufacturing & Fabrication',labelAr:'التصنيع والتشغيل',    icon:'🔨' },
  { id:'finishing',    label:'Finishing & QC',            labelAr:'التشطيب وضبط الجودة',   icon:'🔍' },
  { id:'logistics',    label:'Logistics & Delivery',      labelAr:'الخدمات اللوجستية',     icon:'🚚' },
  { id:'installation', label:'Installation & Handover',   labelAr:'التركيب والتسليم',      icon:'🏠' },
]

function calcWeeks(size, type) {
  const baseMap = { small:[1,1,2,1,1,1], medium:[2,1,3,1,1,2], large:[3,2,6,2,2,3] }
  const typeBonus = { residential:0, commercial:1, exhibition:-1, government:2 }
  return baseMap[size].map(w => Math.max(1, w + (typeBonus[type]||0)))
}

export default function Timeline() {
  const { t, isAr } = useLang()
  const [size, setSize] = useState('medium')
  const [type, setType] = useState('residential')
  const [shown, setShown] = useState(false)

  const weeks = calcWeeks(size, type)
  const total = weeks.reduce((a,b) => a+b, 0)

  const sizes = [
    { id:'small',  label: isAr?'صغير':'Small',  desc: isAr?'1-2 غرفة':'1-2 rooms' },
    { id:'medium', label: isAr?'متوسط':'Medium', desc: isAr?'3-5 غرف':'3-5 rooms' },
    { id:'large',  label: isAr?'كبير':'Large',   desc: isAr?'6+ غرف / كامل':'6+ rooms / full fit-out' },
  ]
  const types = [
    { id:'residential', label: isAr?'سكني':'Residential' },
    { id:'commercial',  label: isAr?'تجاري':'Commercial' },
    { id:'exhibition',  label: isAr?'معرض':'Exhibition' },
    { id:'government',  label: isAr?'حكومي':'Government' },
  ]

  return (
    <div className="min-h-screen pt-24" style={{ background:'#FAF7F2' }} dir={isAr?'rtl':'ltr'}>
      <div className="py-16 text-center" style={{ background:'#0D0B09' }}>
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}>
          <span className="section-eyebrow text-yellow-500">{isAr?'تخطيط المشروع':t.timeline.planningLabel}</span>
          <div className="gold-divider" />
          <h1 className="font-display text-4xl md:text-6xl font-300 text-white mt-4">{t.timeline.title}</h1>
          <p className="font-body text-sm text-white/40 mt-4 max-w-md mx-auto">{t.timeline.sub}</p>
        </motion.div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Controls */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <p className="font-body text-[10px] tracking-[0.3em] uppercase text-charcoal/40 mb-4">{isAr?'حجم المشروع':t.timeline.sizeLabel}</p>
            <div className="flex gap-3">
              {sizes.map(s => (
                <button key={s.id} onClick={() => { setSize(s.id); setShown(false) }}
                  className="flex-1 py-3 px-2 text-center transition-all duration-300"
                  style={{ border:`1px solid ${size===s.id?'#B8903C':'rgba(184,144,60,0.2)'}`, background:size===s.id?'rgba(184,144,60,0.07)':'white' }}>
                  <p className="font-body text-xs font-600" style={{ color:size===s.id?'#8B6350':'rgba(28,25,23,0.5)' }}>{s.label}</p>
                  <p className="font-body text-[9px] text-charcoal/35 mt-0.5">{s.desc}</p>
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="font-body text-[10px] tracking-[0.3em] uppercase text-charcoal/40 mb-4">{isAr?'نوع المشروع':t.timeline.typeLabel}</p>
            <div className="grid grid-cols-2 gap-2">
              {types.map(tp => (
                <button key={tp.id} onClick={() => { setType(tp.id); setShown(false) }}
                  className="py-2.5 px-4 text-center transition-all duration-300 font-body text-xs"
                  style={{ border:`1px solid ${type===tp.id?'#B8903C':'rgba(184,144,60,0.2)'}`, background:type===tp.id?'rgba(184,144,60,0.07)':'white', color:type===tp.id?'#8B6350':'rgba(28,25,23,0.5)' }}>
                  {tp.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button onClick={() => setShown(true)} className="btn-gold w-full justify-center mb-12">{t.timeline.calculate} →</button>

        <AnimatePresence>
          {shown && (
            <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }} transition={{ duration:0.6 }}>
              {/* Total badge */}
              <div className="text-center mb-10 p-8" style={{ background:'#0D0B09', border:'1px solid rgba(184,144,60,0.2)' }}>
                <p className="font-body text-[10px] tracking-widest uppercase text-yellow-500 mb-2">{isAr?'الوقت الإجمالي المقدر':t.timeline.totalLabel}</p>
                <p className="font-display text-6xl font-300 text-white">{total} <span className="text-3xl font-300" style={{ color:'#D4AC5A' }}>{isAr?'أسابيع':'weeks'}</span></p>
                <p className="font-body text-sm text-white/30 mt-2">≈ {Math.round(total/4.3)} {isAr?'أشهر':'months'}</p>
              </div>

              {/* Phase bars */}
              <div className="space-y-4">
                {PHASES.map((phase, i) => {
                  const pct = Math.round((weeks[i] / total) * 100)
                  return (
                    <motion.div key={phase.id} initial={{ opacity:0, x:isAr?20:-20 }} animate={{ opacity:1, x:0 }} transition={{ delay: i * 0.1, duration:0.5 }}>
                      <div className="flex items-center gap-4 mb-2">
                        <span className="text-lg flex-shrink-0">{phase.icon}</span>
                        <div className="flex-1 flex items-center justify-between">
                          <p className="font-body text-sm text-onyx">{isAr?phase.labelAr:phase.label}</p>
                          <p className="font-display text-lg font-300" style={{ color:'#B8903C' }}>{weeks[i]}w</p>
                        </div>
                      </div>
                      <div className="h-2 w-full overflow-hidden" style={{ background:'rgba(184,144,60,0.1)' }}>
                        <motion.div initial={{ width:0 }} animate={{ width:`${pct}%` }} transition={{ delay:i*0.1+0.3, duration:0.8, ease:'easeOut' }}
                          className="h-full" style={{ background:'linear-gradient(90deg,#B8903C,#D4AC5A)' }} />
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              <div className="mt-12 text-center">
                <p className="font-body text-xs text-charcoal/40 mb-6">{isAr?'* هذه تقديرات نموذجية. قد تختلف الجداول الزمنية الفعلية بناءً على التعقيد والتوافر.':'* These are typical estimates. Actual timelines may vary based on complexity and availability.'}</p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Link to="/contact" className="btn-gold">{isAr?'ابدأ مشروعك':'Start Your Project'} →</Link>
                  <Link to="/quote" className="btn-dark">{isAr?'احصل على عرض سعر':'Get a Quote'}</Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
