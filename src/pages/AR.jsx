import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ScrollReveal from '../components/ScrollReveal'
import { useLang } from '../context/LanguageContext'

export default function ARPage() {
  const { t, isAr } = useLang()
  const ar = t.arPage

  return (
    <div className="bg-ivory" dir={isAr?'rtl':'ltr'}>
      {/* HERO */}
      <div className="relative overflow-hidden pt-24" style={{ minHeight:'85vh', background:'#0D0B09' }}>
        <img src="/images/living-rooms/LIVING3.jpg" alt="AR Experience" className="absolute inset-0 w-full h-full object-cover" style={{ filter:'brightness(0.2) saturate(0.5)' }} />
        <div className="absolute inset-0" style={{ background:'radial-gradient(ellipse at center, rgba(184,144,60,0.08) 0%, rgba(13,11,9,0.95) 70%)' }} />

        <motion.div animate={{ y:[0,-18,0], rotate:[0,2,0] }} transition={{ duration:6, repeat:Infinity, ease:'easeInOut' }}
          className="absolute right-8 md:right-24 top-1/2 -translate-y-1/2 hidden md:block" style={{ zIndex:5 }}>
          <div className="relative w-52 h-96 rounded-3xl shadow-2xl overflow-hidden" style={{ border:'1px solid rgba(184,144,60,0.4)', background:'rgba(255,255,255,0.05)', backdropFilter:'blur(10px)' }}>
            <img src="/images/master-bedrooms/BED5.jpg" alt="AR Preview" className="w-full h-full object-cover opacity-70" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ border:'2px solid rgba(184,144,60,0.8)', background:'rgba(184,144,60,0.15)', backdropFilter:'blur(4px)' }}>
                <span className="text-3xl">📱</span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 flex items-center" style={{ minHeight:'85vh' }}>
          <div className="max-w-xl">
            <motion.div initial={{ opacity:0, y:40 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.9 }}>
              <div className="inline-flex items-center gap-3 px-4 py-2 mb-8" style={{ border:'1px solid rgba(184,144,60,0.4)', background:'rgba(184,144,60,0.1)' }}>
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background:'#B8903C' }} />
                <span className="font-body text-xs tracking-[0.3em] uppercase" style={{ color:'#D4AC5A' }}>{ar.badge}</span>
              </div>
              <h1 className="font-display font-300 text-white leading-none mb-6" style={{ fontSize:'clamp(2.5rem,7vw,5rem)' }}>
                {ar.title1}<br /><em className="not-italic" style={{ color:'#D4AC5A' }}>{ar.title2}</em><br />{ar.title3}
              </h1>
              <p className="font-body text-sm leading-loose text-white/55 mb-10">{ar.desc}</p>
              <div className="flex flex-col sm:flex-row gap-4">
                {[{ l1:ar.iosLabel1, l2:ar.iosLabel2, icon:'M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z' },
                     { l1:ar.androidLabel1, l2:ar.androidLabel2, icon:'M3.18 23.76c.3.17.64.24.99.2l12.21-12.21-2.93-2.93-10.27 14.94zm15.96-9.41l-2.85-1.63-3.19 3.19 3.19 3.19 2.86-1.63c.81-.46.81-1.65-.01-2.12zM2.37.24C2.06.39 1.86.71 1.86 1.1v21.8c0 .39.2.71.52.86l.1.06 12.21-12.22v-.28L2.47.18l-.1.06z' }
                ].map((btn,i) => (
                  <a key={i} href="#download" className="flex items-center gap-4 px-6 py-4 transition-all duration-300 hover:-translate-y-1" style={{ background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)', backdropFilter:'blur(8px)' }}>
                    <svg className="w-8 h-8 text-white flex-shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d={btn.icon} /></svg>
                    <div className="text-left"><p className="font-body text-[9px] text-white/50 uppercase tracking-widest leading-none">{btn.l1}</p><p className="font-body text-sm font-600 text-white">{btn.l2}</p></div>
                  </a>
                ))}
              </div>
              <p className="font-body text-[10px] text-white/25 mt-4">{ar.note}</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section className="py-20 md:py-32" style={{ background:'#FAF7F2' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <ScrollReveal variant="fadeUp" className="text-center mb-16">
            <span className="section-eyebrow">{ar.stepsEyebrow}</span>
            <div className="gold-divider" />
            <h2 className="section-title mt-4">{ar.stepsTitle}<br /><em className="not-italic font-400" style={{ color:'#8B6350' }}>{ar.stepsTitleEm}</em></h2>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {t.arSteps.map((step,i) => (
              <ScrollReveal key={step.num} delay={i*0.15} variant="fadeUp">
                <div className="relative text-center px-4">
                  <div className="relative w-16 h-16 mx-auto mb-6 flex items-center justify-center" style={{ background:'linear-gradient(135deg,#B8903C,#D4AC5A)' }}>
                    <span className="text-2xl">{step.icon}</span>
                    <span className="absolute -top-3 -right-3 w-7 h-7 flex items-center justify-center font-body text-xs font-700 text-yellow-800" style={{ background:'#F0D483' }}>{i+1}</span>
                  </div>
                  <h3 className="font-display text-xl font-400 text-onyx mb-3">{step.title}</h3>
                  <p className="font-body text-xs leading-loose text-charcoal/55">{step.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 md:py-28" style={{ background:'#F0E8DA' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <ScrollReveal variant="fadeUp" className="text-center mb-14">
            <span className="section-eyebrow">{ar.featEyebrow}</span>
            <div className="gold-divider" />
            <h2 className="section-title mt-4">{ar.featTitle}<br /><em className="not-italic font-400" style={{ color:'#8B6350' }}>{ar.featTitleEm}</em></h2>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background:'rgba(184,144,60,0.1)' }}>
            {t.arFeatures.map((f,i) => (
              <ScrollReveal key={f.title} delay={i*0.08} variant="fadeUp">
                <div className="p-8 hover:bg-yellow-500/5 transition-colors duration-400" style={{ background:'#F0E8DA' }}>
                  <div className="w-10 h-px mb-6" style={{ background:'#B8903C' }} />
                  <h4 className="font-display text-xl font-400 text-onyx mb-4">{f.title}</h4>
                  <p className="font-body text-xs leading-loose text-charcoal/60">{f.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* DOWNLOAD */}
      <section id="download" className="py-24 md:py-36" style={{ background:'#0D0B09' }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <ScrollReveal variant="fadeUp">
            <span className="section-eyebrow text-yellow-500">{ar.dlEyebrow}</span>
            <div className="gold-divider" />
            <h2 className="section-title-light mt-4 mb-6">{ar.dlTitle}<br /><em className="not-italic" style={{ color:'#D4AC5A' }}>{ar.dlTitleEm}</em></h2>
            <p className="font-body text-sm leading-loose text-white/45 max-w-xl mx-auto mb-12">{ar.dlDesc}</p>
            <div className="flex flex-col sm:flex-row justify-center gap-5 mb-12">
              {[{ l1:ar.iosLabel1, l2:ar.iosLabel2, icon:'M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z' },
                 { l1:ar.androidLabel1, l2:ar.androidLabel2, icon:'M3.18 23.76c.3.17.64.24.99.2l12.21-12.21-2.93-2.93-10.27 14.94zm15.96-9.41l-2.85-1.63-3.19 3.19 3.19 3.19 2.86-1.63c.81-.46.81-1.65-.01-2.12zM2.37.24C2.06.39 1.86.71 1.86 1.1v21.8c0 .39.2.71.52.86l.1.06 12.21-12.22v-.28L2.47.18l-.1.06z' }
              ].map((btn,i) => (
                <a key={i} href="#" className="flex items-center gap-5 px-8 py-5 transition-all duration-400 hover:-translate-y-2" style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', minWidth:'220px' }}>
                  <svg className="w-10 h-10 text-white flex-shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d={btn.icon} /></svg>
                  <div className="text-left"><p className="font-body text-[9px] text-white/40 uppercase tracking-widest">{btn.l1}</p><p className="font-heading text-base font-600 text-white">{btn.l2}</p></div>
                </a>
              ))}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-8" style={{ borderTop:'1px solid rgba(255,255,255,0.05)' }}>
              {ar.badges.map((b,i) => (<React.Fragment key={b}>{i>0&&<span className="w-px h-3 bg-white/10"/>}<span className="font-body text-[10px] tracking-widest uppercase text-white/30">{b}</span></React.Fragment>))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <div className="py-8" style={{ background:'#1C1917', borderTop:'1px solid rgba(184,144,60,0.1)' }}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-body text-sm text-white/40">{ar.questionBar}</p>
          <Link to="/contact" className="btn-gold text-xs py-3 px-6">{ar.questionCta}</Link>
        </div>
      </div>
    </div>
  )
}
