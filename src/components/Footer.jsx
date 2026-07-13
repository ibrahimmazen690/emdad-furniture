import React from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'

const quickLinks = [
  { label: 'Home', path: '/' },
  { label: 'Collections', path: '/collections' },
  { label: 'About Us', path: '/about' },
  { label: 'AR Preview', path: '/ar' },
  { label: 'Get a Quote', path: '/quote' },
  { label: 'My Wishlist', path: '/wishlist' },
  { label: 'Project Timeline', path: '/timeline' },
  { label: 'Book Appointment', path: '/appointment' },
  { label: 'Client Portal', path: '/portal' },
  { label: 'Contact', path: '/contact' },
]

const categoryLinks = [
  'Master Bedrooms', 'Single Bedrooms', 'Living Rooms',
  'Kitchens', 'Dining Tables', 'TV Units',
  'Dressing Rooms', 'Outdoor & Landscape',
]

const services = [
  'Furniture Manufacturing', 'Smart Furniture Solutions',
  'Exhibition Booth Construction', 'Event Infrastructure',
  'Electrical & Technical Services', 'Carpeting & Flooring',
]

export default function Footer() {
  const { t, isAr } = useLang()
  return (
    <footer style={{ background: '#0D0B09' }} className="pt-20 pb-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, #B8903C, #F0D483, #B8903C, transparent)' }} />
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `repeating-linear-gradient(45deg, #B8903C 0px, #B8903C 1px, transparent 1px, transparent 60px)` }} />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16 border-b border-white/5">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <span className="font-accent text-3xl font-700 text-white tracking-[0.1em] block">EMDAD</span>
              <span className="font-body text-xs tracking-[0.18em] uppercase text-yellow-500/70 block mt-1">
                Wooden & Smart Furniture
              </span>
              <div className="gold-divider-left mt-4" />
            </div>
            <p className="font-body text-xs leading-relaxed text-white/40 mb-2">
              Integrated Design, Manufacturing & Smart Infrastructure Solutions
            </p>
            <p className="font-body text-xs text-white/30 mb-6">Zarqa — Jordan · Est. 2023</p>

            <div className="space-y-2 mb-8">
              <a href="tel:+962790840538" className="flex items-center gap-2 font-body text-xs text-white/45 hover:text-yellow-400 transition-colors">
                <span style={{ color: '#B8903C' }}>✆</span> +962-790840538
              </a>
              <a href="mailto:emdad-sofex@emdadgrp.com" className="flex items-center gap-2 font-body text-xs text-white/45 hover:text-yellow-400 transition-colors">
                <span style={{ color: '#B8903C' }}>✉</span> emdad-sofex@emdadgrp.com
              </a>
              <a href="https://emdadgrp.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-body text-xs text-white/45 hover:text-yellow-400 transition-colors">
                <span style={{ color: '#B8903C' }}>🌐</span> emdadgrp.com
              </a>
            </div>

            <div className="flex gap-3">
              {['F', 'I', 'L'].map((s, i) => (
                <a key={i} href="#"
                  className="w-8 h-8 flex items-center justify-center border border-white/10 text-white/30 hover:border-yellow-500 hover:text-yellow-400 transition-all duration-300 text-xs font-600">
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-body text-xs tracking-[0.25em] uppercase text-yellow-500 mb-6">{t.footer.quickLinksTitle}</h4>
            <ul className="space-y-3">
              {quickLinks.map(link => (
                <li key={link.label}>
                  <Link to={link.path} className="font-body text-xs text-white/45 hover:text-yellow-400 transition-colors duration-300 flex items-center gap-2 group">
                    <span className="w-4 h-px bg-yellow-500/40 group-hover:w-6 group-hover:bg-yellow-400 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Collections */}
          <div>
            <h4 className="font-body text-xs tracking-[0.25em] uppercase text-yellow-500 mb-6">{t.footer.collectionsTitle}</h4>
            <ul className="space-y-3">
              {categoryLinks.map(label => (
                <li key={label}>
                  <Link to="/collections" className="font-body text-xs text-white/45 hover:text-yellow-400 transition-colors duration-300 flex items-center gap-2 group">
                    <span className="w-4 h-px bg-yellow-500/40 group-hover:w-6 group-hover:bg-yellow-400 transition-all duration-300" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-body text-xs tracking-[0.25em] uppercase text-yellow-500 mb-6">{t.footer.servicesTitle}</h4>
            <ul className="space-y-3">
              {services.map(label => (
                <li key={label}>
                  <Link to="/contact" className="font-body text-xs text-white/45 hover:text-yellow-400 transition-colors duration-300 flex items-center gap-2 group">
                    <span className="w-4 h-px bg-yellow-500/40 group-hover:w-6 group-hover:bg-yellow-400 transition-all duration-300" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-8 p-4" style={{ border: '1px solid rgba(184,144,60,0.2)', background: 'rgba(184,144,60,0.04)' }}>
              <p className="font-body text-[9px] tracking-[0.2em] uppercase text-yellow-500/70 mb-1">Address</p>
              <p className="font-body text-xs text-white/35 leading-relaxed">
                Hay AL-Jundy, Army Street<br />
                Azzarqa — Jordan
              </p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-white/25 tracking-wider">
            © {new Date().getFullYear()} EMDAD Wooden & Smart Furniture (JAF Co.) — {t.footer.rights}
          </p>
          <a href="https://emdadgrp.com" target="_blank" rel="noopener noreferrer"
            className="font-body text-xs text-white/20 hover:text-yellow-500/60 transition-colors tracking-widest">
            emdadgrp.com
          </a>
        </div>
      </div>
    </footer>
  )
}
