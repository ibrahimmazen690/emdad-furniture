import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useLang } from '../context/LanguageContext'
import { useWishlist } from '../hooks/useWishlist'

// Available finishes shown for every piece. Selecting one is informational only
// (it does NOT recolor the photo) and is passed along with the inquiry so the
// EMDAD team knows which finish the customer is interested in.
const FINISHES = [
  { en: 'Natural Oak',     ar: 'بلوط طبيعي',   hex: '#C8A96E' },
  { en: 'Walnut',          ar: 'جوز',           hex: '#5A3A22' },
  { en: 'Espresso',        ar: 'إسبريسو',       hex: '#3B2C24' },
  { en: 'Matte White',     ar: 'أبيض مطفي',     hex: '#EFE9DD' },
  { en: 'Charcoal',        ar: 'فحمي',          hex: '#2C2C2A' },
  { en: 'Champagne Gold',  ar: 'ذهبي شامبين',   hex: '#D4AC5A' },
]

export default function ImageModal({ image, onClose, onPrev, onNext, total, category }) {
  const { isAr } = useLang()
  const { toggle, isSaved } = useWishlist()
  const [finish, setFinish] = useState(null)
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' })
  const [showForm, setShowForm] = useState(false)
  const [sending, setSending] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const productTitle = image.title || image.alt || (isAr ? 'قطعة إمداد' : 'EMDAD Piece')

  // Reset the form/finish whenever the viewed product changes.
  useEffect(() => {
    setFinish(null); setSubmitted(false); setError(''); setShowForm(false)
    setForm({ name: '', phone: '', email: '', message: '' })
  }, [image.src])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey) }
  }, [onClose, onPrev, onNext])

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

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
          productTitle, productImage: image.src, category, finish: finish?.en || '',
        }),
      })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        throw new Error(d.error || 'Submission failed')
      }
      setSubmitted(true)
    } catch (err) {
      setError(isAr ? 'تعذّر الإرسال. حاول مرة أخرى.' : 'Could not send. Please try again.')
    } finally {
      setSending(false)
    }
  }

  const inputStyle = { border: '1px solid rgba(184,144,60,0.25)', background: 'rgba(255,255,255,0.03)' }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'rgba(13,11,9,0.97)', backdropFilter: 'blur(10px)' }}
      onClick={onClose} dir={isAr ? 'rtl' : 'ltr'}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative w-full max-w-5xl flex flex-col lg:flex-row overflow-hidden"
        style={{ maxHeight: '88vh', background: '#1C1917', border: '1px solid rgba(184,144,60,0.25)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Image pane ──────────────────────────────────────── */}
        <div className="lg:w-1/2 flex-shrink-0 relative" style={{ background: '#0D0B09' }}>
          <img src={image.src} alt={image.alt}
            className="w-full h-56 sm:h-72 lg:h-full object-cover" />
          <div className="absolute bottom-0 left-0 right-0 px-5 py-3 lg:hidden"
            style={{ background: 'linear-gradient(to top, rgba(13,11,9,0.9), transparent)' }}>
            <p className="font-display text-lg text-white">{productTitle}</p>
          </div>
        </div>

        {/* ── Details + inquiry pane ──────────────────────────── */}
        <div className="lg:w-1/2 flex-1 min-h-0 flex flex-col overflow-y-auto p-6 sm:p-8">
          <p className="font-body text-[10px] tracking-[0.3em] uppercase text-yellow-500 mb-1">{category}</p>
          <h2 className="font-display text-2xl sm:text-3xl font-300 text-white leading-tight">{productTitle}</h2>
          <div className="gold-divider-left my-4" />

          {submitted ? (
            /* ── Success state ─────────────────────────────── */
            <div className="flex flex-col items-start py-6">
              <div className="w-14 h-14 flex items-center justify-center mb-4"
                style={{ background: 'linear-gradient(135deg,#B8903C,#D4AC5A)' }}>
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-display text-xl text-white mb-2">{isAr ? 'تم إرسال طلبك' : 'Inquiry sent'}</h3>
              <p className="font-body text-sm text-white/50 leading-relaxed mb-6">
                {isAr
                  ? 'شكراً لك. سيتواصل معك فريق إمداد قريباً بخصوص هذه القطعة.'
                  : 'Thank you. The EMDAD team will contact you shortly about this piece.'}
              </p>
              <button onClick={onClose} className="btn-gold text-xs py-3 px-6">
                {isAr ? 'متابعة التصفح' : 'Continue browsing'}
              </button>
            </div>
          ) : (
            <>
              {/* Available finishes (informational — does not recolor the photo) */}
              <p className="font-body text-[10px] tracking-[0.25em] uppercase text-white/40 mb-3">
                {isAr ? 'التشطيبات المتوفرة' : 'Available Finishes'}
              </p>
              <div className="flex flex-wrap gap-2.5 mb-2">
                {FINISHES.map(f => {
                  const active = finish?.en === f.en
                  return (
                    <button key={f.en} type="button" onClick={() => setFinish(active ? null : f)}
                      title={isAr ? f.ar : f.en} aria-label={isAr ? f.ar : f.en}
                      className="w-8 h-8 rounded-full transition-all duration-200"
                      style={{
                        background: f.hex,
                        outline: active ? '2px solid #D4AC5A' : '1px solid rgba(255,255,255,0.2)',
                        outlineOffset: active ? '2px' : '0',
                        transform: active ? 'scale(1.1)' : 'scale(1)',
                      }} />
                  )
                })}
              </div>
              <p className="font-body text-xs text-white/45 mb-1 h-4">
                {finish ? (isAr ? finish.ar : finish.en) : (isAr ? 'اختر تشطيباً (اختياري)' : 'Select a finish (optional)')}
              </p>
              <p className="font-body text-[11px] text-white/30 leading-relaxed mb-5">
                {isAr ? 'أحجام ومواد مخصصة متوفرة عند الطلب.' : 'Custom sizes & materials available on request.'}
              </p>

              {/* Wishlist */}
              <button type="button" onClick={() => toggle(image)}
                className="flex items-center gap-2 mb-6 font-body text-xs tracking-wide uppercase transition-colors"
                style={{ color: isSaved(image.src) ? '#D4AC5A' : 'rgba(255,255,255,0.5)' }}>
                <svg className="w-4 h-4" fill={isSaved(image.src) ? '#D4AC5A' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {isSaved(image.src) ? (isAr ? 'محفوظ في المفضلة' : 'Saved to wishlist') : (isAr ? 'أضف إلى المفضلة' : 'Add to wishlist')}
              </button>

              {/* Request this piece → reveals the inquiry form */}
              <div className="gold-divider-left mb-4" />
              {!showForm ? (
                <>
                  <button type="button" onClick={() => setShowForm(true)}
                    className="btn-gold w-full justify-center text-sm py-4">
                    {isAr ? 'اطلب هذه القطعة' : 'Request this piece'} →
                  </button>
                  <p className="font-body text-[10px] text-white/30 text-center mt-2">
                    {isAr
                      ? 'لا يلزم الدفع — أدخل بياناتك وسيتواصل معك فريقنا.'
                      : 'No payment — enter your details and our team will contact you.'}
                  </p>
                </>
              ) : (
                <>
                  <p className="font-body text-[10px] tracking-[0.25em] uppercase text-yellow-500/80 mb-3">
                    {isAr ? 'أدخل بياناتك' : 'Your details'}
                  </p>
                  <form onSubmit={submit} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <input name="name" value={form.name} onChange={handleChange} required autoFocus
                        placeholder={isAr ? 'الاسم *' : 'Name *'}
                        className="px-3 py-2.5 font-body text-sm text-white bg-transparent outline-none placeholder:text-white/30" style={inputStyle} />
                      <input name="phone" type="tel" value={form.phone} onChange={handleChange} required
                        placeholder={isAr ? 'رقم الهاتف *' : 'Phone *'}
                        className="px-3 py-2.5 font-body text-sm text-white bg-transparent outline-none placeholder:text-white/30" style={inputStyle} />
                    </div>
                    <input name="email" type="email" value={form.email} onChange={handleChange}
                      placeholder={isAr ? 'البريد الإلكتروني (اختياري)' : 'Email (optional)'}
                      className="w-full px-3 py-2.5 font-body text-sm text-white bg-transparent outline-none placeholder:text-white/30" style={inputStyle} />
                    <textarea name="message" value={form.message} onChange={handleChange} rows={3}
                      placeholder={isAr ? 'رسالتك (مثل: المقاسات، الكمية، أي تفاصيل)' : 'Your message (e.g. sizes, quantity, any details)'}
                      className="w-full px-3 py-2.5 font-body text-sm text-white bg-transparent outline-none resize-none placeholder:text-white/30" style={inputStyle} />
                    {error && <p className="font-body text-xs text-red-400">{error}</p>}
                    <button type="submit" disabled={sending} className="btn-gold w-full justify-center text-xs py-3.5">
                      {sending ? (isAr ? 'جارٍ الإرسال…' : 'Sending…') : (isAr ? 'إرسال إلى إمداد' : 'Send to EMDAD')}
                    </button>
                    <button type="button" onClick={() => setShowForm(false)}
                      className="w-full font-body text-[11px] text-white/40 hover:text-white/70 transition-colors">
                      {isAr ? '← رجوع' : '← Back'}
                    </button>
                  </form>
                </>
              )}
            </>
          )}
        </div>

        {/* Counter */}
        <div className="absolute top-3 left-4 font-body text-[11px] text-white/30 tracking-widest pointer-events-none">
          {String((image.index ?? 0) + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </div>
      </motion.div>

      {/* Prev / Next */}
      {[
        { action: onPrev, side: 'left', icon: 'M15 19l-7-7 7-7', label: 'Previous' },
        { action: onNext, side: 'right', icon: 'M9 5l7 7-7 7', label: 'Next' },
      ].map(({ action, side, icon, label }) => (
        <button key={side} onClick={(e) => { e.stopPropagation(); action() }}
          className="hidden sm:flex absolute top-1/2 -translate-y-1/2 w-11 h-11 items-center justify-center transition-all duration-300 hover:scale-110"
          style={{ [side]: '16px', background: 'rgba(184,144,60,0.15)', border: '1px solid rgba(184,144,60,0.4)', backdropFilter: 'blur(8px)' }}
          aria-label={label}>
          <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
          </svg>
        </button>
      ))}

      {/* Close */}
      <button onClick={onClose}
        className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center transition-all duration-300 hover:bg-yellow-500/20"
        style={{ border: '1px solid rgba(184,144,60,0.4)', background: 'rgba(13,11,9,0.6)' }} aria-label="Close">
        <svg className="w-5 h-5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </motion.div>
  )
}
