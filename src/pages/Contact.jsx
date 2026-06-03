import React, { useState } from 'react'
import { motion } from 'framer-motion'
import ScrollReveal from '../components/ScrollReveal'
import { useLang } from '../context/LanguageContext'


const services = [
  'Furniture Manufacturing',
  'Smart Furniture Solutions',
  'Exhibition Booth Construction',
  'Event Infrastructure',
  'Electrical & Technical Services',
  'Carpeting & Flooring',
  'Government / Institutional Project',
  'Other',
]

export default function Contact() {
  const { t, isAr } = useLang()
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    await new Promise(r => setTimeout(r, 1500))
    setSending(false)
    setSubmitted(true)
  }

  const contactInfo = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      label: t.contactInfo.addressLabel,
      lines: ['Hay AL-Jundy, Army Street', 'Azzarqa — Jordan'],
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      label: t.contactInfo.callLabel,
      lines: ['+962-779989944'],
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      label: t.contactInfo.emailLabel,
      lines: ['Info@emdadgrp.com'],
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      ),
      label: t.contactInfo.webLabel,
      lines: ['emdadgrp.com'],
    },
  ]

  return (
    <div className="bg-ivory" dir={isAr?'rtl':'ltr'}>
      {/* ── Header ──────────────────────────────────────────── */}
      <div className="relative pt-24 pb-20 overflow-hidden" style={{ background: '#0D0B09', minHeight: '50vh', display: 'flex', alignItems: 'flex-end' }}>
        <img src="/images/landscape/LAND2.jpg" alt="Contact" className="absolute inset-0 w-full h-full object-cover" style={{ filter: 'brightness(0.15) saturate(0.5)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent, rgba(13,11,9,0.98))' }} />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="section-eyebrow text-yellow-500">{t.contactHero.eyebrow}</span>
            <div className="gold-divider-left" />
            <h1 className="font-display text-5xl sm:text-7xl font-300 text-white mt-4 leading-none">
              {t.contactHero.title}<br /><em className="not-italic" style={{ color:'#D4AC5A' }}>{t.contactHero.titleEm}</em>
            </h1>
          </motion.div>
        </div>
      </div>

      {/* ── Main Content ─────────────────────────────────────── */}
      <section className="py-20 md:py-28" style={{ background: '#FAF7F2' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-5 gap-16">

            {/* ── Left: Info ──────────────────────────────────── */}
            <div className="lg:col-span-2 space-y-12">
              <ScrollReveal variant="fadeLeft">
                <p className="font-body text-sm leading-loose text-charcoal/60">
                  {t.contactForm.desc}
                </p>
              </ScrollReveal>

              <div className="space-y-8">
                {contactInfo.map((info, i) => (
                  <ScrollReveal key={info.label} delay={i * 0.1} variant="fadeLeft">
                    <div className="flex gap-5">
                      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center" style={{ background: 'rgba(184,144,60,0.1)', color: '#B8903C' }}>
                        {info.icon}
                      </div>
                      <div>
                        <p className="font-body text-[10px] tracking-[0.25em] uppercase text-charcoal/40 mb-1">{info.label}</p>
                        {info.lines.map(line => (
                          <p key={line} className="font-body text-sm text-charcoal/70 leading-relaxed">{line}</p>
                        ))}
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>

              {/* Social */}
              <ScrollReveal variant="fadeLeft" delay={0.4}>
                <div>
                  <p className="font-body text-[10px] tracking-[0.25em] uppercase text-charcoal/40 mb-4">{t.contactInfo.followLabel}</p>
                  <div className="flex gap-3">
                    {[
                      { name: 'Instagram', path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z', href: '#' },
                      { name: 'Facebook', path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z', href: '#' },
                    ].map(s => (
                      <a key={s.name} href={s.href}
                        className="w-10 h-10 flex items-center justify-center border border-charcoal/15 text-charcoal/30 hover:border-yellow-500 hover:text-yellow-500 transition-all duration-300"
                        aria-label={s.name}>
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d={s.path} /></svg>
                      </a>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* ── Right: Form ──────────────────────────────────── */}
            <div className="lg:col-span-3">
              <ScrollReveal variant="fadeRight">
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center text-center py-20 px-8"
                    style={{ border: '1px solid rgba(184,144,60,0.2)', background: 'rgba(184,144,60,0.03)' }}
                  >
                    <div className="w-16 h-16 flex items-center justify-center mb-6" style={{ background: 'linear-gradient(135deg, #B8903C, #D4AC5A)' }}>
                      <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="font-display text-3xl font-400 text-onyx mb-4">{t.contactForm.successTitle}</h3>
                    <p className="font-body text-sm text-charcoal/55 leading-loose max-w-md">
                      {t.contactForm.successDesc}
                    </p>
                    <div className="gold-divider mt-6" />
                    <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', service: '', message: '' }) }}
                      className="mt-6 font-body text-xs tracking-[0.2em] uppercase text-yellow-600 hover:text-yellow-700 transition-colors">
                      {t.contactForm.successBtn}
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block font-body text-[10px] tracking-[0.25em] uppercase text-charcoal/40 mb-2">{t.contactForm.name} *</label>
                        <input type="text" name="name" value={form.name} onChange={handleChange} required
                          placeholder={t.contactForm.namePlaceholder}
                          className="w-full px-4 py-4 font-body text-sm text-charcoal bg-transparent outline-none transition-all duration-300 placeholder:text-charcoal/25"
                          style={{ border: '1px solid rgba(28,25,23,0.15)', borderColor: form.name ? '#B8903C' : undefined }} />
                      </div>
                      <div>
                        <label className="block font-body text-[10px] tracking-[0.25em] uppercase text-charcoal/40 mb-2">{t.contactForm.email} *</label>
                        <input type="email" name="email" value={form.email} onChange={handleChange} required
                          placeholder={t.contactForm.emailPlaceholder}
                          className="w-full px-4 py-4 font-body text-sm text-charcoal bg-transparent outline-none transition-all duration-300 placeholder:text-charcoal/25"
                          style={{ border: '1px solid rgba(28,25,23,0.15)', borderColor: form.email ? '#B8903C' : undefined }} />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block font-body text-[10px] tracking-[0.25em] uppercase text-charcoal/40 mb-2">{t.contactForm.phone}</label>
                        <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                          placeholder={t.contactForm.phonePlaceholder}
                          className="w-full px-4 py-4 font-body text-sm text-charcoal bg-transparent outline-none transition-all duration-300 placeholder:text-charcoal/25"
                          style={{ border: '1px solid rgba(28,25,23,0.15)' }} />
                      </div>
                      <div>
                        <label className="block font-body text-[10px] tracking-[0.25em] uppercase text-charcoal/40 mb-2">{t.contactForm.service}</label>
                        <select name="service" value={form.service} onChange={handleChange}
                          className="w-full px-4 py-4 font-body text-sm text-charcoal bg-ivory outline-none appearance-none cursor-pointer"
                          style={{ border: '1px solid rgba(28,25,23,0.15)' }}>
                          <option value="">{t.contactForm.selectService}</option>
                          {services.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block font-body text-[10px] tracking-[0.25em] uppercase text-charcoal/40 mb-2">{t.contactForm.message} *</label>
                      <textarea name="message" value={form.message} onChange={handleChange} required rows={6}
                        placeholder={t.contactForm.messagePlaceholder}
                        className="w-full px-4 py-4 font-body text-sm text-charcoal bg-transparent outline-none resize-none transition-all duration-300 placeholder:text-charcoal/25"
                        style={{ border: '1px solid rgba(28,25,23,0.15)', borderColor: form.message ? '#B8903C' : undefined }} />
                    </div>
                    <button type="submit" disabled={sending} className="btn-gold w-full md:w-auto min-w-[200px]">
                      {sending ? (
                        <span className="flex items-center justify-center gap-3">
                          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          {t.contactForm.sending}
                        </span>
                      ) : (
                        <span className="flex items-center gap-3">
                          {t.contactForm.send}
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </span>
                      )}
                    </button>
                    <p className="font-body text-[10px] text-charcoal/30 mt-3">{t.contactForm.note}</p>
                  </form>
                )}
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── Map ──────────────────────────────────────────────── */}
      <section style={{ background: '#F0E8DA' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 pb-12">
          <ScrollReveal variant="fadeUp">
            <h3 className="font-display text-2xl font-300 text-onyx mb-6">
              {t.contactMap.title} <em className="not-italic font-500" style={{ color:'#8B6350' }}>{t.contactMap.titleEm}</em>
            </h3>
          </ScrollReveal>
          <ScrollReveal variant="scaleUp">
            <div className="w-full overflow-hidden relative" style={{ height: '400px', background: '#DFD0BE' }}>
              <iframe
                title="EMDAD Showroom Location — Azzarqa, Jordan"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d54404.98!2d36.0872!3d32.0727!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151b66c0d2f2fc41%3A0xd9ee26b7d6b80c3c!2sZarqa%2C%20Jordan!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                className="w-full h-full border-0"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                style={{ filter: 'sepia(0.2) saturate(0.8)' }}
              />
              <div className="absolute inset-0 pointer-events-none flex items-end justify-start p-6">
                <div className="px-6 py-3 shadow-2xl" style={{ background: '#0D0B09', border: '1px solid #B8903C' }}>
                  <span className="font-body text-xs tracking-[0.2em] uppercase text-yellow-400">
                    Hay AL-Jundy, Army St. — Azzarqa, Jordan
                  </span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
