import React, { useState, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '../context/LanguageContext'

// ── Constants ─────────────────────────────────────────────────────────────────
const TIME_SLOTS = [
  { time: '09:00', label: '9:00 AM' }, { time: '10:00', label: '10:00 AM' },
  { time: '11:00', label: '11:00 AM' }, { time: '12:00', label: '12:00 PM' },
  { time: '14:00', label: '2:00 PM'  }, { time: '15:00', label: '3:00 PM'  },
  { time: '16:00', label: '4:00 PM'  }, { time: '17:00', label: '5:00 PM'  },
]
// Pre-booked slots per date string "YYYY-MM-DD": array of blocked time strings
function getBlockedSlots(dateStr) {
  const hash = dateStr.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  const pool = ['09:00','10:00','11:00','14:00','15:00','16:00']
  return pool.filter((_, i) => (hash + i * 7) % 3 === 0).slice(0, 3)
}

const DAY_NAMES_EN = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
const DAY_NAMES_AR = ['أحد','اثنين','ثلاثاء','أربعاء','خميس','جمعة','سبت']
const MONTH_NAMES_EN = ['January','February','March','April','May','June','July','August','September','October','November','December']
const MONTH_NAMES_AR = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر']

function formatDate(date, isAr) {
  return `${isAr ? MONTH_NAMES_AR[date.getMonth()] : MONTH_NAMES_EN[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
}
function toKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`
}

// ── Calendar Component ────────────────────────────────────────────────────────
function Calendar({ selected, onSelect, isAr }) {
  const today = useMemo(() => { const d = new Date(); d.setHours(0,0,0,0); return d }, [])
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1))

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDay = new Date(year, month, 1).getDay() // 0=Sun

  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d))

  const isBlocked = (date) => !date || date < today || date.getDay() === 5
  const isSelected = (date) => date && selected && toKey(date) === toKey(selected)

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1))
  const nextMonth = () => {
    const maxDate = new Date(today.getFullYear(), today.getMonth() + 3, 1)
    if (viewDate < maxDate) setViewDate(new Date(year, month + 1, 1))
  }

  const dayNames = isAr ? DAY_NAMES_AR : DAY_NAMES_EN

  return (
    <div>
      {/* Month nav */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={prevMonth} className="w-9 h-9 flex items-center justify-center hover:bg-yellow-50 transition-colors" style={{ border:'1px solid rgba(184,144,60,0.2)' }}>
          <svg className="w-4 h-4 text-charcoal/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={isAr?"M9 5l7 7-7 7":"M15 19l-7-7 7-7"} /></svg>
        </button>
        <h3 className="font-display text-xl font-400 text-onyx">
          {isAr ? MONTH_NAMES_AR[month] : MONTH_NAMES_EN[month]} {year}
        </h3>
        <button onClick={nextMonth} className="w-9 h-9 flex items-center justify-center hover:bg-yellow-50 transition-colors" style={{ border:'1px solid rgba(184,144,60,0.2)' }}>
          <svg className="w-4 h-4 text-charcoal/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={isAr?"M15 19l-7-7 7-7":"M9 5l7 7-7 7"} /></svg>
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-2">
        {dayNames.map(d => (
          <div key={d} className="text-center font-body text-[10px] tracking-widest uppercase py-2" style={{ color: d === (isAr?'جمعة':'Fri') ? 'rgba(184,144,60,0.5)' : 'rgba(28,25,23,0.35)' }}>{d}</div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((date, i) => {
          if (!date) return <div key={`e-${i}`} />
          const blocked = isBlocked(date)
          const sel = isSelected(date)
          const isFri = date.getDay() === 5
          const isPast = date < today
          return (
            <button key={toKey(date)} onClick={() => !blocked && onSelect(date)} disabled={blocked}
              className="aspect-square flex items-center justify-center font-body text-sm transition-all duration-200 relative"
              style={{
                background: sel ? '#B8903C' : 'transparent',
                color: sel ? 'white' : blocked ? 'rgba(28,25,23,0.2)' : isFri ? 'rgba(184,144,60,0.6)' : 'rgba(28,25,23,0.8)',
                cursor: blocked ? 'not-allowed' : 'pointer',
                textDecoration: isFri && !isPast ? 'none' : isPast ? 'line-through' : 'none',
                borderRadius: '2px',
                border: sel ? 'none' : date.toDateString() === today.toDateString() ? '1px solid rgba(184,144,60,0.4)' : 'none',
              }}>
              {date.getDate()}
              {sel && <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white" />}
            </button>
          )
        })}
      </div>
      <p className="font-body text-[10px] text-charcoal/35 mt-4 text-center">
        <span className="inline-block w-2 h-2 rounded-full mr-1" style={{ background:'rgba(184,144,60,0.4)', display:'inline-block', verticalAlign:'middle' }} />
        Friday
      </p>
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function Appointment() {
  const { t, isAr } = useLang()
  const ta = t.appt
  const [step, setStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [form, setForm] = useState({ name:'', phone:'', email:'', company:'', type:'', notes:'' })
  const [ref] = useState(() => 'EMD-' + Date.now().toString().slice(-6))

  const blockedSlots = useMemo(() => selectedDate ? getBlockedSlots(toKey(selectedDate)) : [], [selectedDate])
  const morning = TIME_SLOTS.slice(0, 4)
  const afternoon = TIME_SLOTS.slice(4)

  const handleDateSelect = (date) => { setSelectedDate(date); setSelectedTime(null) }
  const handleSubmit = (e) => {
    e.preventDefault()
    setStep(4)
    // Save the booking so it shows up in the admin portal. Fire-and-forget —
    // the on-screen confirmation + WhatsApp fallback work regardless.
    fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ref,
        name: form.name, phone: form.phone, email: form.email,
        company: form.company, type: form.type, notes: form.notes,
        date: selectedDate ? toKey(selectedDate) : '',
        dateLabel: selectedDate ? formatDate(selectedDate, false) : '',
        time: selectedTime,
      }),
    }).catch(() => {})
  }

  const whatsappMsg = () => {
    const msg = isAr
      ? `مرحباً إمداد،\nأرغب في تأكيد موعد زيارة المعرض:\n📅 التاريخ: ${selectedDate ? formatDate(selectedDate, true) : ''}\n🕐 الوقت: ${selectedTime}\n👤 الاسم: ${form.name}\n📞 الهاتف: ${form.phone}\n🏠 نوع المشروع: ${form.type}\nشكراً!`
      : `Hello EMDAD,\nI'd like to confirm my showroom visit:\n📅 Date: ${selectedDate ? formatDate(selectedDate, false) : ''}\n🕐 Time: ${selectedTime}\n👤 Name: ${form.name}\n📞 Phone: ${form.phone}\n🏠 Project: ${form.type}\nThank you!`
    window.open(`https://wa.me/962790840538?text=${encodeURIComponent(msg)}`, '_blank')
  }

  const slideDir = { initial: { opacity:0, x: isAr ? -30 : 30 }, animate: { opacity:1, x:0 }, exit: { opacity:0, x: isAr ? 30 : -30 } }

  return (
    <div className="min-h-screen pt-24" style={{ background:'#FAF7F2' }} dir={isAr?'rtl':'ltr'}>
      {/* Hero */}
      <div className="py-16 text-center" style={{ background:'#0D0B09' }}>
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}>
          <span className="section-eyebrow text-yellow-500">{isAr?'الزرقاء — الأردن':'Zarqa — Jordan'}</span>
          <div className="gold-divider" />
          <h1 className="font-display text-4xl md:text-6xl font-300 text-white mt-4">{ta.pageTitle}</h1>
          <p className="font-body text-sm text-white/40 mt-4 max-w-md mx-auto">{ta.pageSub}</p>
        </motion.div>

        {/* Step progress */}
        <div className="flex items-center justify-center gap-2 mt-10">
          {[ta.step1, ta.step2, ta.step3, ta.step4].map((label, i) => (
            <React.Fragment key={label}>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center font-body text-xs font-600 transition-all duration-400 flex-shrink-0"
                  style={{ background: step > i+1 ? '#B8903C' : step === i+1 ? 'rgba(184,144,60,0.25)' : 'rgba(255,255,255,0.05)', border: `1px solid ${step >= i+1 ? 'rgba(184,144,60,0.6)' : 'rgba(255,255,255,0.1)'}`, color: step > i+1 ? 'white' : step === i+1 ? '#D4AC5A' : 'rgba(255,255,255,0.25)' }}>
                  {step > i+1 ? '✓' : i+1}
                </div>
                <span className="hidden md:block font-body text-[10px] tracking-wide uppercase" style={{ color: step === i+1 ? '#D4AC5A' : 'rgba(255,255,255,0.25)' }}>{label}</span>
              </div>
              {i < 3 && <div className="w-8 h-px flex-shrink-0" style={{ background: step > i+1 ? '#B8903C' : 'rgba(255,255,255,0.1)' }} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <AnimatePresence mode="wait">

          {/* ── Step 1: Date ── */}
          {step === 1 && (
            <motion.div key="s1" {...slideDir} transition={{ duration:0.35 }}>
              <h2 className="font-display text-2xl font-300 text-onyx mb-8 text-center">{ta.step1}</h2>
              <div className="max-w-sm mx-auto p-8" style={{ background:'white', border:'1px solid rgba(184,144,60,0.12)' }}>
                <Calendar selected={selectedDate} onSelect={handleDateSelect} isAr={isAr} />
              </div>
              <div className="flex justify-center mt-8">
                <button onClick={() => setStep(2)} disabled={!selectedDate}
                  className="btn-gold disabled:opacity-40 disabled:cursor-not-allowed">{ta.next} →</button>
              </div>
              <p className="font-body text-[10px] text-center text-charcoal/35 mt-4">{ta.friNote}</p>
            </motion.div>
          )}

          {/* ── Step 2: Time ── */}
          {step === 2 && (
            <motion.div key="s2" {...slideDir} transition={{ duration:0.35 }}>
              <h2 className="font-display text-2xl font-300 text-onyx mb-2 text-center">{ta.step2}</h2>
              <p className="font-body text-sm text-charcoal/50 text-center mb-8">{selectedDate && formatDate(selectedDate, isAr)}</p>

              <div className="max-w-lg mx-auto space-y-6">
                {[{ label: ta.morningSlots, slots: morning }, { label: ta.afternoonSlots, slots: afternoon }].map(group => (
                  <div key={group.label}>
                    <p className="font-body text-[10px] tracking-[0.3em] uppercase mb-3" style={{ color:'#B8903C' }}>{group.label}</p>
                    <div className="grid grid-cols-4 gap-2">
                      {group.slots.map(slot => {
                        const isBooked = blockedSlots.includes(slot.time)
                        const isSel = selectedTime === slot.time
                        return (
                          <button key={slot.time} onClick={() => !isBooked && setSelectedTime(slot.time)} disabled={isBooked}
                            className="py-3 px-2 text-center font-body text-xs transition-all duration-200"
                            style={{ background: isSel ? '#B8903C' : isBooked ? 'rgba(28,25,23,0.04)' : 'white', color: isSel ? 'white' : isBooked ? 'rgba(28,25,23,0.2)' : 'rgba(28,25,23,0.7)', border: `1px solid ${isSel ? '#B8903C' : isBooked ? 'rgba(28,25,23,0.06)' : 'rgba(184,144,60,0.2)'}`, cursor: isBooked ? 'not-allowed' : 'pointer', textDecoration: isBooked ? 'line-through' : 'none' }}>
                            {slot.label}
                            {isBooked && <span className="block text-[9px] mt-0.5">{ta.booked}</span>}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center gap-4 mt-10">
                <button onClick={() => setStep(1)} className="btn-dark">{ta.prev}</button>
                <button onClick={() => setStep(3)} disabled={!selectedTime} className="btn-gold disabled:opacity-40">{ta.next} →</button>
              </div>
            </motion.div>
          )}

          {/* ── Step 3: Form ── */}
          {step === 3 && (
            <motion.div key="s3" {...slideDir} transition={{ duration:0.35 }}>
              <h2 className="font-display text-2xl font-300 text-onyx mb-2 text-center">{ta.step3}</h2>
              <p className="font-body text-sm text-charcoal/50 text-center mb-8">
                {selectedDate && formatDate(selectedDate, isAr)} — {selectedTime}
              </p>

              <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  {[
                    { key:'name',    lbl:ta.nameLabel,   ph:ta.namePh,   req:true  },
                    { key:'phone',   lbl:ta.phoneLbl,    ph:ta.phonePh,  req:true  },
                    { key:'email',   lbl:ta.emailLbl,    ph:ta.emailPh,  req:false },
                    { key:'company', lbl:ta.companyLbl,  ph:ta.companyPh,req:false },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="block font-body text-[10px] tracking-[0.25em] uppercase text-charcoal/40 mb-2">{f.lbl}{f.req && ' *'}</label>
                      <input type={f.key==='email'?'email':f.key==='phone'?'tel':'text'} required={f.req}
                        value={form[f.key]} onChange={e => setForm(p => ({...p, [f.key]:e.target.value}))}
                        placeholder={f.ph}
                        className="w-full px-4 py-3 font-body text-sm text-charcoal bg-transparent outline-none placeholder:text-charcoal/25 transition-all"
                        style={{ border:'1px solid rgba(28,25,23,0.15)', borderColor: form[f.key] ? '#B8903C' : undefined }} />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block font-body text-[10px] tracking-[0.25em] uppercase text-charcoal/40 mb-2">{ta.typeLbl} *</label>
                  <select required value={form.type} onChange={e => setForm(p => ({...p, type:e.target.value}))}
                    className="w-full px-4 py-3 font-body text-sm text-charcoal bg-ivory outline-none appearance-none"
                    style={{ border:'1px solid rgba(28,25,23,0.15)' }}>
                    <option value="">—</option>
                    {ta.types.map(tp => <option key={tp} value={tp}>{tp}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block font-body text-[10px] tracking-[0.25em] uppercase text-charcoal/40 mb-2">{ta.notesLabel}</label>
                  <textarea value={form.notes} onChange={e => setForm(p => ({...p, notes:e.target.value}))} rows={3}
                    placeholder={ta.notesLabel}
                    className="w-full px-4 py-3 font-body text-sm text-charcoal bg-transparent outline-none resize-none placeholder:text-charcoal/25"
                    style={{ border:'1px solid rgba(28,25,23,0.15)' }} />
                </div>

                <div className="flex gap-4 justify-between pt-2">
                  <button type="button" onClick={() => setStep(2)} className="btn-dark">{ta.prev}</button>
                  <button type="submit" className="btn-gold">{ta.confirm} →</button>
                </div>
              </form>
            </motion.div>
          )}

          {/* ── Step 4: Confirmed ── */}
          {step === 4 && (
            <motion.div key="s4" {...slideDir} transition={{ duration:0.4 }}>
              <div className="max-w-lg mx-auto text-center">
                {/* Gold checkmark */}
                <motion.div initial={{ scale:0, rotate:-180 }} animate={{ scale:1, rotate:0 }}
                  transition={{ type:'spring', stiffness:200, damping:15 }}
                  className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8"
                  style={{ background:'linear-gradient(135deg,#B8903C,#D4AC5A)' }}>
                  <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>

                <h2 className="font-display text-3xl md:text-4xl font-300 text-onyx mb-2">{ta.successTitle}</h2>
                <p className="font-body text-xs tracking-[0.2em] uppercase mb-6" style={{ color:'#B8903C' }}>
                  {ta.successSub}: {ref}
                </p>

                {/* Summary card */}
                <div className="p-6 mb-6 text-left space-y-3" style={{ background:'#F0E8DA', border:'1px solid rgba(184,144,60,0.2)' }}>
                  {[
                    { lbl: ta.summaryDate, val: selectedDate ? formatDate(selectedDate, isAr) : '' },
                    { lbl: ta.summaryTime, val: selectedTime },
                    { lbl: ta.summaryName, val: form.name },
                    { lbl: ta.summaryType, val: form.type },
                  ].map(row => (
                    <div key={row.lbl} className="flex justify-between text-sm">
                      <span className="font-body text-charcoal/50">{row.lbl}</span>
                      <span className="font-body font-500 text-onyx">{row.val}</span>
                    </div>
                  ))}
                </div>

                <p className="font-body text-sm text-charcoal/55 leading-loose mb-8">{ta.successMsg}</p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button onClick={whatsappMsg}
                    className="flex items-center justify-center gap-2 px-6 py-4 text-white font-body text-xs tracking-widest uppercase transition-all hover:-translate-y-1"
                    style={{ background:'#25D366' }}>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    {ta.whatsappBtn}
                  </button>
                  <button onClick={() => { setStep(1); setSelectedDate(null); setSelectedTime(null); setForm({ name:'',phone:'',email:'',company:'',type:'',notes:'' }) }}
                    className="btn-dark">{ta.newBtn}</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
