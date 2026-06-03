import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import VideoHero from '../components/VideoHero'
import CategoryCard from '../components/CategoryCard'
import ScrollReveal from '../components/ScrollReveal'
import StatsCounter from '../components/StatsCounter'
import BeforeAfterSlider from '../components/BeforeAfterSlider'
import { useLang } from '../context/LanguageContext'
import { categories } from '../data/categories'

const features = [
  { icon:<svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>, titleEn:'Premium Craftsmanship', titleAr:'حرفية متميزة', descEn:'160+ skilled professionals delivering masterful woodwork and smart infrastructure.', descAr:'أكثر من 160 محترفاً ماهراً يقدمون أعمال خشبية متقنة وبنية تحتية ذكية.' },
  { icon:<svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>, titleEn:'Smart Integration', titleAr:'تكامل ذكي', descEn:'IoT environments, AI systems, and sensor-integrated furniture for future-ready spaces.', descAr:'بيئات إنترنت الأشياء وأنظمة الذكاء الاصطناعي والأثاث المدمج بالمستشعرات.' },
  { icon:<svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /></svg>, titleEn:'Bespoke Design', titleAr:'تصميم مخصص', descEn:'End-to-end custom projects — from concept and rendering to production and installation.', descAr:'مشاريع مخصصة متكاملة من المفهوم والتصميم حتى الإنتاج والتركيب.' },
  { icon:<svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, titleEn:'Trusted by Leaders', titleAr:'موثوق به من القادة', descEn:'Serving Jordan Armed Forces, SOFEX, embassies, royal institutions, and universities.', descAr:'نخدم القوات المسلحة الأردنية وسوفكس والسفارات والمؤسسات الملكية والجامعات.' },
]

const clients = ['Jordan Armed Forces','SOFEX Jordan','U.S. Embassy','Royal Hashemite Court','European Union','KASOTC','University of Jordan','Civil Defense']
const clientsAr = ['القوات المسلحة الأردنية','سوفكس جوردن','السفارة الأمريكية','الديوان الملكي الهاشمي','الاتحاد الأوروبي','كاسوتك','الجامعة الأردنية','الدفاع المدني']

export default function Home() {
  const { t, isAr } = useLang()

  return (
    <div style={{ background:'#FAF7F2' }} dir={isAr?'rtl':'ltr'}>

      {/* ── VIDEO HERO ──────────────────────────────────────── */}
      <VideoHero />

      {/* ── MARQUEE ─────────────────────────────────────────── */}
      <div className="py-5 overflow-hidden" style={{ background:'#0D0B09', borderTop:'1px solid rgba(184,144,60,0.15)', borderBottom:'1px solid rgba(184,144,60,0.15)' }}>
        <div className="marquee-track">
          {[...Array(6)].map((_,i) => (
            <span key={i} className="inline-flex items-center gap-8 mx-8">
              {['Master Bedrooms','Exhibition Booths','Smart Furniture','Kitchens','Event Infrastructure','Custom Design','AR Preview','Office Furniture'].map(txt => (
                <span key={txt} className="inline-flex items-center gap-4">
                  <span className="font-display text-sm font-300 tracking-[0.25em] uppercase text-white/35">{txt}</span>
                  <span style={{ color:'#B8903C', fontSize:'8px' }}>✦</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ── ANIMATED STATS ──────────────────────────────────── */}
      <section className="py-20 md:py-24" style={{ background:'#FAF7F2' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <StatsCounter />
        </div>
      </section>

      {/* ── CATEGORIES ──────────────────────────────────────── */}
      <section id="categories" className="py-20 md:py-32" style={{ background:'#F0E8DA' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <ScrollReveal variant="fadeUp" className="text-center mb-16">
            <span className="section-eyebrow">{isAr?'مجموعاتنا':'Our Collections'}</span>
            <div className="gold-divider" />
            <h2 className="section-title mt-4">{isAr?'استكشف كل مساحة':'Explore Every'}<br />
              <em className="not-italic font-400" style={{ color:'#8B6350' }}>{isAr?'ونمط':'Space & Style'}</em>
            </h2>
            <p className="font-body text-sm leading-loose text-charcoal/55 max-w-xl mx-auto mt-6">
              {isAr ? 'من غرف النوم الفاخرة إلى المطابخ الذكية، كل مجموعة تعكس التزامنا بالحرفية والأناقة.' : 'From regal master bedrooms to smart kitchens, each collection reflects our commitment to craftsmanship and modern elegance.'}
            </p>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {categories.map((cat, i) => <CategoryCard key={cat.id} category={cat} index={i} />)}
          </div>
          <ScrollReveal variant="fadeUp" delay={0.3} className="text-center mt-14">
            <Link to="/collections" className="btn-dark inline-flex items-center gap-3">
              {isAr ? 'تصفح جميع المجموعات' : 'Browse All Collections'} →
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* ── STYLE COMPARISON ─────────────────────────────────── */}
      <section className="py-20 md:py-32" style={{ background:'#FAF7F2' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <ScrollReveal variant="fadeUp" className="text-center mb-12">
            <span className="section-eyebrow">{t.homeCompare.eyebrow}</span>
            <div className="gold-divider" />
            <h2 className="section-title mt-4">
              {t.homeCompare.title}<br />
              <em className="not-italic font-400" style={{ color:'#8B6350' }}>{t.homeCompare.titleEm}</em>
            </h2>
            <p className="font-body text-sm text-charcoal/55 max-w-md mx-auto mt-4">{t.homeCompare.desc}</p>
          </ScrollReveal>

          {/* Large — Bedroom Classic vs Modern */}
          <div className="mb-4">
            <div className="mb-2 flex items-center justify-between px-1">
              <p className="font-body text-[10px] tracking-[0.25em] uppercase text-charcoal/40">{t.catNames['master-bedrooms']}</p>
              <p className="font-body text-[10px] italic text-charcoal/30">{t.compare.draghint}</p>
            </div>
            <BeforeAfterSlider before="/images/master-bedrooms/BED3.jpg" after="/images/master-bedrooms/BED7.jpg" beforeLabel={t.compare.classic} afterLabel={t.compare.modern} />
          </div>

          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <div>
              <p className="font-body text-[10px] tracking-[0.25em] uppercase text-charcoal/40 mb-2">{t.catNames['kitchens']}</p>
              <BeforeAfterSlider before="/images/kitchens/K1.jpg" after="/images/kitchens/K5.jpg" beforeLabel={t.compare.light} afterLabel={t.compare.dark} />
            </div>
            <div>
              <p className="font-body text-[10px] tracking-[0.25em] uppercase text-charcoal/40 mb-2">{t.catNames['tv-units']}</p>
              <BeforeAfterSlider before="/images/tv-units/TV2.jpg" after="/images/tv-units/TV6.jpg" beforeLabel={t.compare.minimal} afterLabel={t.compare.luxury} />
            </div>
            <div>
              <p className="font-body text-[10px] tracking-[0.25em] uppercase text-charcoal/40 mb-2">{t.catNames['living-rooms']}</p>
              <BeforeAfterSlider before="/images/guest-room/GUST2.jpg" after="/images/living-rooms/LIVING2.jpg" beforeLabel={t.compare.traditional} afterLabel={t.compare.contemporary} />
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURE SPLIT ───────────────────────────────────── */}
      <section className="py-20 md:py-32 overflow-hidden" style={{ background:'#F0E8DA' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className={`grid lg:grid-cols-2 gap-16 items-center ${isAr?'lg:grid-flow-col-dense':''}`}>
            <ScrollReveal variant="fadeLeft">
              <div className="relative h-[520px]">
                <div className="absolute top-0 left-0 w-3/4 h-3/4 overflow-hidden shadow-2xl">
                  <img src="/images/master-bedrooms/BED3.jpg" alt="Craftsmanship" className="w-full h-full object-cover" />
                </div>
                <div className="absolute bottom-0 right-0 w-2/3 h-2/3 overflow-hidden shadow-2xl" style={{ border:'4px solid #F0E8DA' }}>
                  <img src="/images/guest-room/GUST1.jpg" alt="Guest Room" className="w-full h-full object-cover" />
                </div>
                <div className="absolute bottom-1/4 left-1/3 w-20 h-20 flex flex-col items-center justify-center text-center" style={{ background:'linear-gradient(135deg,#B8903C,#D4AC5A)' }}>
                  <span className="font-accent text-white text-2xl font-700 leading-none">EST</span>
                  <span className="font-body text-white/80 text-[9px] tracking-widest leading-tight mt-0.5">2023</span>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal variant="fadeRight">
              <span className="section-eyebrow">{isAr?'لماذا تختار إمداد':'Why Choose EMDAD'}</span>
              <div className="gold-divider-left" />
              <h2 className="font-display text-4xl md:text-5xl font-300 text-onyx mt-4 mb-8 leading-tight">
                {isAr?'حيث الحرفية تلتقي':'Where Craftsmanship Meets'}<br />
                <em className="not-italic font-500" style={{ color:'#8B6350' }}>{isAr?'الابتكار الذكي':'Smart Innovation'}</em>
              </h2>
              <p className="font-body text-sm leading-loose text-charcoal/60 mb-10">
                {isAr ? 'منذ عام 2023، يقدم فريق إمداد المكون من 160+ محترف حلولاً متكاملة للأثاث والبيئات الذكية — من التصميم إلى التركيب.' : 'Since 2023, EMDAD\'s 160+ professionals deliver integrated furniture and smart environment solutions — from design to installation.'}
              </p>
              <div className="grid sm:grid-cols-2 gap-5 mb-10">
                {features.map((f,i) => (
                  <motion.div key={f.titleEn} initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.1, duration:0.5 }} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center" style={{ background:'rgba(184,144,60,0.1)', color:'#B8903C' }}>{f.icon}</div>
                    <div>
                      <h4 className="font-body text-sm font-600 text-onyx mb-1">{isAr?f.titleAr:f.titleEn}</h4>
                      <p className="font-body text-xs leading-relaxed text-charcoal/55">{isAr?f.descAr:f.descEn}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="flex flex-wrap gap-4">
                <Link to="/about" className="btn-gold">{isAr?'قصتنا':'Our Story'}</Link>
                <Link to="/quote" className="btn-dark">{isAr?'احصل على عرض سعر':'Get a Quote'}</Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── CLIENTS MARQUEE ─────────────────────────────────── */}
      <section className="py-16" style={{ background:'#0D0B09', borderTop:'1px solid rgba(184,144,60,0.1)' }}>
        <div className="max-w-7xl mx-auto px-6 mb-8 text-center">
          <p className="font-body text-[10px] tracking-[0.4em] uppercase text-white/25">{isAr?'عملاؤنا الموثوقون':'Trusted By Our Clients'}</p>
        </div>
        <div className="overflow-hidden">
          <div className="marquee-track">
            {[...Array(4)].map((_,j) => (
              <span key={j} className="inline-flex items-center gap-0">
                {(isAr?clientsAr:clients).map((c,i) => (
                  <span key={i} className="inline-flex items-center gap-6 mx-10">
                    <span className="font-body text-xs tracking-wide uppercase text-white/30">{c}</span>
                    <span style={{ color:'rgba(184,144,60,0.3)', fontSize:'6px' }}>◆</span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED GALLERY STRIP ──────────────────────────── */}
      <section className="py-20 md:py-28 overflow-hidden" style={{ background:'#0D0B09' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-12">
          <ScrollReveal variant="fadeUp" className="flex items-end justify-between">
            <div>
              <span className="section-eyebrow text-yellow-500">{isAr?'أعمال مختارة':'Featured Work'}</span>
              <div className="gold-divider-left" />
              <h2 className="section-title-light mt-3">{isAr?'مشاريع':'Selected'}<br /><em className="not-italic" style={{ color:'#D4AC5A' }}>{isAr?'مختارة':'Highlights'}</em></h2>
            </div>
            <Link to="/collections" className="hidden md:flex items-center gap-3 font-body text-xs tracking-[0.2em] uppercase text-white/50 hover:text-yellow-400 transition-colors duration-300">
              {isAr?'عرض الكل':'View All'} →
            </Link>
          </ScrollReveal>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 px-6 lg:px-12" style={{ scrollbarWidth:'none' }}>
          {['/images/kitchens/K2.jpg','/images/dining-table/TABLE3.jpg','/images/living-rooms/LIVING2.jpg','/images/master-bedrooms/BED7.jpg','/images/tv-units/TV3.jpg','/images/dressing-room/DRESS2.jpg','/images/landscape/LAND4.jpg','/images/single-bedrooms/BEDS5.jpg','/images/kitchens/K6.jpg','/images/guest-room/GUST4.jpg'].map((src,i) => (
            <motion.div key={src} initial={{ opacity:0, scale:0.95 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }} transition={{ delay:i*0.05, duration:0.5 }}
              className="flex-shrink-0 overflow-hidden group cursor-pointer" style={{ width:'280px', height:'360px' }}>
              <img src={src} alt={`Featured ${i+1}`} loading="lazy" className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" style={{ filter:'brightness(0.8) saturate(1.1)' }} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── TOOLS CTA STRIP ─────────────────────────────────── */}
      <section className="py-16" style={{ background:'#F0E8DA' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon:'🧮', titleEn:'Quote Estimator', titleAr:'تقدير السعر', descEn:'Get an instant price estimate for your project', descAr:'احصل على تقدير سعر فوري لمشروعك', path:'/quote' },
              { icon:'📅', titleEn:'Project Timeline', titleAr:'الجدول الزمني', descEn:'See how long your project will take', descAr:'تعرف على المدة التي سيستغرقها مشروعك', path:'/timeline' },
              { icon:'♥', titleEn:'My Wishlist', titleAr:'قائمة المفضلة', descEn:'Save pieces you love and send an inquiry', descAr:'احفظ القطع التي تعجبك وأرسل استفساراً', path:'/wishlist' },
              { icon:'🔍', titleEn:'AI Room Analyzer', titleAr:'محلل الغرف بالذكاء الاصطناعي', descEn:'Upload a photo — get personalized furniture recommendations', descAr:'ارفع صورة — احصل على توصيات أثاث مخصصة', path:'/analyze' },
            ].map(tool => (
              <Link key={tool.path} to={tool.path} className="group flex gap-4 items-start p-6 transition-all duration-300 hover:-translate-y-1"
                style={{ background:'white', border:'1px solid rgba(184,144,60,0.12)' }}>
                <span className="text-3xl flex-shrink-0">{tool.icon}</span>
                <div>
                  <h4 className="font-display text-lg font-400 text-onyx mb-1 group-hover:text-yellow-700 transition-colors">{isAr?tool.titleAr:tool.titleEn}</h4>
                  <p className="font-body text-xs text-charcoal/50 leading-relaxed">{isAr?tool.descAr:tool.descEn}</p>
                </div>
                <svg className="w-4 h-4 text-charcoal/30 group-hover:text-yellow-600 mt-1 ml-auto flex-shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={isAr?"M15 19l-7-7 7-7":"M9 5l7 7-7 7"} />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── AR CTA ──────────────────────────────────────────── */}
      <section className="relative py-28 md:py-40 overflow-hidden">
        <img src="/images/living-rooms/LIVING3.jpg" alt="AR Preview" className="absolute inset-0 w-full h-full object-cover" style={{ filter:'brightness(0.25) saturate(0.8)' }} />
        <div className="absolute inset-0" style={{ background:'linear-gradient(135deg, rgba(13,11,9,0.9) 0%, rgba(74,44,42,0.7) 100%)' }} />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <ScrollReveal variant="fadeUp">
            <span className="section-eyebrow text-yellow-400">{isAr?'تجربة جديدة':'New Experience'}</span>
            <div className="gold-divider" />
            <h2 className="section-title-light mt-4 mb-6">
              {isAr?'شاهد الأثاث في منزلك':'Preview Furniture'}<br />
              <em className="not-italic" style={{ color:'#D4AC5A' }}>{isAr?'قبل الشراء':'In Your Own Home'}</em>
            </h2>
            <p className="font-body text-sm leading-loose text-white/55 max-w-xl mx-auto mb-10">
              {isAr ? 'تطبيق إمداد للواقع المعزز يتيح لك رؤية أي قطعة في مساحتك الحقيقية قبل الشراء.' : 'Our Augmented Reality app lets you visualize any EMDAD piece in your actual living space before purchasing.'}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/ar" className="btn-gold">{isAr?'استكشف ميزة AR':'Explore AR Feature'}</Link>
              <Link to="/contact" className="btn-outline">{isAr?'طلب استشارة':'Request a Consultation'}</Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
