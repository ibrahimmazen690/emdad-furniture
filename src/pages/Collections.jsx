import React, { useState, useEffect, useCallback } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import GalleryGrid from '../components/GalleryGrid'
import ScrollReveal from '../components/ScrollReveal'
import { useLang } from '../context/LanguageContext'
import { categories } from '../data/categories'

const STYLE_TAGS = {
  'master-bedrooms':  ['luxury','classic','dark'],
  'single-bedrooms':  ['modern','light','compact'],
  'living-rooms':     ['modern','luxury','classic'],
  'kitchens':         ['modern','minimal','light'],
  'dining-table':     ['classic','luxury','dark'],
  'dressing-room':    ['modern','minimal','light'],
  'landscape':        ['modern','light'],
  'tv-units':         ['modern','minimal','dark'],
  'guest-room':       ['classic','luxury','modern'],
  'storage-room':     ['modern','minimal','light'],
}

const ALL_STYLES = ['modern','classic','luxury','minimal','dark','light','compact']

export default function Collections() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeFilter, setActiveFilter] = useState(searchParams.get('cat') || 'all')
  const [searchQuery, setSearchQuery] = useState('')
  const [styleFilter, setStyleFilter] = useState('all')
  const { t, isAr } = useLang()

  const activeCat = categories.find(c => c.id === activeFilter) || null

  const displayImages = activeCat
    ? activeCat.images
    : categories.flatMap(c => c.images.slice(0, 6))

  // Style filter
  const styleFiltered = styleFilter === 'all'
    ? displayImages
    : displayImages.filter(img => {
        const cat = categories.find(c => c.images.some(i => i.src === img.src))
        return cat && (STYLE_TAGS[cat.id] || []).includes(styleFilter)
      })

  // Text search
  const filtered = searchQuery.trim()
    ? styleFiltered.filter(img => (img.title||'').toLowerCase().includes(searchQuery.toLowerCase()) || (img.alt||'').toLowerCase().includes(searchQuery.toLowerCase()))
    : styleFiltered

  const handleFilter = useCallback((id) => {
    setActiveFilter(id)
    setStyleFilter('all')
    setSearchParams(id !== 'all' ? { cat: id } : {})
    window.scrollTo({ top: 300, behavior: 'smooth' })
  }, [setSearchParams])

  const totalCount = activeCat ? activeCat.count : categories.reduce((s,c)=>s+c.count,0)
  const getCategoryName = (id) => isAr ? (t.catNames[id] || id) : categories.find(c=>c.id===id)?.title || id

  return (
    <div className="min-h-screen" style={{ background:'#FAF7F2' }} dir={isAr?'rtl':'ltr'}>
      {/* Header */}
      <div className="relative pt-32 pb-20 overflow-hidden" style={{ background:'#0D0B09' }}>
        <img src={activeCat?.heroImage || '/images/living-rooms/LIVING1.jpg'} alt="Collections"
          className="absolute inset-0 w-full h-full object-cover" style={{ filter:'brightness(0.2) saturate(0.7)' }} />
        <div className="absolute inset-0" style={{ background:'linear-gradient(to bottom, rgba(13,11,9,0.6), rgba(13,11,9,0.97))' }} />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 text-center">
          <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.8 }}>
            <span className="section-eyebrow text-yellow-500">{activeCat?.subtitle || (isAr?'المجموعة الكاملة':'Complete Portfolio')}</span>
            <div className="gold-divider" />
            <h1 className="font-display text-5xl md:text-7xl font-300 text-white mt-4">
              {activeCat ? (isAr ? t.catNames[activeFilter] : activeCat.title) : t.collections.title}
            </h1>
            <p className="font-body text-xs tracking-widest text-white/30 mt-6 uppercase">{totalCount} {t.collections.pieces}</p>
          </motion.div>
        </div>
      </div>

      {/* Sticky Filter Bar */}
      <div className="sticky top-20 z-30 py-3 shadow-sm" style={{ background:'rgba(250,247,242,0.97)', backdropFilter:'blur(16px)', borderBottom:'1px solid rgba(184,144,60,0.12)' }}>
        <div className="max-w-7xl mx-auto px-4 lg:px-12">
          {/* Category filters */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <button onClick={() => handleFilter('all')}
              className="flex-shrink-0 px-4 py-1.5 font-body text-[10px] tracking-[0.15em] uppercase transition-all duration-300"
              style={{ background:activeFilter==='all'?'#0D0B09':'transparent', color:activeFilter==='all'?'#fff':'rgba(28,25,23,0.5)', border:'1px solid', borderColor:activeFilter==='all'?'#0D0B09':'rgba(28,25,23,0.15)' }}>
              {t.collections.all} ({categories.reduce((s,c)=>s+c.count,0)})
            </button>
            {categories.map(cat => (
              <button key={cat.id} onClick={() => handleFilter(cat.id)}
                className="flex-shrink-0 px-4 py-1.5 font-body text-[10px] tracking-[0.15em] uppercase transition-all duration-300"
                style={{ background:activeFilter===cat.id?'#B8903C':'transparent', color:activeFilter===cat.id?'#fff':'rgba(28,25,23,0.5)', border:'1px solid', borderColor:activeFilter===cat.id?'#B8903C':'rgba(28,25,23,0.15)' }}>
                {isAr ? t.catNames[cat.id] : cat.title} ({cat.count})
              </button>
            ))}
          </div>

          {/* Visual Style search row */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-body text-[9px] tracking-widest uppercase text-charcoal/35 mr-1">{t.search.allStyles}:</span>
            {ALL_STYLES.map(style => {
              const label = t.search[style] || style
              return (
                <button key={style} onClick={() => setStyleFilter(s => s===style?'all':style)}
                  className="px-3 py-1 font-body text-[9px] tracking-wide uppercase transition-all duration-300"
                  style={{ background:styleFilter===style?'rgba(184,144,60,0.12)':'transparent', color:styleFilter===style?'#8B6350':'rgba(28,25,23,0.4)', border:'1px solid', borderColor:styleFilter===style?'rgba(184,144,60,0.4)':'rgba(28,25,23,0.1)', borderRadius:0 }}>
                  {label}
                </button>
              )
            })}
            {/* Text search */}
            <div className="ml-auto relative">
              <input type="text" placeholder={t.collections.search} value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="pl-8 pr-4 py-1.5 font-body text-xs bg-transparent outline-none placeholder:text-charcoal/30"
                style={{ border:'1px solid rgba(28,25,23,0.15)', width:'160px' }} />
              <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-charcoal/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Category description (shown when a single category is selected) */}
      {activeCat && (
        <div className="max-w-7xl mx-auto px-4 lg:px-12 pt-10">
          <div className="p-6 flex flex-col justify-center" style={{ background:'white', border:'1px solid rgba(184,144,60,0.12)' }}>
            <h3 className="font-display text-2xl font-400 text-onyx mb-3">{isAr ? t.catNames[activeCat.id] : activeCat.title}</h3>
            <p className="font-body text-sm leading-loose text-charcoal/60 mb-5">{activeCat.description}</p>
            <div className="flex gap-3">
              <Link to="/quote" className="btn-gold text-xs py-3 px-5">{isAr?'احصل على عرض سعر':'Get a Quote'} →</Link>
              <Link to="/contact" className="btn-dark text-xs py-3 px-5">{isAr?'تواصل معنا':'Contact Us'}</Link>
            </div>
          </div>
        </div>
      )}

      {/* Gallery */}
      <div className="max-w-7xl mx-auto px-4 lg:px-12 py-10">
        <AnimatePresence mode="wait">
          <motion.div key={activeFilter+searchQuery+styleFilter} initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.4 }}>
            {filtered.length > 0 ? (
              <GalleryGrid images={filtered} category={activeCat ? (isAr ? t.catNames[activeFilter] : activeCat.title) : 'EMDAD Collections'} />
            ) : (
              <div className="py-40 text-center">
                <p className="font-display text-2xl font-300 text-charcoal/40">{t.collections.noResults}</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* More categories */}
        {activeCat && (
          <ScrollReveal variant="fadeUp" className="mt-20 pt-14" style={{ borderTop:'1px solid rgba(184,144,60,0.15)' }}>
            <h3 className="font-display text-2xl font-300 text-onyx mb-6">{isAr?'استكشف مجموعات أخرى':'Explore Other Collections'}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {categories.filter(c=>c.id!==activeFilter).slice(0,4).map(cat => (
                <button key={cat.id} onClick={() => handleFilter(cat.id)} className="relative group overflow-hidden text-left" style={{ aspectRatio:'1' }}>
                  <img src={cat.coverImage} alt={cat.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" style={{ filter:'brightness(0.6)' }} />
                  <div className="absolute inset-0 flex flex-col justify-end p-4">
                    <p className="font-display text-base font-400 text-white">{isAr?t.catNames[cat.id]:cat.title}</p>
                    <p className="font-body text-[10px] tracking-widest uppercase text-yellow-400 mt-1">{cat.count} {t.collections.pieces}</p>
                  </div>
                </button>
              ))}
            </div>
          </ScrollReveal>
        )}
      </div>
    </div>
  )
}
