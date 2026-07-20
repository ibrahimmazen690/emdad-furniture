import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '../context/LanguageContext'
import { eventGallery, eventHero } from '../data/events'

const WA_LINK = `https://wa.me/962790840538?text=${encodeURIComponent(
  "Hello EMDAD, I'm planning an exhibition/event and would like to discuss booth design and production.",
)}`

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
}

const PAGE_SIZE = 12

export default function EventPlanning() {
  const { isAr } = useLang()
  const [filter, setFilter] = useState('all')
  const [limit, setLimit] = useState(PAGE_SIZE)
  const [lightbox, setLightbox] = useState(null) // index within `shown`

  // The four disciplines from EMDAD's Selected Works 2026 portfolio
  const disciplines = [
    {
      icon: 'M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21',
      title: 'Exhibition Architecture',
      titleAr: 'عمارة المعارض',
      desc: 'Purpose-built spaces where identity, structure and visitor flow meet — designed in 3D and fabricated in our own factory.',
      descAr: 'مساحات مصممة خصيصاً تلتقي فيها الهوية والبنية وحركة الزوار — تُصمم ثلاثي الأبعاد وتُصنع في مصنعنا.',
    },
    {
      icon: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z',
      title: 'Brand Activations',
      titleAr: 'تفعيل العلامات التجارية',
      desc: 'Focused environments that turn visibility into interaction and engagement, with interactive touchpoints and smart integrations.',
      descAr: 'بيئات مركّزة تحوّل الظهور إلى تفاعل ومشاركة، بنقاط تفاعلية وأنظمة ذكية.',
    },
    {
      icon: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5',
      title: 'Events & Public Experiences',
      titleAr: 'الفعاليات والتجارب العامة',
      desc: 'Atmosphere, movement and production detail shaped into memorable moments — staging, lighting and scalable infrastructure.',
      descAr: 'أجواء وحركة وتفاصيل إنتاج تتشكل في لحظات لا تُنسى — منصات وإضاءة وبنية قابلة للتوسع.',
    },
    {
      icon: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z',
      title: 'Hospitality Environments',
      titleAr: 'بيئات الضيافة',
      desc: 'Welcoming spaces composed for comfort, conversation and lasting impressions — lounges, majlis settings and VIP areas.',
      descAr: 'مساحات ترحيبية مصممة للراحة والحوار والانطباع الدائم — صالات ومجالس ومناطق كبار الزوار.',
    },
  ]

  const steps = [
    { n: '01', t: 'Brief & Site Visit', ta: 'الاجتماع وزيارة الموقع', d: 'We study your brand, goals, space and budget.', da: 'ندرس علامتك وأهدافك والمساحة والميزانية.' },
    { n: '02', t: 'Concept & 3D Design', ta: 'الفكرة والتصميم ثلاثي الأبعاد', d: 'Photorealistic 3D of your booth or event before anything is built.', da: 'تصميم ثلاثي الأبعاد واقعي لجناحك أو فعاليتك قبل البدء بالتنفيذ.' },
    { n: '03', t: 'In-House Fabrication', ta: 'التصنيع في مصنعنا', d: 'Built by our own 160+ craftsmen — full control of quality and deadlines.', da: 'يُصنع على أيدي أكثر من 160 حرفياً لدينا — تحكم كامل بالجودة والمواعيد.' },
    { n: '04', t: 'Delivery & Installation', ta: 'التوصيل والتركيب', d: 'Transport, assembly and finishing at the venue, on schedule.', da: 'النقل والتجميع والتشطيب في الموقع وفق الجدول الزمني.' },
    { n: '05', t: 'Show-Time Support', ta: 'الدعم أثناء الحدث', d: 'On-site team during the event, then professional dismantling.', da: 'فريق ميداني طوال الحدث، ثم فك وتسليم احترافي.' },
  ]

  const capabilities = [
    { t: 'In-House Factory', ta: 'مصنع خاص' },
    { t: 'Design to Install', ta: 'من التصميم إلى التركيب' },
    { t: 'Smart Integrations', ta: 'أنظمة ذكية' },
    { t: 'Government & Corporate', ta: 'حكومي ومؤسسي' },
  ]

  const filters = [
    { id: 'all', en: 'All Work', ar: 'كل الأعمال' },
    { id: 'exhibition-architecture', en: 'Exhibition Architecture', ar: 'عمارة المعارض' },
    { id: 'brand-activations', en: 'Brand Activations', ar: 'تفعيل العلامات' },
    { id: 'events-public', en: 'Events & Public', ar: 'الفعاليات العامة' },
    { id: 'hospitality', en: 'Hospitality', ar: 'الضيافة' },
  ]

  const shown = filter === 'all' ? eventGallery : eventGallery.filter((m) => m.tag === filter)
  const visible = shown.slice(0, limit)

  const pick = (id) => { setFilter(id); setLimit(PAGE_SIZE) }

  // ── Lightbox controls ───────────────────────────────────────────────────
  const close = useCallback(() => setLightbox(null), [])
  const step = useCallback((d) => {
    setLightbox((i) => (i === null ? i : (i + d + shown.length) % shown.length))
  }, [shown.length])

  useEffect(() => {
    if (lightbox === null) return
    const onKey = (e) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [lightbox, close, step])

  const current = lightbox !== null ? shown[lightbox] : null

  return (
    <div className="min-h-screen" style={{ background: '#FAF7F2' }} dir={isAr ? 'rtl' : 'ltr'}>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <div className="relative pt-32 pb-24 overflow-hidden" style={{ background: '#0D0B09' }}>
        <img src={eventHero} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ filter: 'brightness(0.28) saturate(0.75)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(13,11,9,0.45), rgba(13,11,9,0.96))' }} />
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2.5 px-4 py-2 mb-6" style={{ border: '1px solid rgba(184,144,60,0.35)', background: 'rgba(184,144,60,0.08)' }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#B8903C' }} />
              <span className="font-body text-xs tracking-[0.3em] uppercase" style={{ color: '#D4AC5A' }}>
                {isAr ? 'المعارض والفعاليات — أعمال مختارة 2026' : 'Exhibitions & Events — Selected Works 2026'}
              </span>
            </div>
            <h1 className="font-display font-300 text-white leading-tight mb-5" style={{ fontSize: 'clamp(2.2rem,5.5vw,4.2rem)' }}>
              {isAr ? 'صُممت لتُرى.' : 'Designed to be seen.'}<br />
              <em className="not-italic" style={{ color: '#D4AC5A' }}>
                {isAr ? 'وبُنيت لتُعاش.' : 'Built to be experienced.'}
              </em>
            </h1>
            <p className="font-body text-sm leading-loose text-white/55 max-w-2xl mx-auto mb-9">
              {isAr
                ? 'إمداد تصمم وتصنع وتركب أجنحة المعارض، وتخطط وتنتج الفعاليات والتجارب العامة من الألف إلى الياء — بنفس الحرفية التي نصنع بها أثاثنا، وفي مصنعنا الخاص.'
                : 'EMDAD designs, fabricates and installs exhibition architecture, brand activations, events and hospitality environments — end to end, in our own factory.'}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="btn-gold">
                {isAr ? 'ناقش مشروعك معنا' : 'Discuss Your Project'}
              </a>
              <Link to="/appointment" className="btn-outline">
                {isAr ? 'احجز اجتماعاً' : 'Book a Meeting'}
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Capability strip ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px" style={{ background: 'rgba(184,144,60,0.12)' }}>
        {capabilities.map((c) => (
          <div key={c.t} className="py-6 px-4 text-center" style={{ background: '#0D0B09' }}>
            <p className="font-body text-[10px] tracking-[0.25em] uppercase" style={{ color: '#D4AC5A' }}>
              {isAr ? c.ta : c.t}
            </p>
          </div>
        ))}
      </div>

      {/* ── Disciplines ──────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
        <motion.div {...fadeUp} className="text-center mb-14">
          <span className="section-eyebrow" style={{ color: '#B8903C' }}>{isAr ? 'ماذا نقدم' : 'What we deliver'}</span>
          <div className="gold-divider" />
          <h2 className="font-display text-4xl font-300 text-onyx mt-4">
            {isAr ? 'أربعة تخصصات، ' : 'Four disciplines, '}
            <em className="not-italic" style={{ color: '#B8903C' }}>{isAr ? 'فريق واحد' : 'one team'}</em>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {disciplines.map((s, i) => (
            <motion.div key={s.title} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.1 }}
              className="p-7 hover:-translate-y-1 transition-transform duration-300"
              style={{ background: 'white', border: '1px solid rgba(184,144,60,0.15)' }}>
              <div className="w-13 h-13 flex items-center justify-center mb-5" style={{ width: 52, height: 52, background: 'rgba(184,144,60,0.08)', border: '1px solid rgba(184,144,60,0.25)', color: '#B8903C' }}>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
                </svg>
              </div>
              <h3 className="font-display text-lg font-400 text-onyx mb-2.5 leading-snug">{isAr ? s.titleAr : s.title}</h3>
              <p className="font-body text-xs leading-relaxed text-charcoal/60">{isAr ? s.descAr : s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Process ──────────────────────────────────────────────────── */}
      <div style={{ background: '#0D0B09' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
          <motion.div {...fadeUp} className="text-center mb-14">
            <span className="section-eyebrow" style={{ color: '#D4AC5A' }}>{isAr ? 'كيف نعمل' : 'How we work'}</span>
            <div className="gold-divider" />
            <h2 className="font-display text-4xl font-300 text-white mt-4">
              {isAr ? 'من الفكرة إلى ' : 'From brief to '}
              <em className="not-italic" style={{ color: '#D4AC5A' }}>{isAr ? 'يوم الافتتاح' : 'opening day'}</em>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-px" style={{ background: 'rgba(184,144,60,0.15)' }}>
            {steps.map((st, i) => (
              <motion.div key={st.n} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.08 }}
                className="p-7" style={{ background: '#0D0B09' }}>
                <p className="font-accent text-3xl font-700 mb-4" style={{ color: 'rgba(184,144,60,0.4)' }}>{st.n}</p>
                <h3 className="font-display text-lg font-400 text-white mb-2">{isAr ? st.ta : st.t}</h3>
                <p className="font-body text-xs leading-relaxed text-white/40">{isAr ? st.da : st.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Portfolio ────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
        <motion.div {...fadeUp} className="text-center mb-10">
          <span className="section-eyebrow" style={{ color: '#B8903C' }}>{isAr ? 'أعمالنا' : 'Our work'}</span>
          <div className="gold-divider" />
          <h2 className="font-display text-4xl font-300 text-onyx mt-4 mb-3">
            {isAr ? 'أعمال ' : 'Selected '}
            <em className="not-italic" style={{ color: '#B8903C' }}>{isAr ? 'مختارة' : 'works'}</em>
          </h2>
          <p className="font-body text-sm text-charcoal/50">
            {eventGallery.length} {isAr ? 'مشروعاً منفذاً' : 'delivered projects'}
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {filters.map((f) => {
            const active = filter === f.id
            const n = f.id === 'all' ? eventGallery.length : eventGallery.filter((m) => m.tag === f.id).length
            return (
              <button key={f.id} onClick={() => pick(f.id)}
                className="px-3.5 py-2 font-body text-[11px] tracking-widest uppercase transition-all duration-200"
                style={{
                  background: active ? '#B8903C' : 'transparent',
                  color: active ? 'white' : 'rgba(28,25,23,0.6)',
                  border: `1px solid ${active ? '#B8903C' : 'rgba(184,144,60,0.3)'}`,
                }}>
                {isAr ? f.ar : f.en} <span style={{ opacity: 0.6 }}>({n})</span>
              </button>
            )
          })}
        </div>

        {/* Media grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {visible.map((m, i) => (
            <motion.div key={m.src} initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.5, delay: Math.min((i % PAGE_SIZE) * 0.04, 0.35) }}
              onClick={() => m.type !== 'video' && setLightbox(i)}
              className={`relative overflow-hidden group ${m.type !== 'video' ? 'cursor-zoom-in' : ''} ${m.type === 'video' ? 'col-span-2' : ''}`}
              style={{ background: '#1C1917', aspectRatio: m.type === 'video' ? '16/9' : '4/3' }}>
              {m.type === 'video' ? (
                <video src={m.src} poster={m.poster} controls playsInline preload="metadata"
                  className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <>
                  <img src={m.src} alt={isAr ? (m.titleAr || m.title) : m.title} loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    style={{ filter: 'brightness(0.9)' }} />
                  <div className="absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                    style={{ background: 'linear-gradient(to top, rgba(13,11,9,0.92) 0%, rgba(13,11,9,0.15) 55%, transparent 100%)' }}>
                    <p className="font-body text-[11px] leading-snug text-white/90">{isAr ? (m.titleAr || m.title) : m.title}</p>
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </div>

        {/* Load more */}
        {limit < shown.length && (
          <div className="text-center mt-10">
            <button onClick={() => setLimit((l) => l + PAGE_SIZE)} className="btn-dark">
              {isAr ? `عرض المزيد (${shown.length - limit})` : `Load more (${shown.length - limit})`}
            </button>
          </div>
        )}
      </div>

      {/* ── Lightbox ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {current && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-8"
            style={{ background: 'rgba(13,11,9,0.97)', backdropFilter: 'blur(6px)' }}
            onClick={close}
          >
            <img src={current.src} alt={isAr ? (current.titleAr || current.title) : current.title}
              onClick={(e) => e.stopPropagation()}
              className="max-w-full object-contain" style={{ maxHeight: '82vh' }} />

            <p className="absolute bottom-6 left-0 right-0 text-center font-body text-xs text-white/70 px-8 pointer-events-none">
              {isAr ? (current.titleAr || current.title) : current.title}
              <span className="block mt-1 text-white/35 tracking-widest">{lightbox + 1} / {shown.length}</span>
            </p>

            {/* Prev / Next */}
            {[{ d: -1, side: 'left', icon: 'M15 19l-7-7 7-7' }, { d: 1, side: 'right', icon: 'M9 5l7 7-7 7' }].map((b) => (
              <button key={b.side} onClick={(e) => { e.stopPropagation(); step(b.d) }}
                className="absolute top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center transition-all hover:scale-110"
                style={{ [b.side]: '14px', background: 'rgba(184,144,60,0.16)', border: '1px solid rgba(184,144,60,0.4)' }}
                aria-label={b.side}>
                <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={b.icon} />
                </svg>
              </button>
            ))}

            <button onClick={close} className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center transition-all hover:bg-yellow-500/20"
              style={{ border: '1px solid rgba(184,144,60,0.4)', background: 'rgba(13,11,9,0.6)' }} aria-label="Close">
              <svg className="w-5 h-5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Why EMDAD ────────────────────────────────────────────────── */}
      <div style={{ background: '#0D0B09' }}>
        <div className="max-w-5xl mx-auto px-6 lg:px-12 py-20 text-center">
          <motion.div {...fadeUp}>
            <span className="section-eyebrow" style={{ color: '#D4AC5A' }}>{isAr ? 'لماذا إمداد' : 'Why EMDAD'}</span>
            <div className="gold-divider" />
            <h2 className="font-display text-3xl sm:text-4xl font-300 text-white mt-4 mb-6 leading-snug">
              {isAr ? 'نحن مُصنّعون أولاً — ' : 'We are manufacturers first — '}
              <em className="not-italic" style={{ color: '#D4AC5A' }}>
                {isAr ? 'جناحك يُبنى بأيدينا، لا يُستعان بغيرنا' : 'your booth is built by our own hands'}
              </em>
            </h2>
            <p className="font-body text-sm leading-loose text-white/45 max-w-2xl mx-auto mb-10">
              {isAr
                ? 'معظم شركات الفعاليات تستأجر مقاولين. في إمداد، نفس الحرفيين الذين يصنعون أثاثنا الفاخر — أكثر من 160 محترفاً — هم من يبني جناحك، ما يمنحك تحكماً كاملاً بالجودة والتكلفة والمواعيد.'
                : 'Most event companies subcontract the build. At EMDAD, the same 160+ craftsmen who build our premium furniture build your booth — giving you total control over quality, cost and deadlines.'}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-8 py-4 text-white font-body text-sm tracking-widest uppercase transition-all hover:-translate-y-1"
                style={{ background: '#25D366' }}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                {isAr ? 'واتساب' : 'WhatsApp Us'}
              </a>
              <Link to="/appointment" className="btn-gold">{isAr ? 'احجز اجتماعاً' : 'Book a Meeting'}</Link>
              <Link to="/quote" className="btn-outline">{isAr ? 'اطلب عرض سعر' : 'Request a Quote'}</Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
