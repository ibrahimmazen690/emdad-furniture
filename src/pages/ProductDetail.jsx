import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useLang } from '../context/LanguageContext'
import { useWishlist } from '../hooks/useWishlist'
import { categories } from '../data/categories'

// Available finishes (informational — passed along with the inquiry so the team
// knows which colour the customer likes; it does not recolour the photo).
const FINISHES = [
  { en: 'Natural Oak',    ar: 'بلوط طبيعي',  hex: '#C8A96E' },
  { en: 'Walnut',         ar: 'جوز',          hex: '#5A3A22' },
  { en: 'Espresso',       ar: 'إسبريسو',      hex: '#3B2C24' },
  { en: 'Matte White',    ar: 'أبيض مطفي',    hex: '#EFE9DD' },
  { en: 'Charcoal',       ar: 'فحمي',         hex: '#2C2C2A' },
  { en: 'Champagne Gold', ar: 'ذهبي شامبين',  hex: '#D4AC5A' },
]

// Simulated "detail" framings of the SAME photo (we only have one real shot per
// piece). Each view crops into a different region so it reads like a set of
// close-up detail shots; hover-zoom then magnifies wherever the cursor points.
const VIEWS = [
  { en: 'Full view', ar: 'عرض كامل', scale: 1,    ox: 50, oy: 50 },
  { en: 'Detail',    ar: 'تفصيل',    scale: 1.7,  ox: 30, oy: 38 },
  { en: 'Detail',    ar: 'تفصيل',    scale: 1.7,  ox: 70, oy: 60 },
  { en: 'Detail',    ar: 'تفصيل',    scale: 2.1,  ox: 50, oy: 30 },
]

export default function ProductDetail() {
  const { isAr, t } = useLang()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const src = params.get('src') || ''
  const { toggle, isSaved } = useWishlist()

  // Resolve the piece by its unique src (robust to gallery filtering / folders).
  const { category, index, image } = useMemo(() => {
    for (const c of categories) {
      const i = c.images.findIndex((im) => im.src === src)
      if (i !== -1) return { category: c, index: i, image: c.images[i] }
    }
    return { category: null, index: -1, image: null }
  }, [src])

  // ── Image viewer state ──────────────────────────────────────────────────────
  const [view, setView] = useState(0)
  const [zoom, setZoom] = useState({ active: false, x: 50, y: 50 })
  const stageRef = useRef(null)

  // ── Inquiry form state ──────────────────────────────────────────────────────
  const [finish, setFinish] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' })
  const [sending, setSending] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const catTitle = category ? (isAr ? (t.catNames[category.id] || category.title) : category.title) : ''
  const productTitle = image?.title || image?.alt || (isAr ? 'قطعة إمداد' : 'EMDAD Piece')
  // Touch screens can't hover — we drive the zoom with pointer events so a finger
  // drag works just like a mouse hover.
  const canHover = typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches

  // Reset everything when the viewed piece changes; scroll to top.
  useEffect(() => {
    setView(0); setZoom({ active: false, x: 50, y: 50 })
    setFinish(null); setShowForm(false); setSubmitted(false); setError('')
    setForm({ name: '', phone: '', email: '', message: '' })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [src])

  const goTo = useCallback((i) => {
    if (!category) return
    const next = (i + category.images.length) % category.images.length
    navigate(`/product?src=${encodeURIComponent(category.images[next].src)}`)
  }, [category, navigate])

  // Keyboard prev/next
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') goTo(index - 1)
      if (e.key === 'ArrowRight') goTo(index + 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goTo, index])

  const onMove = useCallback((e) => {
    const el = stageRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width) * 100
    const y = ((e.clientY - r.top) / r.height) * 100
    setZoom({ active: true, x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) })
  }, [])
  const onLeave = useCallback(() => setZoom((z) => ({ ...z, active: false })), [])

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim()) {
      setError(isAr ? 'الاسم ورقم الهاتف مطلوبان.' : 'Name and phone are required.')
      return
    }
    setSending(true); setError('')
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name, phone: form.phone, email: form.email, message: form.message,
          productTitle, productImage: image.src, category: catTitle, finish: finish?.en || '',
        }),
      })
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || 'failed') }
      setSubmitted(true)
    } catch {
      setError(isAr ? 'تعذّر الإرسال. حاول مرة أخرى.' : 'Could not send. Please try again.')
    } finally {
      setSending(false)
    }
  }

  // ── Not found ───────────────────────────────────────────────────────────────
  if (!image) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6" style={{ background: '#FAF7F2' }} dir={isAr ? 'rtl' : 'ltr'}>
        <p className="font-display text-2xl text-onyx mb-3">{isAr ? 'لم يتم العثور على القطعة' : 'Piece not found'}</p>
        <Link to="/collections" className="btn-gold">{isAr ? 'تصفّح المجموعات' : 'Browse collections'}</Link>
      </div>
    )
  }

  const activeView = VIEWS[view]
  const baseScale = activeView.scale
  const scale = zoom.active ? Math.max(baseScale, 2.4) : baseScale
  const origin = zoom.active ? `${zoom.x}% ${zoom.y}%` : `${activeView.ox}% ${activeView.oy}%`
  const inputStyle = { border: '1px solid rgba(184,144,60,0.25)', background: 'rgba(255,255,255,0.03)' }

  return (
    <div className="min-h-screen" style={{ background: '#FAF7F2' }} dir={isAr ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-28 pb-20">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 font-body text-xs text-charcoal/50 mb-6">
          <Link to="/collections" className="hover:text-yellow-700 transition-colors">{isAr ? 'المجموعات' : 'Collections'}</Link>
          <span>/</span>
          <Link to={`/collections?cat=${category.id}`} className="hover:text-yellow-700 transition-colors">{catTitle}</Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* ── Image column ─────────────────────────────────────────────── */}
          <div>
            <div
              ref={stageRef}
              onPointerMove={onMove}
              onPointerLeave={onLeave}
              onPointerCancel={onLeave}
              onPointerDown={(e) => { if (e.pointerType !== 'mouse') onMove(e) }}
              onPointerUp={(e) => { if (e.pointerType !== 'mouse') onLeave() }}
              className="relative overflow-hidden cursor-zoom-in select-none"
              style={{ aspectRatio: '4/3', background: '#1C1917', border: '1px solid rgba(184,144,60,0.18)', touchAction: 'none' }}
            >
              <img
                src={image.src} alt={image.alt} draggable={false}
                className="absolute inset-0 w-full h-full object-cover"
                style={{ transform: `scale(${scale})`, transformOrigin: origin, transition: zoom.active ? 'transform 0.08s ease-out' : 'transform 0.35s ease' }}
              />
              {/* Hover-to-zoom hint */}
              <div className="absolute bottom-3 left-3 px-3 py-1.5 font-body text-[10px] tracking-widest uppercase pointer-events-none transition-opacity duration-300"
                style={{ background: 'rgba(13,11,9,0.6)', backdropFilter: 'blur(6px)', color: '#D4AC5A', opacity: zoom.active ? 0 : 1 }}>
                {canHover ? (isAr ? 'مرّر للتكبير' : 'Hover to zoom') : (isAr ? 'المس واسحب للتكبير' : 'Touch & drag to zoom')}
              </div>
            </div>

            {/* Detail thumbnails (same photo, different framings) */}
            <div className="flex gap-3 mt-3">
              {VIEWS.map((v, i) => (
                <button key={i} onClick={() => setView(i)}
                  aria-label={isAr ? v.ar : v.en}
                  className="relative overflow-hidden transition-all duration-200"
                  style={{ width: 74, height: 74, border: view === i ? '2px solid #B8903C' : '1px solid rgba(184,144,60,0.25)', opacity: view === i ? 1 : 0.7 }}>
                  <img src={image.src} alt="" draggable={false}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ transform: `scale(${v.scale})`, transformOrigin: `${v.ox}% ${v.oy}%` }} />
                </button>
              ))}
            </div>
          </div>

          {/* ── Details column ───────────────────────────────────────────── */}
          <div>
            <p className="font-body text-[10px] tracking-[0.3em] uppercase text-yellow-600 mb-2">{catTitle}</p>
            <h1 className="font-display text-3xl sm:text-4xl font-300 text-onyx leading-tight mb-3">{productTitle}</h1>
            <div className="gold-divider-left mb-5" />

            <p className="font-body text-sm leading-loose text-charcoal/70 mb-7">
              {category.description}
            </p>

            {/* Colours / finishes */}
            <p className="font-body text-[10px] tracking-[0.25em] uppercase text-charcoal/45 mb-3">
              {isAr ? 'الألوان والتشطيبات المتوفرة' : 'Available colours & finishes'}
            </p>
            <div className="flex flex-wrap gap-2.5 mb-2">
              {FINISHES.map((f) => {
                const active = finish?.en === f.en
                return (
                  <button key={f.en} type="button" onClick={() => setFinish(active ? null : f)}
                    title={isAr ? f.ar : f.en} aria-label={isAr ? f.ar : f.en}
                    className="w-9 h-9 rounded-full transition-all duration-200"
                    style={{ background: f.hex, outline: active ? '2px solid #B8903C' : '1px solid rgba(0,0,0,0.12)', outlineOffset: active ? '2px' : '0', transform: active ? 'scale(1.12)' : 'scale(1)' }} />
                )
              })}
            </div>
            <p className="font-body text-xs text-charcoal/55 mb-1 h-4">
              {finish ? (isAr ? finish.ar : finish.en) : (isAr ? 'اختر لوناً (اختياري)' : 'Select a colour (optional)')}
            </p>
            <p className="font-body text-[11px] text-charcoal/40 leading-relaxed mb-6">
              {isAr ? 'أحجام ومواد مخصصة متوفرة عند الطلب — كل قطعة تُصنع حسب الطلب.' : 'Custom sizes & materials available on request — every piece is made to order.'}
            </p>

            {/* Wishlist */}
            <button type="button" onClick={() => toggle(image)}
              className="flex items-center gap-2 mb-6 font-body text-xs tracking-wide uppercase transition-colors"
              style={{ color: isSaved(image.src) ? '#9A6B12' : 'rgba(28,25,23,0.55)' }}>
              <svg className="w-4 h-4" fill={isSaved(image.src) ? '#B8903C' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {isSaved(image.src) ? (isAr ? 'محفوظ في المفضلة' : 'Saved to wishlist') : (isAr ? 'أضف إلى المفضلة' : 'Add to wishlist')}
            </button>

            <div className="gold-divider-left mb-5" />

            {/* Request this piece */}
            {submitted ? (
              <div className="p-6" style={{ background: 'rgba(184,144,60,0.06)', border: '1px solid rgba(184,144,60,0.22)' }}>
                <div className="w-12 h-12 flex items-center justify-center mb-3" style={{ background: 'linear-gradient(135deg,#B8903C,#D4AC5A)' }}>
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="font-display text-xl text-onyx mb-1.5">{isAr ? 'تم إرسال طلبك' : 'Inquiry sent'}</h3>
                <p className="font-body text-sm text-charcoal/60 leading-relaxed mb-5">
                  {isAr ? 'شكراً لك. سيتواصل معك فريق إمداد قريباً بخصوص هذه القطعة.' : 'Thank you. The EMDAD team will contact you shortly about this piece.'}
                </p>
                <Link to={`/collections?cat=${category.id}`} className="btn-gold text-xs py-3 px-6">{isAr ? 'متابعة التصفح' : 'Continue browsing'}</Link>
              </div>
            ) : !showForm ? (
              <>
                <button type="button" onClick={() => setShowForm(true)} className="btn-gold w-full justify-center text-sm py-4">
                  {isAr ? 'اطلب هذه القطعة' : 'Request this piece'} →
                </button>
                <p className="font-body text-[11px] text-charcoal/40 text-center mt-2">
                  {isAr ? 'لا يلزم الدفع — أدخل بياناتك وسيتواصل معك فريقنا.' : 'No payment — enter your details and our team will contact you.'}
                </p>
              </>
            ) : (
              <>
                <p className="font-body text-[10px] tracking-[0.25em] uppercase text-yellow-700 mb-3">{isAr ? 'أدخل بياناتك' : 'Your details'}</p>
                <form onSubmit={submit} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input name="name" value={form.name} onChange={handleChange} required autoFocus placeholder={isAr ? 'الاسم *' : 'Name *'}
                      className="px-3 py-2.5 font-body text-sm text-onyx bg-transparent outline-none placeholder:text-charcoal/35" style={inputStyle} />
                    <input name="phone" type="tel" value={form.phone} onChange={handleChange} required placeholder={isAr ? 'رقم الهاتف *' : 'Phone *'}
                      className="px-3 py-2.5 font-body text-sm text-onyx bg-transparent outline-none placeholder:text-charcoal/35" style={inputStyle} />
                  </div>
                  <input name="email" type="email" value={form.email} onChange={handleChange} placeholder={isAr ? 'البريد الإلكتروني (اختياري)' : 'Email (optional)'}
                    className="w-full px-3 py-2.5 font-body text-sm text-onyx bg-transparent outline-none placeholder:text-charcoal/35" style={inputStyle} />
                  <textarea name="message" value={form.message} onChange={handleChange} rows={3} placeholder={isAr ? 'رسالتك (مثل: المقاسات، الكمية، أي تفاصيل)' : 'Your message (e.g. sizes, quantity, any details)'}
                    className="w-full px-3 py-2.5 font-body text-sm text-onyx bg-transparent outline-none resize-none placeholder:text-charcoal/35" style={inputStyle} />
                  {error && <p className="font-body text-xs text-red-500">{error}</p>}
                  <button type="submit" disabled={sending} className="btn-gold w-full justify-center text-xs py-3.5">
                    {sending ? (isAr ? 'جارٍ الإرسال…' : 'Sending…') : (isAr ? 'إرسال إلى إمداد' : 'Send to EMDAD')}
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} className="w-full font-body text-[11px] text-charcoal/45 hover:text-charcoal/70 transition-colors">
                    {isAr ? '← رجوع' : '← Back'}
                  </button>
                </form>
              </>
            )}

            {/* Prev / next within the collection */}
            <div className="flex items-center justify-between mt-8 pt-5" style={{ borderTop: '1px solid rgba(184,144,60,0.15)' }}>
              <button onClick={() => goTo(index - 1)} className="flex items-center gap-2 font-body text-xs tracking-wide uppercase text-charcoal/60 hover:text-yellow-700 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" /></svg>
                {isAr ? 'السابق' : 'Previous'}
              </button>
              <span className="font-body text-[11px] text-charcoal/40 tracking-widest">{String(index + 1).padStart(2, '0')} / {String(category.images.length).padStart(2, '0')}</span>
              <button onClick={() => goTo(index + 1)} className="flex items-center gap-2 font-body text-xs tracking-wide uppercase text-charcoal/60 hover:text-yellow-700 transition-colors">
                {isAr ? 'التالي' : 'Next'}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
        </div>

        {/* ── More from this collection ──────────────────────────────────── */}
        <div className="mt-16">
          <p className="font-body text-[10px] tracking-[0.3em] uppercase text-yellow-600 mb-5">{isAr ? 'المزيد من هذه المجموعة' : 'More from this collection'}</p>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {category.images.filter((_, i) => i !== index).slice(0, 6).map((im) => (
              <Link key={im.src} to={`/product?src=${encodeURIComponent(im.src)}`}
                className="relative overflow-hidden group" style={{ aspectRatio: '1', border: '1px solid rgba(184,144,60,0.15)' }}>
                <img src={im.src} alt={im.alt} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" style={{ filter: 'brightness(0.9)' }} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
