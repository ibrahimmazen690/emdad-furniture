import React, { createContext, useContext, useState, useEffect } from 'react'
import { en } from '../translations/en'
import { ar } from '../translations/ar'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('emdad-lang') || 'en')

  useEffect(() => {
    localStorage.setItem('emdad-lang', lang)
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = lang
    document.body.style.fontFamily = lang === 'ar'
      ? "'Cairo', 'Montserrat', sans-serif"
      : "'Montserrat', sans-serif"
  }, [lang])

  const toggle = () => setLang(l => l === 'en' ? 'ar' : 'en')
  const t = lang === 'ar' ? ar : en

  return (
    <LanguageContext.Provider value={{ lang, toggle, isAr: lang === 'ar', t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLang = () => useContext(LanguageContext)
