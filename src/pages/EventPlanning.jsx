import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useLang } from '../context/LanguageContext'
import { eventGallery, eventHero } from '../data/events'

// WhatsApp CTA with an events-specific message
const WA_LINK = `https://wa.me/962790840538?text=${encodeURIComponent(
  "Hello EMDAD, I'm planning an exhibition/event and would like to discuss booth design and production.",
)}`

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
}

export default function EventPlanning() {
  const { isAr } = useLang()
  const [filter, setFilter] = useState('all')

  const services = [
    {
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
        </svg>
      ),
      title: 'Exhibition Booth Design & Fabrication',
      titleAr: 'تصميم وتصنيع أجنحة المعارض',
      desc: 'Custom booths engineered in 3D and built in our own factory — carpentry, premium finishes, lighting and smart integrations, delivered and installed at the venue.',
      descAr: 'أجنحة مخصصة تُصمم ثلاثي الأبعاد وتُصنع في مصنعنا — نجارة وتشطيبات فاخرة وإضاءة وأنظمة ذكية، مع التوصيل والتركيب في موقع المعرض.',
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
        </svg>
      ),
      title: 'Event Planning & Production',
      titleAr: 'تخطيط وإنتاج الفعاليات',
      desc: 'End-to-end event production: concept, staging, furniture, lighting and technical infrastructure — one team from the first sketch to show day.',
      descAr: 'إنتاج فعاليات متكامل: الفكرة، المنصات، الأثاث، الإضاءة والبنية التقنية — فريق واحد من أول مخطط حتى يوم الحدث.',
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
        </svg>
      ),
      title: 'Exhibition Planning & Management',
      titleAr: 'تخطيط وإدارة المعارض',
      desc: 'Full exhibition management: floor plans, exhibitor coordination, build schedules and on-site supervision for a flawless opening day.',
      descAr: 'إدارة معارض شاملة: مخططات الأرضيات، تنسيق العارضين، جداول البناء والإشراف الميداني لافتتاح مثالي.',
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
    { id: 'booths', en: 'Exhibition Booths', ar: 'أجنحة المعارض' },
    { id: 'events', en: 'Events', ar: 'الفعاليات' },
    { id: 'exhibitions', en: 'Exhibitions', ar: 'المعارض' },
  ]

  const shown = filter === 'all' ? eventGallery : eventGallery.filter((m) => m.tag === filter)

  return (
    <div className="min-h-screen" style={{ background: '#FAF7F2' }} dir={isAr ? 'rtl' : 'ltr'}>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <div className="relative pt-32 pb-24 overflow-hidden" style={{ background: '#0D0B09' }}>
        <img src={eventHero} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ filter: 'brightness(0.22) saturate(0.6)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(13,11,9,0.5), rgba(13,11,9,0.97))' }} />
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2.5 px-4 py-2 mb-6" style={{ border: '1px solid rgba(184,144,60,0.35)', background: 'rgba(184,144,60,0.08)' }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#B8903C' }} />
              <span className="font-body text-xs tracking-[0.3em] uppercase" style={{ color: '#D4AC5A' }}>
                {isAr ? 'المعارض والفعاليات' : 'Events & Exhibitions'}
              </span>
            </div>
            <h1 className="font-display font-300 text-white leading-tight mb-5" style={{ fontSize: 'clamp(2.3rem,6vw,4.3rem)' }}>
              {isAr ? 'أجنحة معارض وفعاليات' : 'Exhibition booths & events,'}<br />
              <em className="not-italic" style={{ color: '#D4AC5A' }}>
                {isAr ? 'تُصنع في مصنعنا — لا تُستأجر' : 'built in our factory — not outsourced.'}
              </em>
            </h1>
            <p className="font-body text-sm leading-loose text-white/50 max-w-2xl mx-auto mb-9">
              {isAr
                ? 'إمداد تصمم وتصنع وتركب أجنحة المعارض، وتخطط وتنتج الفعاليات والمعارض من الألف إلى الياء — بنفس الحرفية التي نصنع بها أثاثنا.'
                : 'EMDAD designs, fabricates and installs exhibition booths, and plans full events and exhibitions end-to-end — with the same craftsmanship that builds our furniture.'}
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

      {/* ── Services ─────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
        <motion.div {...fadeUp} className="text-center mb-14">
          <span className="section-eyebrow" style={{ color: '#B8903C' }}>{isAr ? 'ماذا نقدم' : 'What we deliver'}</span>
          <div className="gold-divider" />
          <h2 className="font-display text-4xl font-300 text-onyx mt-4">
            {isAr ? 'ثلاث خدمات، ' : 'Three services, '}
            <em className="not-italic" style={{ color: '#B8903C' }}>{isAr ? 'فريق واحد' : 'one team'}</em>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <motion.div key={s.title} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.12 }}
              className="p-8 group hover:-translate-y-1 transition-transform duration-300"
              style={{ background: 'white', border: '1px solid rgba(184,144,60,0.15)' }}>
              <div className="w-14 h-14 flex items-center justify-center mb-6" style={{ background: 'rgba(184,144,60,0.08)', border: '1px solid rgba(184,144,60,0.25)', color: '#B8903C' }}>
                {s.icon}
              </div>
              <h3 className="font-display text-xl font-400 text-onyx mb-3 leading-snug">{isAr ? s.titleAr : s.title}</h3>
              <p className="font-body text-sm leading-relaxed text-charcoal/60">{isAr ? s.descAr : s.desc}</p>
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
          <h2 className="font-display text-4xl font-300 text-onyx mt-4">
            {isAr ? 'معرض ' : 'Selected '}
            <em className="not-italic" style={{ color: '#B8903C' }}>{isAr ? 'الأعمال' : 'projects'}</em>
          </h2>
        </motion.div>

        {eventGallery.length > 0 ? (
          <>
            {/* Filters */}
            <div className="flex flex-wrap gap-2 justify-center mb-10">
              {filters.map((f) => {
                const active = filter === f.id
                return (
                  <button key={f.id} onClick={() => setFilter(f.id)}
                    className="px-4 py-2 font-body text-xs tracking-widest uppercase transition-all duration-200"
                    style={{
                      background: active ? '#B8903C' : 'transparent',
                      color: active ? 'white' : 'rgba(28,25,23,0.6)',
                      border: `1px solid ${active ? '#B8903C' : 'rgba(184,144,60,0.3)'}`,
                    }}>
                    {isAr ? f.ar : f.en}
                  </button>
                )
              })}
            </div>

            {/* Media grid — images and videos */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {shown.map((m, i) => (
                <motion.div key={m.src} initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.5, delay: Math.min(i * 0.05, 0.4) }}
                  className={`relative overflow-hidden group ${m.type === 'video' ? 'col-span-2' : ''}`}
                  style={{ background: '#1C1917', aspectRatio: m.type === 'video' ? '16/9' : '4/3' }}>
                  {m.type === 'video' ? (
                    <video src={m.src} poster={m.poster} controls playsInline preload="metadata"
                      className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <img src={m.src} alt={isAr ? (m.titleAr || m.title) : m.title} loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      style={{ filter: 'brightness(0.88)' }} />
                  )}
                  {(m.title || m.titleAr) && m.type !== 'video' && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                      style={{ background: 'linear-gradient(to top, rgba(13,11,9,0.9), transparent)' }}>
                      <p className="font-display text-sm text-white">{isAr ? (m.titleAr || m.title) : m.title}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          /* Elegant placeholder until real media is added */
          <motion.div {...fadeUp} className="text-center py-16 px-6" style={{ background: 'white', border: '1px dashed rgba(184,144,60,0.35)' }}>
            <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center" style={{ background: 'rgba(184,144,60,0.08)', border: '1px solid rgba(184,144,60,0.25)' }}>
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="#B8903C" strokeWidth={1.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
              </svg>
            </div>
            <h3 className="font-display text-2xl font-300 text-onyx mb-3">
              {isAr ? 'معرض أعمالنا قيد التجهيز' : 'Our portfolio is being curated'}
            </h3>
            <p className="font-body text-sm text-charcoal/55 max-w-md mx-auto leading-loose mb-8">
              {isAr
                ? 'صور وفيديوهات حقيقية لأجنحتنا وفعالياتنا في طريقها إلى هنا. تواصل معنا لمشاهدة أعمالنا السابقة مباشرة.'
                : 'Real photos and videos of our booths, events and exhibitions are on their way. Contact us to see our previous work directly.'}
            </p>
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="btn-gold text-xs py-3 px-6">
              {isAr ? 'اطلب نماذج أعمالنا' : 'Request Our Portfolio'}
            </a>
          </motion.div>
        )}
      </div>

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
