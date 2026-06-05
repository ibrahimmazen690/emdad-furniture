import React, { useState, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '../context/LanguageContext'
import { analyzeRoomImage, CATEGORY_META, URGENCY_COLORS } from '../utils/analyzeRoom'

// ── Loading steps ─────────────────────────────────────────────────────────────
const STEPS_EN = [
  'Reading room type and dimensions…',
  'Detecting style and color palette…',
  'Identifying design opportunities…',
  'Matching EMDAD furniture collections…',
  'Composing your recommendations…',
]
const STEPS_AR = [
  'قراءة نوع الغرفة والأبعاد…',
  'اكتشاف النمط ولوحة الألوان…',
  'تحديد فرص التحسين…',
  'مطابقة مجموعات إمداد…',
  'إعداد توصياتك…',
]

// ── Confidence bar ─────────────────────────────────────────────────────────────
function ConfBar({ value }) {
  const pct = Math.round((value || 0) * 100)
  const color = pct >= 85 ? '#3B6D11' : pct >= 70 ? '#B8903C' : '#534AB7'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background:'rgba(28,25,23,0.08)' }}>
        <motion.div initial={{ width:0 }} animate={{ width:`${pct}%` }} transition={{ duration:1, ease:'easeOut' }}
          className="h-full rounded-full" style={{ background:color }} />
      </div>
      <span className="font-body text-[10px] font-500 w-8 text-right" style={{ color }}>{pct}%</span>
    </div>
  )
}

// ── Color swatch row ───────────────────────────────────────────────────────────
function ColorRow({ palette, names }) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      {(palette || []).map((hex, i) => (
        <div key={hex} className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-sm flex-shrink-0" style={{ background:hex, border:'1px solid rgba(0,0,0,0.08)' }} />
          <span className="font-body text-xs text-charcoal/60">{names?.[i] || hex}</span>
        </div>
      ))}
    </div>
  )
}

// ── Recommendation card ────────────────────────────────────────────────────────
function RecommendationCard({ rec, index, isAr }) {
  const meta  = CATEGORY_META[rec.categoryId] || {}
  const badge = URGENCY_COLORS[rec.urgency]   || URGENCY_COLORS.recommended
  const [imgSrc, setImgSrc] = useState(meta.coverImg || '/images/master-bedrooms/BED1.jpg')

  return (
    <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ delay:index*0.12, duration:0.6, ease:[0.25,0.46,0.45,0.94] }}
      className="overflow-hidden" style={{ background:'white', border:'1px solid rgba(184,144,60,0.12)' }}>
      <div className="grid sm:grid-cols-3">
        {/* Image */}
        <div className="relative overflow-hidden sm:col-span-1" style={{ minHeight:160 }}>
          <img src={imgSrc} alt={rec.categoryName} onError={() => setImgSrc(meta.altImg || '')}
            className="absolute inset-0 w-full h-full object-cover" style={{ filter:'brightness(0.82) saturate(1.1)' }} />
          <div className="absolute inset-0" style={{ background:'linear-gradient(to top, rgba(13,11,9,0.7), transparent)' }} />
          <div className="absolute bottom-3 left-3">
            <span className="font-body text-[9px] tracking-widest uppercase text-white/70">{meta.count} {isAr?'تصميم':'designs'}</span>
          </div>
          {/* Urgency badge */}
          <div className="absolute top-3 right-3 px-2 py-0.5 font-body text-[9px] tracking-wide uppercase font-500"
            style={{ background:badge.bg, border:`1px solid ${badge.border}`, color:badge.text, backdropFilter:'blur(8px)' }}>
            {isAr ? { essential:'أساسي', recommended:'موصى به', optional:'اختياري' }[rec.urgency] : badge.label}
          </div>
        </div>

        {/* Content */}
        <div className="sm:col-span-2 p-5 flex flex-col justify-between">
          <div>
            <p className="font-body text-[9px] tracking-[0.3em] uppercase mb-1.5" style={{ color:'#B8903C' }}>{isAr?'موصى به':'Recommended'}</p>
            <h3 className="font-display text-xl font-400 text-onyx mb-3">{isAr ? ({
              'master-bedrooms':'غرف نوم رئيسية','single-bedrooms':'غرف نوم مفردة','living-rooms':'غرف معيشة',
              'kitchens':'مطابخ','dining-table':'طاولات طعام','dressing-room':'غرف الملابس',
              'landscape':'خارجي ومناظر طبيعية','tv-units':'وحدات تلفزيون'
            }[rec.categoryId] || rec.categoryName) : rec.categoryName}</h3>
            <p className="font-body text-sm leading-relaxed text-charcoal/65 mb-4">{rec.reason}</p>

            {/* Finish suggestion */}
            {rec.finishSuggestion && (
              <div className="flex items-center gap-2 mb-4">
                <span className="font-body text-[9px] tracking-widest uppercase text-charcoal/35">{isAr?'الإنهاء المقترح:':'Suggested finish:'}</span>
                <span className="px-2.5 py-0.5 font-body text-[10px] font-500" style={{ background:'rgba(184,144,60,0.08)', border:'1px solid rgba(184,144,60,0.2)', color:'#8B6350' }}>
                  {rec.finishSuggestion}
                </span>
              </div>
            )}

            {/* Confidence */}
            <div className="mb-1">
              <p className="font-body text-[9px] tracking-widest uppercase text-charcoal/30 mb-1.5">{isAr?'تطابق النمط':'Style match'}</p>
              <ConfBar value={rec.confidence} />
            </div>
          </div>

          <div className="flex gap-3 mt-5 pt-4" style={{ borderTop:'1px solid rgba(184,144,60,0.1)' }}>
            <Link to={meta.link || '/collections'} className="btn-gold text-xs py-2.5 px-5">
              {isAr?'عرض المجموعة':'View Collection'} →
            </Link>
            <Link to="/quote" className="btn-dark text-xs py-2.5 px-5">
              {isAr?'عرض سعر':'Get Quote'}
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ── Upload Zone ─────────────────────────────────────────────────────────────────
function UploadZone({ onFile, isAr }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  const handle = useCallback((file) => {
    if (file && file.type.startsWith('image/')) onFile(file)
  }, [onFile])

  const onDrop = useCallback((e) => {
    e.preventDefault(); setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handle(file)
  }, [handle])

  return (
    <div onDragOver={e => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)} onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
      className="cursor-pointer transition-all duration-300"
      style={{
        border: `2px dashed ${dragging ? '#B8903C' : 'rgba(184,144,60,0.3)'}`,
        background: dragging ? 'rgba(184,144,60,0.04)' : 'rgba(250,247,242,0.5)',
        padding: '4rem 2rem',
        textAlign: 'center',
      }}>
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
        onChange={e => handle(e.target.files?.[0])} />

      <motion.div animate={{ scale: dragging ? 1.08 : 1 }} transition={{ duration:0.2 }}>
        {/* Upload icon */}
        <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center" style={{ background:'rgba(184,144,60,0.08)', border:'1px solid rgba(184,144,60,0.2)' }}>
          <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="#B8903C" strokeWidth={1.2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="font-display text-2xl font-300 text-onyx mb-3">{isAr ? 'اسحب صورة غرفتك هنا' : 'Drag your room photo here'}</h3>
        <p className="font-body text-sm text-charcoal/50 mb-6">{isAr ? 'أو انقر للاختيار من جهازك' : 'or click to choose from your device'}</p>
        <span className="inline-block px-5 py-2.5 font-body text-xs tracking-widest uppercase text-yellow-700" style={{ background:'rgba(184,144,60,0.08)', border:'1px solid rgba(184,144,60,0.25)' }}>
          {isAr ? 'اختر صورة' : 'Choose photo'}
        </span>
        <p className="font-body text-[10px] text-charcoal/30 mt-5">{isAr ? 'JPEG · PNG · WEBP · حتى 6MB' : 'JPEG · PNG · WEBP · Up to 6MB'}</p>
      </motion.div>
    </div>
  )
}

// ── Loading Screen ─────────────────────────────────────────────────────────────
function LoadingView({ stepIndex, isAr }) {
  const steps = isAr ? STEPS_AR : STEPS_EN
  return (
    <div className="py-20 text-center">
      {/* Spinning logo */}
      <div className="relative w-24 h-24 mx-auto mb-10">
        <motion.div className="absolute inset-0 rounded-full" style={{ border:'2px solid rgba(184,144,60,0.15)' }} />
        <motion.div className="absolute inset-0 rounded-full" style={{ border:'2px solid transparent', borderTopColor:'#B8903C' }}
          animate={{ rotate:360 }} transition={{ duration:1.2, repeat:Infinity, ease:'linear' }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-accent text-xl font-700 text-onyx">E</span>
        </div>
      </div>

      <h3 className="font-display text-2xl font-300 text-onyx mb-3">{isAr ? 'يحلل الذكاء الاصطناعي غرفتك…' : 'AI is analyzing your room…'}</h3>
      <p className="font-body text-sm text-charcoal/45 mb-10">{isAr ? 'يستغرق هذا حوالي 20 ثانية' : 'This usually takes about 20 seconds'}</p>

      {/* Steps */}
      <div className="max-w-sm mx-auto space-y-3 text-left">
        {steps.map((step, i) => (
          <motion.div key={step} initial={{ opacity:0, x:-20 }} animate={{ opacity: i <= stepIndex ? 1 : 0.25, x:0 }}
            transition={{ delay:i*0.3, duration:0.5 }}
            className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500"
              style={{ background: i < stepIndex ? '#B8903C' : i === stepIndex ? 'rgba(184,144,60,0.2)' : 'rgba(28,25,23,0.06)', border:`1px solid ${i <= stepIndex ? '#B8903C' : 'rgba(28,25,23,0.1)'}` }}>
              {i < stepIndex
                ? <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                : i === stepIndex
                  ? <span className="w-1.5 h-1.5 rounded-full" style={{ background:'#B8903C' }} />
                  : null
              }
            </div>
            <span className="font-body text-sm" style={{ color: i <= stepIndex ? 'rgba(28,25,23,0.75)' : 'rgba(28,25,23,0.25)' }}>{step}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function RoomAnalyzer() {
  const { isAr } = useLang()
  const [file, setFile]         = useState(null)
  const [preview, setPreview]   = useState(null)
  const [status, setStatus]     = useState('idle')   // idle | analyzing | result | error
  const [stepIndex, setStepIndex] = useState(0)
  const [analysis, setAnalysis] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')
  const stepTimer = useRef(null)

  const handleFile = useCallback((f) => {
    setFile(f)
    setPreview(URL.createObjectURL(f))
    setStatus('idle')
    setAnalysis(null)
  }, [])

  const handleAnalyze = useCallback(async () => {
    if (!file) return
    setStatus('analyzing')
    setStepIndex(0)
    setErrorMsg('')

    // Advance loading steps every 3.5s
    let step = 0
    stepTimer.current = setInterval(() => {
      step++
      if (step < STEPS_EN.length) setStepIndex(step)
      else clearInterval(stepTimer.current)
    }, 3500)

    try {
      const result = await analyzeRoomImage(file, isAr ? 'ar' : 'en')
      clearInterval(stepTimer.current)
      setAnalysis(result)
      setStatus('result')
      window.scrollTo({ top: 400, behavior: 'smooth' })
    } catch (err) {
      clearInterval(stepTimer.current)
      setErrorMsg(err.message || 'Analysis failed. Please try again.')
      setStatus('error')
    }
  }, [file, isAr])

  const handleReset = useCallback(() => {
    setFile(null)
    setPreview(null)
    setStatus('idle')
    setAnalysis(null)
    setErrorMsg('')
    setStepIndex(0)
    if (stepTimer.current) clearInterval(stepTimer.current)
  }, [])

  const buildWhatsAppMsg = () => {
    if (!analysis) return ''
    const recs = (analysis.recommendations || []).map((r, i) => `${i+1}. ${r.categoryName} — ${r.finishSuggestion || ''}`).join('\n')
    const msg = isAr
      ? `مرحباً إمداد،\n\nاستخدمت محلل الغرف بالذكاء الاصطناعي وحصلت على التوصيات التالية:\n\n🏠 نوع الغرفة: ${analysis.roomType}\n✨ النمط: ${analysis.style}\n\nالمجموعات الموصى بها:\n${recs}\n\nملاحظة المصمم: ${analysis.designerNote}\n\nهل يمكنكم مساعدتي في استكشاف هذه الخيارات؟`
      : `Hello EMDAD,\n\nI used your AI Room Analyzer and received these recommendations:\n\n🏠 Room Type: ${analysis.roomType}\n✨ Style: ${analysis.style}\n💡 Light: ${analysis.lightLevel}\n\nRecommended collections:\n${recs}\n\nDesigner's note: ${analysis.designerNote}\n\nCould you help me explore these options?`
    return `https://wa.me/962779989944?text=${encodeURIComponent(msg)}`
  }

  return (
    <div className="min-h-screen" style={{ background:'#FAF7F2' }} dir={isAr?'rtl':'ltr'}>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <div className="relative pt-24 pb-16 overflow-hidden" style={{ background:'#0D0B09' }}>
        <img src="/images/master-bedrooms/BED19.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" style={{ filter:'brightness(0.15) saturate(0.4)' }} />
        <div className="absolute inset-0" style={{ background:'linear-gradient(to bottom, rgba(13,11,9,0.4), rgba(13,11,9,0.97))' }} />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.8 }}>
            {/* AI badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 mb-6" style={{ border:'1px solid rgba(184,144,60,0.35)', background:'rgba(184,144,60,0.08)' }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background:'#B8903C' }} />
              <span className="font-body text-xs tracking-[0.3em] uppercase" style={{ color:'#D4AC5A' }}>
                {isAr ? 'محلل الغرف بالذكاء الاصطناعي' : 'AI Room Analyzer — Powered by Claude Vision'}
              </span>
            </div>

            <h1 className="font-display font-300 text-white leading-tight mb-4" style={{ fontSize:'clamp(2.4rem,6vw,4.5rem)' }}>
              {isAr ? 'صوّر غرفتك.' : 'Photograph your room.'}<br />
              <em className="not-italic" style={{ color:'#D4AC5A' }}>
                {isAr ? 'احصل على توصيات أثاث مخصصة.' : 'Get personalized furniture recommendations.'}
              </em>
            </h1>
            <p className="font-body text-sm leading-loose text-white/50 max-w-xl mx-auto">
              {isAr
                ? 'يحلل الذكاء الاصطناعي نمط غرفتك ومساحتها وألوانها ويوصي بقطع إمداد المثالية لتحويلها — قبل أن تشتري أي شيء.'
                : 'Our AI reads your room\'s style, scale, colors, and layout — then recommends the perfect EMDAD pieces to complete it, before you commit to anything.'}
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── Main content ──────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <AnimatePresence mode="wait">

          {/* IDLE + file preview */}
          {(status === 'idle' || status === 'error') && (
            <motion.div key="upload" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }} transition={{ duration:0.4 }}>
              {!preview ? (
                <UploadZone onFile={handleFile} isAr={isAr} />
              ) : (
                /* Preview mode */
                <div className="grid sm:grid-cols-2 gap-8 items-center">
                  {/* Preview image */}
                  <div className="relative overflow-hidden" style={{ aspectRatio:'4/3', background:'#1C1917' }}>
                    <img src={preview} alt="Room preview" className="w-full h-full object-cover" />
                    <button onClick={handleReset}
                      className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center transition-all hover:scale-110"
                      style={{ background:'rgba(13,11,9,0.8)', border:'1px solid rgba(184,144,60,0.3)' }}
                      aria-label="Remove image">
                      <svg className="w-4 h-4 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>

                  {/* CTA */}
                  <div>
                    <p className="font-body text-[9px] tracking-[0.3em] uppercase mb-3" style={{ color:'#B8903C' }}>{isAr?'صورتك جاهزة':'Your photo is ready'}</p>
                    <h3 className="font-display text-3xl font-300 text-onyx mb-3">{isAr?'ابدأ التحليل':'Start the analysis'}</h3>
                    <p className="font-body text-sm text-charcoal/55 leading-loose mb-8">
                      {isAr
                        ? 'سيقرأ الذكاء الاصطناعي نمطك وألوانك ومساحاتك ويوصي بمجموعات إمداد المثالية في ~20 ثانية.'
                        : 'Our AI will read your style, colors, and space — then recommend the perfect EMDAD collections in ~20 seconds.'}
                    </p>
                    {status === 'error' && (
                      <div className="mb-5 p-4 font-body text-sm text-red-700" style={{ background:'rgba(220,38,38,0.06)', border:'1px solid rgba(220,38,38,0.2)' }}>
                        {errorMsg}
                      </div>
                    )}
                    <div className="flex gap-3 flex-wrap">
                      <button onClick={handleAnalyze} className="btn-gold">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                        {isAr ? 'حلّل غرفتي' : 'Analyze My Room'}
                      </button>
                      <button onClick={handleReset} className="btn-dark">{isAr?'استبدال الصورة':'Change Photo'}</button>
                    </div>
                    <p className="font-body text-[10px] text-charcoal/30 mt-4">
                      {isAr ? '🔒 صورتك لا تُخزَّن — تُعالَج لحظياً فقط' : '🔒 Your photo is not stored — processed in real time only'}
                    </p>
                  </div>
                </div>
              )}

              {/* How it works */}
              {!preview && (
                <div className="grid grid-cols-3 gap-4 mt-10">
                  {[
                    { icon:'📸', en:'Upload any room photo', ar:'ارفع أي صورة لغرفتك' },
                    { icon:'🧠', en:'AI reads style, colors & space', ar:'الذكاء الاصطناعي يقرأ النمط والألوان' },
                    { icon:'🛋️', en:'Get matched EMDAD collections', ar:'احصل على مجموعات إمداد المطابقة' },
                  ].map(s => (
                    <div key={s.en} className="text-center p-5" style={{ border:'1px solid rgba(184,144,60,0.1)', background:'white' }}>
                      <span className="text-3xl block mb-3">{s.icon}</span>
                      <p className="font-body text-xs text-charcoal/60 leading-relaxed">{isAr?s.ar:s.en}</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ANALYZING */}
          {status === 'analyzing' && (
            <motion.div key="loading" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.3 }}>
              <LoadingView stepIndex={stepIndex} isAr={isAr} />
            </motion.div>
          )}

          {/* RESULTS */}
          {status === 'result' && analysis && (
            <motion.div key="result" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}>

              {/* Analysis summary card */}
              <div className="grid sm:grid-cols-2 gap-6 mb-10">
                {/* Preview + room basics */}
                <div className="overflow-hidden" style={{ background:'white', border:'1px solid rgba(184,144,60,0.12)' }}>
                  <div className="relative" style={{ height:180 }}>
                    <img src={preview} alt="Your room" className="w-full h-full object-cover" />
                    <div className="absolute inset-0" style={{ background:'linear-gradient(to bottom, transparent 50%, rgba(13,11,9,0.8))' }} />
                    <div className="absolute bottom-3 left-4">
                      <p className="font-display text-lg font-400 text-white">{analysis.roomType}</p>
                      <p className="font-body text-xs text-yellow-400">{analysis.style}</p>
                    </div>
                  </div>
                  <div className="p-4 grid grid-cols-2 gap-3">
                    {[
                      { lbl: isAr?'الضوء الطبيعي':'Natural Light',     val: isAr ? {High:'عالٍ',Medium:'متوسط',Low:'منخفض'}[analysis.lightLevel] || analysis.lightLevel : analysis.lightLevel },
                      { lbl: isAr?'حجم الغرفة':'Room Scale',            val: isAr ? {Spacious:'واسعة',Standard:'متوسطة',Compact:'صغيرة'}[analysis.roomSize] || analysis.roomSize : analysis.roomSize },
                    ].map(row => (
                      <div key={row.lbl} className="px-3 py-2" style={{ background:'rgba(184,144,60,0.05)' }}>
                        <p className="font-body text-[9px] tracking-widest uppercase text-charcoal/35 mb-0.5">{row.lbl}</p>
                        <p className="font-body text-sm font-500 text-onyx">{row.val}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Color palette + observations */}
                <div className="p-5 space-y-5" style={{ background:'white', border:'1px solid rgba(184,144,60,0.12)' }}>
                  <div>
                    <p className="font-body text-[9px] tracking-[0.3em] uppercase mb-3" style={{ color:'#B8903C' }}>{isAr?'لوحة الألوان المكتشفة':'Detected Color Palette'}</p>
                    <ColorRow palette={analysis.colorPalette} names={analysis.colorNames} />
                  </div>
                  {analysis.opportunities?.length > 0 && (
                    <div>
                      <p className="font-body text-[9px] tracking-[0.3em] uppercase mb-3" style={{ color:'#B8903C' }}>{isAr?'فرص التحسين':'Design Opportunities'}</p>
                      <div className="space-y-1.5">
                        {analysis.opportunities.slice(0,4).map((opp, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <span className="mt-1 w-1 h-1 rounded-full flex-shrink-0" style={{ background:'#B8903C' }} />
                            <p className="font-body text-xs text-charcoal/65 leading-relaxed">{opp}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Designer's note */}
              {analysis.designerNote && (
                <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
                  className="mb-10 p-6" style={{ background:'rgba(184,144,60,0.04)', border:'1px solid rgba(184,144,60,0.18)', borderLeft: isAr?undefined:'3px solid #B8903C', borderRight: isAr?'3px solid #B8903C':undefined }}>
                  <p className="font-body text-[9px] tracking-[0.3em] uppercase mb-3" style={{ color:'#B8903C' }}>{isAr?'ملاحظة المصمم':'Designer\'s Note'}</p>
                  <p className="font-display text-lg font-400 italic text-charcoal/80 leading-relaxed">"{analysis.designerNote}"</p>
                </motion.div>
              )}

              {/* Recommendations */}
              {(analysis.recommendations || []).length > 0 ? (
                <div className="mb-4">
                  <p className="font-body text-[9px] tracking-[0.3em] uppercase mb-6" style={{ color:'#B8903C' }}>
                    {isAr?`${analysis.recommendations.length} مجموعة موصى بها لغرفتك`:`${analysis.recommendations.length} EMDAD collections recommended for your room`}
                  </p>
                  <div className="space-y-4">
                    {analysis.recommendations.map((rec, i) => (
                      <RecommendationCard key={rec.categoryId} rec={rec} index={i} isAr={isAr} />
                    ))}
                  </div>
                </div>
              ) : (
                /* Graceful fallback when the AI couldn't detect a room */
                <div className="mb-4 p-8 text-center" style={{ background:'white', border:'1px solid rgba(184,144,60,0.18)' }}>
                  <span className="text-4xl block mb-3">🛋️</span>
                  <h3 className="font-display text-xl font-400 text-onyx mb-2">
                    {isAr ? 'لم نتمكن من تحديد غرفة في هذه الصورة' : "We couldn't detect a room in this photo"}
                  </h3>
                  <p className="font-body text-sm text-charcoal/60 mb-6 max-w-md mx-auto leading-relaxed">
                    {analysis.designerNote || (isAr
                      ? 'جرّب رفع صورة أوضح وأوسع تُظهر الغرفة كاملة بإضاءة جيدة لنوصي لك بأنسب قطع إمداد.'
                      : 'Try a clearer, wider photo that shows the whole room in good light, so we can match the best EMDAD pieces for your space.')}
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    <button onClick={handleReset} className="btn-gold">{isAr ? 'جرّب صورة أخرى' : 'Try another photo'}</button>
                    <Link to="/collections" className="btn-dark">{isAr ? 'تصفّح كل المجموعات' : 'Browse all collections'}</Link>
                  </div>
                </div>
              )}

              {/* Action CTAs */}
              <div className="mt-10 p-8 text-center" style={{ background:'#0D0B09', border:'1px solid rgba(184,144,60,0.15)' }}>
                <p className="font-body text-[9px] tracking-[0.3em] uppercase mb-3 text-yellow-500">{isAr?'الخطوة التالية':'Ready to proceed?'}</p>
                <h3 className="font-display text-2xl font-300 text-white mb-2">
                  {isAr?'شارك تحليلك مع فريق إمداد':'Share your analysis with our design team'}
                </h3>
                <p className="font-body text-sm text-white/40 mb-8">
                  {isAr?'سيتواصل معك مصمم متخصص لمناقشة توصياتك وتقديم عرض مخصص.':'A dedicated designer will contact you to discuss your recommendations and prepare a tailored proposal.'}
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <a href={buildWhatsAppMsg()} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-8 py-4 text-white font-body text-sm tracking-widest uppercase transition-all hover:-translate-y-1"
                    style={{ background:'#25D366' }}>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    {isAr ? 'إرسال التحليل عبر واتساب' : 'Send Analysis via WhatsApp'}
                  </a>
                  <Link to="/appointment" className="btn-gold">{isAr?'احجز استشارة':'Book Consultation'}</Link>
                  <button onClick={handleReset} className="btn-dark">{isAr?'تحليل غرفة أخرى':'Analyze Another Room'}</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
