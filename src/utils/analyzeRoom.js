// ── EMDAD Room Analyzer — API utility ────────────────────────────────────────
// Converts image file to base64 and posts to the secure serverless proxy.

export async function analyzeRoomImage(file, lang = 'en') {
  // Validate file
  const validTypes = ['image/jpeg','image/jpg','image/png','image/webp']
  if (!validTypes.includes(file.type)) throw new Error('Please upload a JPEG, PNG, or WEBP image.')
  if (file.size > 6 * 1024 * 1024) throw new Error('Image must be under 6MB. Please compress it first.')

  // Convert to base64
  const base64 = await toBase64(file)

  // Call secure proxy (server.js must be running via npm run dev)
  let res
  try {
    res = await fetch('/api/analyze-room', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64: base64, mediaType: file.type, lang }),
    })
  } catch (networkErr) {
    throw new Error(
      'Cannot connect to the local API server. Make sure you started the project with "npm run dev" (not just "vite"). ' +
      'If you only see the Vite server, open a second terminal and run "node server.js".'
    )
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `Analysis failed (${res.status})`)
  }

  const analysis = await res.json()
  if (!analysis.roomType) throw new Error('Unexpected response from analysis service.')
  return analysis
}

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      // Strip "data:image/xxx;base64," prefix
      const base64 = reader.result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = () => reject(new Error('Failed to read image file.'))
    reader.readAsDataURL(file)
  })
}

// ── Category metadata map (matches categories.js) ─────────────────────────
export const CATEGORY_META = {
  'master-bedrooms': {
    coverImg: '/images/master-bedrooms/BED5.jpg',
    altImg:   '/images/master-bedrooms/BED1.jpg',
    link:     '/collections?cat=master-bedrooms',
    count:    61,
  },
  'single-bedrooms': {
    coverImg: '/images/single-bedrooms/BEDS3.jpg',
    altImg:   '/images/single-bedrooms/BEDS1.jpg',
    link:     '/collections?cat=single-bedrooms',
    count:    33,
  },
  'living-rooms': {
    coverImg: '/images/living-rooms/LIVING2.jpg',
    altImg:   '/images/living-rooms/living4.jpg',
    link:     '/collections?cat=living-rooms',
    count:    23,
  },
  'guest-room': {
    coverImg: '/images/guest-room/GUST1.jpg',
    altImg:   '/images/guest-room/GUST3.jpg',
    link:     '/collections?cat=guest-room',
    count:    21,
  },
  'kitchens': {
    coverImg: '/images/kitchens/K4.jpg',
    altImg:   '/images/kitchens/K1.jpg',
    link:     '/collections?cat=kitchens',
    count:    19,
  },
  'dining-table': {
    coverImg: '/images/dining-table/TABLE3.jpg',
    altImg:   '/images/dining-table/TABLE1.jpg',
    link:     '/collections?cat=dining-table',
    count:    8,
  },
  'dressing-room': {
    coverImg: '/images/dressing-room/DRESS3.jpg',
    altImg:   '/images/dressing-room/DRESS1.jpg',
    link:     '/collections?cat=dressing-room',
    count:    5,
  },
  'storage-room': {
    coverImg: '/images/storage-room/STOR1.jpg',
    altImg:   '/images/storage-room/STORE2.jpg',
    link:     '/collections?cat=storage-room',
    count:    2,
  },
  'landscape': {
    coverImg: '/images/landscape/LAND3.jpg',
    altImg:   '/images/landscape/LAND1.jpg',
    link:     '/collections?cat=landscape',
    count:    8,
  },
  'tv-units': {
    coverImg: '/images/tv-units/TV4.jpg',
    altImg:   '/images/tv-units/TV1.jpg',
    link:     '/collections?cat=tv-units',
    count:    10,
  },
}

export const URGENCY_COLORS = {
  essential:    { bg:'rgba(14,99,56,0.08)',   border:'rgba(14,99,56,0.25)',   text:'#085041', label:'Essential'    },
  recommended:  { bg:'rgba(184,144,60,0.08)', border:'rgba(184,144,60,0.3)', text:'#854F0B', label:'Recommended' },
  optional:     { bg:'rgba(83,74,183,0.08)',  border:'rgba(83,74,183,0.25)', text:'#3C3489', label:'Optional'     },
}
