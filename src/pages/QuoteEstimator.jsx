import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '../context/LanguageContext'

const PROJECT_TYPES = [
  { id:'residential', icon:'🏠', enLabel:'Residential',          arLabel:'سكني',          enDesc:'Villa, apartment, or home',          arDesc:'فيلا أو شقة أو منزل' },
  { id:'commercial',  icon:'🏢', enLabel:'Commercial',            arLabel:'تجاري',          enDesc:'Office, retail, or hospitality',       arDesc:'مكتب أو تجزئة أو ضيافة' },
  { id:'exhibition',  icon:'🎪', enLabel:'Exhibition / Event',    arLabel:'معرض / فعالية', enDesc:'Booth construction & events',           arDesc:'بناء أجنحة وفعاليات' },
  { id:'government',  icon:'🏛️', enLabel:'Government / Institutional', arLabel:'حكومي / مؤسسي', enDesc:'Institutional & military', arDesc:'مؤسسي وعسكري' },
]
const ROOMS = [
  { id:'master', enLabel:'Master Bedroom', arLabel:'غرفة نوم رئيسية' },
  { id:'single', enLabel:'Single Bedroom', arLabel:'غرفة نوم مفردة' },
  { id:'living', enLabel:'Living Room',    arLabel:'غرفة معيشة' },
  { id:'kitchen',enLabel:'Kitchen',        arLabel:'مطبخ' },
  { id:'dining', enLabel:'Dining Area',    arLabel:'منطقة طعام' },
  { id:'office', enLabel:'Office',         arLabel:'مكتب' },
  { id:'outdoor',enLabel:'Outdoor Space',  arLabel:'مساحة خارجية' },
  { id:'dressing',enLabel:'Dressing Room', arLabel:'غرفة الملابس' },
]
const TIERS = [
  { id:'standard', enLabel:'Standard', arLabel:'قياسي', enDesc:'Quality wood & materials',                    arDesc:'خشب ومواد عالية الجودة',              stars:'★' },
  { id:'premium',  enLabel:'Premium',  arLabel:'بريميوم',enDesc:'Imported materials & advanced finishes',   arDesc:'مواد مستوردة وتشطيبات متقدمة',        stars:'★★' },
  { id:'luxury',   enLabel:'Luxury',   arLabel:'فاخر',   enDesc:'Top-grade materials & bespoke design',     arDesc:'أعلى درجات المواد والتصميم المخصص',   stars:'★★★' },
]

export default function QuoteEstimator() {
  const { t, isAr } = useLang()
  const [step, setStep] = useState(1)
  const [project, setProject] = useState(null)
  const [rooms, setRooms] = useState([])
  const [tier, setTier] = useState(null)
  const [form, setForm] = useState({ name:'', phone:'', email:'', notes:'' })
  const [sending, setSending] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const toggleRoom = (id) => setRooms(r => r.includes(id) ? r.filter(x=>x!==id) : [...r, id])
  const handleFormChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }))
  const resetAll = () => { setStep(1); setProject(null); setRooms([]); setTier(null); setForm({ name:'', phone:'', email:'', notes:'' }); setSubmitted(false); setError('') }

  const slideVariants = {
    initial: { opacity:0, x: isAr ? -40 : 40 },
    animate: { opacity:1, x:0 },
    exit:    { opacity:0, x: isAr ? 40 : -40 },
  }

  const selectedProject = PROJECT_TYPES.find(p=>p.id===project)
  const selectedRooms   = ROOMS.filter(r=>rooms.includes(r.id))
  const selectedTier    = TIERS.find(ti=>ti.id===tier)

  const handleWhatsApp = () => {
    const projLabel = selectedProject ? (isAr ? selectedProject.arLabel : selectedProject.enLabel) : ''
    const roomList  = selectedRooms.map(r => isAr ? r.arLabel : r.enLabel).join(', ')
    const tierLabel = selectedTier ? (isAr ? selectedTier.arLabel : selectedTier.enLabel) : ''
    const msg = isAr
      ? `مرحباً إمداد،\nأود الحصول على عرض سعر لمشروع:\n- النوع: ${projLabel}\n- الغرف: ${roomList}\n- جودة المواد: ${tierLabel}`
      : `Hello EMDAD,\nI'd like a quote for:\n- Project type: ${projLabel}\n- Spaces: ${roomList}\n- Material quality: ${tierLabel}`
    window.open(`https://wa.me/962779989944?text=${encodeURIComponent(msg)}`, '_blank')
  }

  const submitQuote = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim()) {
      setError(isAr ? 'الاسم ورقم الهاتف مطلوبان.' : 'Name and phone are required.')
      return
    }
    setSending(true); setError('')
    try {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name, phone: form.phone, email: form.email, notes: form.notes,
          projectType: selectedProject ? selectedProject.enLabel : '',
          rooms: selectedRooms.map(r => r.enLabel),
          tier: selectedTier ? selectedTier.enLabel : '',
        }),
      })
      if (!res.ok) throw new Error('failed')
      setSubmitted(true)
    } catch {
      setError(isAr ? 'تعذّر الإرسال. حاول مرة أخرى.' : 'Could not send. Please try again.')
    } finally {
      setSending(false)
    }
  }

  const STEPS = 4

  return (
    <div className="min-h-screen pt-24" style={{ background:'#FAF7F2' }} dir={isAr?'rtl':'ltr'}>
      {/* Header */}
      <div className="py-16 text-center" style={{ background:'#0D0B09' }}>
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}>
          <span className="section-eyebrow text-yellow-500">{t.quote.freeLabel}</span>
          <div className="gold-divider" />
          <h1 className="font-display text-4xl md:text-6xl font-300 text-white mt-4">{t.quote.title}</h1>
        </motion.div>
        {/* Progress */}
        <div className="flex items-center justify-center gap-3 mt-10">
          {Array.from({length:STEPS}).map((_,i) => (
            <React.Fragment key={i}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center font-body text-xs font-600 transition-all duration-400"
                style={{ background:step>i+1?'#B8903C':step===i+1?'rgba(184,144,60,0.2)':'rgba(255,255,255,0.05)', border:`1px solid ${step>=i+1?'rgba(184,144,60,0.5)':'rgba(255,255,255,0.1)'}`, color:step>i+1?'white':step===i+1?'#D4AC5A':'rgba(255,255,255,0.3)' }}>
                {step>i+1?'✓':i+1}
              </div>
              {i<STEPS-1 && <div className="w-10 h-px" style={{ background:step>i+1?'#B8903C':'rgba(255,255,255,0.1)' }} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <AnimatePresence mode="wait">
          {/* STEP 1 */}
          {step===1 && (
            <motion.div key="s1" variants={slideVariants} initial="initial" animate="animate" exit="exit" transition={{ duration:0.4 }}>
              <h2 className="font-display text-3xl font-300 text-onyx mb-8 text-center">{t.quote.step1}</h2>
              <div className="grid grid-cols-2 gap-4">
                {PROJECT_TYPES.map(p => (
                  <button key={p.id} onClick={() => { setProject(p.id); setStep(2) }}
                    className="group p-6 text-left transition-all duration-300 hover:-translate-y-1"
                    style={{ background:project===p.id?'rgba(184,144,60,0.08)':'white', border:`1px solid ${project===p.id?'#B8903C':'rgba(184,144,60,0.15)'}` }}>
                    <span className="text-3xl mb-3 block">{p.icon}</span>
                    <p className="font-display text-xl font-400 text-onyx mb-1">{isAr?p.arLabel:p.enLabel}</p>
                    <p className="font-body text-xs text-charcoal/50">{isAr?p.arDesc:p.enDesc}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 2 */}
          {step===2 && (
            <motion.div key="s2" variants={slideVariants} initial="initial" animate="animate" exit="exit" transition={{ duration:0.4 }}>
              <h2 className="font-display text-3xl font-300 text-onyx mb-2 text-center">{t.quote.step2}</h2>
              <p className="text-center font-body text-sm text-charcoal/50 mb-8">{t.quote.selectRooms}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
                {ROOMS.map(r => (
                  <button key={r.id} onClick={() => toggleRoom(r.id)}
                    className="p-4 text-center text-sm font-body transition-all duration-300"
                    style={{ background:rooms.includes(r.id)?'rgba(184,144,60,0.1)':'white', border:`1px solid ${rooms.includes(r.id)?'#B8903C':'rgba(184,144,60,0.15)'}`, color:rooms.includes(r.id)?'#8B6350':'rgba(28,25,23,0.6)' }}>
                    {rooms.includes(r.id) && <span className="block text-yellow-600 mb-1">✓</span>}
                    {isAr?r.arLabel:r.enLabel}
                  </button>
                ))}
              </div>
              <div className="flex gap-4 justify-between">
                <button onClick={() => setStep(1)} className="btn-dark">{t.quote.back}</button>
                <button onClick={() => setStep(3)} disabled={!rooms.length} className="btn-gold disabled:opacity-40">{t.quote.next} →</button>
              </div>
            </motion.div>
          )}

          {/* STEP 3 */}
          {step===3 && (
            <motion.div key="s3" variants={slideVariants} initial="initial" animate="animate" exit="exit" transition={{ duration:0.4 }}>
              <h2 className="font-display text-3xl font-300 text-onyx mb-8 text-center">{t.quote.step3}</h2>
              <div className="space-y-4 mb-10">
                {TIERS.map(ti => (
                  <button key={ti.id} onClick={() => setTier(ti.id)}
                    className="w-full p-6 flex items-center gap-5 transition-all duration-300 text-left"
                    style={{ background:tier===ti.id?'rgba(184,144,60,0.06)':'white', border:`1px solid ${tier===ti.id?'#B8903C':'rgba(184,144,60,0.15)'}` }}>
                    <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0" style={{ borderColor:tier===ti.id?'#B8903C':'rgba(184,144,60,0.3)' }}>
                      {tier===ti.id && <div className="w-2.5 h-2.5 rounded-full" style={{ background:'#B8903C' }} />}
                    </div>
                    <div className="flex-1">
                      <p className="font-display text-lg font-400 text-onyx">{isAr?ti.arLabel:ti.enLabel}</p>
                      <p className="font-body text-xs text-charcoal/50">{isAr?ti.arDesc:ti.enDesc}</p>
                    </div>
                    <span className="font-body text-xs text-yellow-700 font-600">{ti.stars}</span>
                  </button>
                ))}
              </div>
              <div className="flex gap-4 justify-between">
                <button onClick={() => setStep(2)} className="btn-dark">{t.quote.back}</button>
                <button onClick={() => setStep(4)} disabled={!tier} className="btn-gold disabled:opacity-40">{t.quote.getQuote} →</button>
              </div>
            </motion.div>
          )}

          {/* STEP 4 — Get In Touch (no price) */}
          {step===4 && (
            <motion.div key="s4" variants={slideVariants} initial="initial" animate="animate" exit="exit" transition={{ duration:0.4 }}>
              {submitted ? (
                <div className="text-center">
                  <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:'spring', delay:0.1 }}
                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8"
                    style={{ background:'linear-gradient(135deg,#B8903C,#D4AC5A)' }}>
                    <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                  <h2 className="font-display text-3xl md:text-4xl font-300 text-onyx mb-4">{isAr?'تم إرسال طلبك':'Quote request sent'}</h2>
                  <p className="font-body text-sm text-charcoal/60 leading-loose max-w-xl mx-auto mb-8">
                    {isAr?'شكراً لك. سيقوم فريق إمداد بإعداد عرض سعر مخصص والتواصل معك قريباً.':'Thank you. Our team will prepare a tailored quote and contact you shortly.'}
                  </p>
                  <button onClick={resetAll} className="btn-dark">{t.quote.startOver}</button>
                </div>
              ) : (
                <div>
                  <h2 className="font-display text-3xl font-300 text-onyx mb-2 text-center">{isAr?'أكمل طلبك':'Complete your request'}</h2>
                  <p className="font-body text-sm text-charcoal/55 text-center max-w-xl mx-auto mb-8">
                    {isAr?'اترك بياناتك وسنعدّ لك عرض سعر مخصص لاختياراتك.':'Leave your details and we’ll prepare a tailored quote for your selections.'}
                  </p>

                  {/* Summary of selections */}
                  <div className="p-6 mb-6 text-left max-w-xl mx-auto" style={{ background:'#F0E8DA', border:'1px solid rgba(184,144,60,0.15)' }}>
                    <p className="font-body text-[9px] tracking-[0.3em] uppercase text-yellow-700 mb-4">{isAr?'ملخص اختياراتك':'Your selections'}</p>
                    <div className="space-y-2">
                      {selectedProject && (
                        <div className="flex justify-between text-sm font-body">
                          <span className="text-charcoal/50">{isAr?'نوع المشروع:':'Project type:'}</span>
                          <span className="text-onyx font-500">{isAr?selectedProject.arLabel:selectedProject.enLabel}</span>
                        </div>
                      )}
                      {selectedRooms.length > 0 && (
                        <div className="flex justify-between text-sm font-body">
                          <span className="text-charcoal/50">{isAr?'الغرف:':'Spaces:'}</span>
                          <span className="text-onyx font-500 text-right max-w-xs">{selectedRooms.map(r=>isAr?r.arLabel:r.enLabel).join(', ')}</span>
                        </div>
                      )}
                      {selectedTier && (
                        <div className="flex justify-between text-sm font-body">
                          <span className="text-charcoal/50">{isAr?'جودة المواد:':'Material quality:'}</span>
                          <span className="text-onyx font-500">{isAr?selectedTier.arLabel:selectedTier.enLabel}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contact form — saved to admin */}
                  <form onSubmit={submitQuote} className="max-w-xl mx-auto space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <input name="name" value={form.name} onChange={handleFormChange} required
                        placeholder={isAr?'الاسم *':'Name *'}
                        className="w-full px-4 py-3 font-body text-sm text-charcoal bg-white outline-none placeholder:text-charcoal/30"
                        style={{ border:'1px solid rgba(28,25,23,0.15)' }} />
                      <input name="phone" type="tel" value={form.phone} onChange={handleFormChange} required
                        placeholder={isAr?'رقم الهاتف *':'Phone *'}
                        className="w-full px-4 py-3 font-body text-sm text-charcoal bg-white outline-none placeholder:text-charcoal/30"
                        style={{ border:'1px solid rgba(28,25,23,0.15)' }} />
                    </div>
                    <input name="email" type="email" value={form.email} onChange={handleFormChange}
                      placeholder={isAr?'البريد الإلكتروني (اختياري)':'Email (optional)'}
                      className="w-full px-4 py-3 font-body text-sm text-charcoal bg-white outline-none placeholder:text-charcoal/30"
                      style={{ border:'1px solid rgba(28,25,23,0.15)' }} />
                    <textarea name="notes" value={form.notes} onChange={handleFormChange} rows={3}
                      placeholder={isAr?'تفاصيل إضافية (الميزانية، الجدول الزمني، ملاحظات)':'Additional details (budget, timeline, notes)'}
                      className="w-full px-4 py-3 font-body text-sm text-charcoal bg-white outline-none resize-none placeholder:text-charcoal/30"
                      style={{ border:'1px solid rgba(28,25,23,0.15)' }} />
                    {error && <p className="font-body text-xs text-red-500">{error}</p>}
                    <button type="submit" disabled={sending} className="btn-gold w-full justify-center">
                      {sending ? (isAr?'جارٍ الإرسال…':'Sending…') : (isAr?'إرسال طلب عرض السعر →':'Send quote request →')}
                    </button>
                    <p className="font-body text-[11px] text-charcoal/40 text-center">{t.quote.summaryNote}</p>
                  </form>

                  {/* Alternatives */}
                  <div className="flex gap-4 justify-center mt-6">
                    <button onClick={() => setStep(3)} className="btn-dark text-xs py-2.5 px-5">{t.quote.back}</button>
                    <button onClick={handleWhatsApp}
                      className="flex items-center gap-2 text-xs py-2.5 px-5 font-body tracking-wide uppercase text-white transition-all hover:-translate-y-0.5"
                      style={{ background:'#25D366' }}>
                      {isAr?'أو عبر واتساب':'Or via WhatsApp'}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
