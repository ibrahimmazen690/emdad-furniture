import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ScrollReveal from '../components/ScrollReveal'
import { useLang } from '../context/LanguageContext'

const clients = ['Jordan Armed Forces — Arab Army','SOFEX Jordan','KASOTC','European Union Delegation','U.S. Embassy — Jordan','Royal Hashemite Court','Ministry of Political Affairs','Jordan River Foundation','Kulluna Jordan Foundation','Jordanian Geographic Center','University of Jordan','Jordanian National K9 Center (JK9)','Civil Defense Directorate','Royal Medical Services','Royal Naval Force']
const clientsAr = ['القوات المسلحة الأردنية — الجيش العربي','سوفكس جوردن','كاسوتك','وفد الاتحاد الأوروبي','السفارة الأمريكية — الأردن','الديوان الملكي الهاشمي','وزارة الشؤون السياسية','مؤسسة نهر الأردن','مؤسسة كلنا الأردن','المركز الجغرافي الأردني','الجامعة الأردنية','المركز الأردني الوطني لتدريب الكلاب (JK9)','مديرية الدفاع المدني','الخدمات الطبية الملكية','القوة البحرية الملكية']

export default function About() {
  const { t, isAr } = useLang()
  const depts = t.departments
  const depColors = ['#B8903C','#8B6350','#4A2C2A','#1C1917']

  return (
    <div className="bg-ivory" dir={isAr?'rtl':'ltr'}>

      {/* HERO */}
      <div className="relative pt-24 overflow-hidden" style={{ minHeight:'75vh', background:'#0D0B09' }}>
        <img src="/images/master-bedrooms/BED19.jpg" alt="About EMDAD" className="absolute inset-0 w-full h-full object-cover" style={{ filter:'brightness(0.22) saturate(0.6)' }} />
        <div className="absolute inset-0" style={{ background:'linear-gradient(to bottom, rgba(13,11,9,0.5) 0%, rgba(13,11,9,0.97) 100%)' }} />
        <div className="relative z-10 flex flex-col justify-center items-center text-center h-full min-h-[75vh] px-6 pb-20">
          <motion.div initial={{ opacity:0, y:40 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.9 }}>
            <span className="section-eyebrow text-yellow-500">{t.aboutHero.eyebrow}</span>
            <div className="gold-divider" />
            <h1 className="font-display text-5xl sm:text-6xl md:text-8xl font-300 text-white mt-4 leading-none">
              {t.aboutHero.title1}<br />
              <em className="not-italic" style={{ color:'#D4AC5A' }}>{t.aboutHero.title2}</em>
            </h1>
            <p className="font-display text-xl md:text-2xl font-300 italic text-white/50 mt-6 max-w-2xl mx-auto">{t.aboutHero.sub}</p>
            <p className="font-body text-sm text-white/30 tracking-[0.2em] uppercase mt-4">{t.aboutHero.location}</p>
          </motion.div>
        </div>
      </div>

      {/* WHO WE ARE */}
      <section className="py-24 md:py-32" style={{ background:'#FAF7F2' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal variant={isAr?'fadeRight':'fadeLeft'}>
              <span className="section-eyebrow">{t.aboutWho.eyebrow}</span>
              <div className="gold-divider-left" />
              <h2 className="font-display text-4xl md:text-5xl font-300 text-onyx mt-4 mb-8 leading-tight">
                {t.aboutWho.title}<br />
                <em className="not-italic font-500" style={{ color:'#8B6350' }}>{t.aboutWho.titleEm}</em>
              </h2>
              <div className="space-y-5 font-body text-sm leading-loose text-charcoal/65">
                <p>{t.aboutWho.p1}</p>
                <p>{t.aboutWho.p2}</p>
                <p>{t.aboutWho.p3}</p>
              </div>
            </ScrollReveal>
            <ScrollReveal variant={isAr?'fadeLeft':'fadeRight'}>
              <div className="space-y-4">
                <p className="font-body text-[10px] tracking-[0.3em] uppercase mb-6" style={{ color:'#B8903C' }}>{t.aboutWho.pillarsLabel}</p>
                {t.pillars.map((p,i) => (
                  <motion.div key={p.num} initial={{ opacity:0, x:isAr?-30:30 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ delay:i*0.15, duration:0.5 }}
                    className="flex gap-5 p-5 hover:bg-yellow-50 transition-colors duration-300" style={{ border:'1px solid rgba(184,144,60,0.12)' }}>
                    <span className="font-display text-3xl font-300 flex-shrink-0 mt-1" style={{ color:'rgba(184,144,60,0.35)' }}>{p.num}</span>
                    <div><h4 className="font-body text-sm font-600 text-onyx mb-1">{p.title}</h4><p className="font-body text-xs leading-relaxed text-charcoal/55">{p.desc}</p></div>
                  </motion.div>
                ))}
              </div>
            </ScrollReveal>
          </div>
          <ScrollReveal variant="fadeUp" delay={0.2} className="mt-20 pt-16" style={{ borderTop:'1px solid rgba(184,144,60,0.12)' }}>
            <p className="font-body text-[10px] tracking-[0.3em] uppercase text-center mb-10" style={{ color:'#B8903C' }}>{t.aboutWho.sectorsLabel}</p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-px" style={{ background:'rgba(184,144,60,0.08)' }}>
              {t.sectors.map(s => (
                <div key={s.label} className="flex flex-col items-center text-center py-8 px-4 gap-4" style={{ background:'#FAF7F2' }}>
                  <span className="text-3xl">{s.icon}</span>
                  <p className="font-body text-xs leading-snug text-charcoal/65">{s.label}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* VISION MISSION VALUES */}
      <section className="py-20 md:py-32" style={{ background:'#0D0B09' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <ScrollReveal variant="fadeUp" className="text-center mb-16">
            <span className="section-eyebrow text-yellow-500">{t.aboutVM.eyebrow}</span>
            <div className="gold-divider" />
            <h2 className="section-title-light mt-4">{t.aboutVM.title}<br /><em className="not-italic" style={{ color:'#D4AC5A' }}>{t.aboutVM.titleEm}</em></h2>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 gap-px mb-px" style={{ background:'rgba(255,255,255,0.05)' }}>
            {[{ tag:t.aboutVM.visionTitle, icon:'🔭', text:t.aboutVM.visionText },{ tag:t.aboutVM.missionTitle, icon:'🎯', text:t.aboutVM.missionText }].map((item,i) => (
              <ScrollReveal key={item.tag} delay={i*0.15} variant="fadeUp">
                <div className="p-10 h-full" style={{ background:'rgba(13,11,9,0.8)' }}>
                  <div className="flex items-center gap-3 mb-6"><span className="text-2xl">{item.icon}</span><span className="font-body text-[10px] tracking-[0.3em] uppercase text-yellow-500">{item.tag}</span></div>
                  <div className="w-10 h-px mb-6" style={{ background:'#B8903C' }} />
                  <p className="font-display text-xl md:text-2xl font-300 italic text-white/80 leading-relaxed">"{item.text}"</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px mt-px" style={{ background:'rgba(255,255,255,0.05)' }}>
            {t.values.map((v,i) => (
              <ScrollReveal key={v.num} delay={i*0.1} variant="fadeUp">
                <div className="p-8 hover:bg-white/5 transition-colors duration-500 h-full" style={{ background:'rgba(13,11,9,0.8)' }}>
                  <span className="font-display text-4xl font-300 mb-4 block" style={{ color:'rgba(184,144,60,0.3)' }}>{v.num}</span>
                  <h3 className="font-display text-xl font-400 text-white mb-3">{v.title}</h3>
                  <div className="w-8 h-px mb-4" style={{ background:'#B8903C' }} />
                  <p className="font-body text-xs leading-loose text-white/45">{v.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
          <ScrollReveal variant="fadeUp" delay={0.2} className="mt-px">
            <div className="p-8 md:p-12 text-center" style={{ background:'rgba(184,144,60,0.06)', border:'1px solid rgba(184,144,60,0.15)' }}>
              <span className="font-body text-[10px] tracking-[0.3em] uppercase text-yellow-500 block mb-4">{t.aboutVM.approachTitle}</span>
              <p className="font-display text-2xl md:text-3xl font-300 italic text-white/70 max-w-2xl mx-auto">"{t.aboutVM.approachText}"</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ORGANIZATIONAL STRUCTURE */}
      <section className="py-20 md:py-28" style={{ background:'#F0E8DA' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <ScrollReveal variant="fadeUp" className="text-center mb-14">
            <span className="section-eyebrow">{t.aboutStructure.eyebrow}</span>
            <div className="gold-divider" />
            <h2 className="section-title mt-4">{t.aboutStructure.title}<br /><em className="not-italic font-400" style={{ color:'#8B6350' }}>{t.aboutStructure.titleEm}</em></h2>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 gap-6">
            {depts.map((dept,i) => (
              <ScrollReveal key={dept.title} delay={i*0.1} variant="fadeUp">
                <div className="p-8 h-full" style={{ background:'#FAF7F2', border:'1px solid rgba(184,144,60,0.12)' }}>
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-1 self-stretch flex-shrink-0" style={{ background:depColors[i], minHeight:'40px' }} />
                    <div><h3 className="font-display text-xl font-400 text-onyx">{dept.title}</h3><p className="font-body text-xs leading-relaxed text-charcoal/55 mt-2">{dept.desc}</p></div>
                  </div>
                  <div className="flex flex-wrap gap-2">{dept.units.map(u => (<span key={u} className="px-3 py-1 font-body text-[10px] tracking-wide" style={{ background:'rgba(184,144,60,0.08)', border:'1px solid rgba(184,144,60,0.2)', color:'#8B6350' }}>{u}</span>))}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* WORKFORCE & METHODOLOGY */}
      <section className="py-20 md:py-28" style={{ background:'#FAF7F2' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <ScrollReveal variant={isAr?'fadeRight':'fadeLeft'}>
              <span className="section-eyebrow">{t.aboutWorkforce.eyebrow}</span>
              <div className="gold-divider-left" />
              <h2 className="font-display text-4xl md:text-5xl font-300 text-onyx mt-4 mb-8 leading-tight">
                {t.aboutWorkforce.title}<br /><em className="not-italic font-500" style={{ color:'#8B6350' }}>{t.aboutWorkforce.titleEm}</em>
              </h2>
              <div className="mb-8 p-6" style={{ background:'rgba(184,144,60,0.06)', border:'1px solid rgba(184,144,60,0.15)' }}>
                <p className="font-display text-5xl font-300 mb-2" style={{ color:'#B8903C' }}>{t.aboutWorkforce.badge}</p>
                <p className="font-body text-sm text-charcoal/60">{t.aboutWorkforce.badgeSub}</p>
              </div>
              <div className="space-y-3 mb-8">{t.workforceItems.map(item => (<div key={item} className="flex items-center gap-3"><div className="w-5 h-px flex-shrink-0" style={{ background:'#B8903C' }} /><span className="font-body text-sm text-charcoal/65">{item}</span></div>))}</div>
              <div className="p-6" style={{ background:'#F0E8DA', border:'1px solid rgba(184,144,60,0.1)' }}>
                <p className="font-body text-[10px] tracking-[0.2em] uppercase text-yellow-700 mb-4">{t.aboutWorkforce.capacityTitle}</p>
                <div className="space-y-2">{t.capacityItems.map(item => (<div key={item} className="flex items-start gap-3"><span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background:'#B8903C' }} /><span className="font-body text-sm text-charcoal/65">{item}</span></div>))}</div>
              </div>
            </ScrollReveal>
            <ScrollReveal variant={isAr?'fadeLeft':'fadeRight'}>
              <span className="section-eyebrow">{t.aboutWorkforce.methodEyebrow}</span>
              <div className="gold-divider-left" />
              <h2 className="font-display text-4xl md:text-5xl font-300 text-onyx mt-4 mb-8 leading-tight">
                {t.aboutWorkforce.methodTitle}<br /><em className="not-italic font-500" style={{ color:'#8B6350' }}>{t.aboutWorkforce.methodTitleEm}</em>
              </h2>
              <p className="font-body text-sm text-charcoal/60 leading-loose mb-10">{t.aboutWorkforce.methodDesc}</p>
              <div className="space-y-0">{t.methodology.map((m,i) => (
                <motion.div key={m.num} initial={{ opacity:0, x:isAr?20:-20 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ delay:i*0.1, duration:0.5 }}
                  className="flex gap-5 items-start py-5 group" style={{ borderBottom: i<t.methodology.length-1?'1px solid rgba(184,144,60,0.1)':'none' }}>
                  <span className="font-display text-3xl font-300 flex-shrink-0 w-12 text-right" style={{ color:'rgba(184,144,60,0.4)' }}>{m.num}</span>
                  <div className="flex items-center gap-4 flex-1"><div className="w-px h-8 flex-shrink-0" style={{ background:'rgba(184,144,60,0.2)' }} /><p className="font-body text-sm font-500 text-onyx group-hover:text-yellow-700 transition-colors duration-300">{m.step}</p></div>
                </motion.div>
              ))}</div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CLIENTS */}
      <section className="py-20 md:py-28" style={{ background:'#0D0B09' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <ScrollReveal variant="fadeUp" className="text-center mb-16">
            <span className="section-eyebrow text-yellow-500">{t.aboutClients.eyebrow}</span>
            <div className="gold-divider" />
            <h2 className="section-title-light mt-4">{t.aboutClients.title}<br /><em className="not-italic" style={{ color:'#D4AC5A' }}>{t.aboutClients.titleEm}</em></h2>
            <p className="font-body text-sm text-white/35 mt-4 max-w-lg mx-auto leading-loose">{t.aboutClients.desc}</p>
          </ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-px" style={{ background:'rgba(255,255,255,0.04)' }}>
            {(isAr?clientsAr:clients).map((client,i) => (
              <ScrollReveal key={client} delay={Math.min(i*0.05,0.5)} variant="fadeUp">
                <div className="flex items-center justify-center text-center py-8 px-4 h-full hover:bg-white/5 transition-colors duration-300 cursor-default" style={{ background:'rgba(13,11,9,0.7)', minHeight:'90px' }}>
                  <p className="font-body text-[10px] leading-snug text-white/45 tracking-wide">{client}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 text-center" style={{ background:'#F0E8DA' }}>
        <div className="max-w-3xl mx-auto px-6">
          <ScrollReveal variant="fadeUp">
            <span className="section-eyebrow">{t.aboutCTA.eyebrow}</span>
            <div className="gold-divider" />
            <h2 className="section-title mt-4 mb-6">{t.aboutCTA.title}<br /><em className="not-italic font-400" style={{ color:'#8B6350' }}>{t.aboutCTA.titleEm}</em></h2>
            <p className="font-body text-sm text-charcoal/55 leading-loose mb-10">{t.aboutCTA.desc}</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/contact" className="btn-gold">{t.aboutCTA.cta1}</Link>
              <Link to="/collections" className="btn-dark">{t.aboutCTA.cta2}</Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
