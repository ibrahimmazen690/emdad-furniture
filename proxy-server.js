// ─────────────────────────────────────────────────────────────────────────────
// EMDAD Local Development Proxy — handles BOTH AI features
//   POST /analyze-room → Claude Vision  (AI Room Analyzer)
//   POST /chat         → Claude Chat    (Voice Avatar)
// Run: node proxy-server.js
// ─────────────────────────────────────────────────────────────────────────────

const http = require('http')
const fs   = require('fs')

// ── Read .env ─────────────────────────────────────────────────────────────────
if (fs.existsSync('.env')) {
  fs.readFileSync('.env','utf8').split('\n').forEach(line => {
    const eq = line.indexOf('=')
    if (eq > 0 && !line.trim().startsWith('#')) {
      process.env[line.slice(0,eq).trim()] = line.slice(eq+1).trim().replace(/^["']|["']$/g,'')
    }
  })
}

const KEY  = process.env.ANTHROPIC_API_KEY
const PORT = 3001

if (!KEY || KEY.includes('your-key')) {
  console.error('\n❌  Add ANTHROPIC_API_KEY to your .env file\n')
  process.exit(1)
}

// ── EMDAD complete knowledge base ─────────────────────────────────────────────
const EMDAD_SYSTEM = `You are Layla — EMDAD's official AI voice advisor. You speak Arabic and English fluently and represent EMDAD Wooden & Smart Furniture with warmth, expertise, and professionalism.

━━━ COMPANY ━━━
Name: EMDAD Wooden & Smart Furniture (EMDAD JAF Co.)
Founded: 2023 | Location: Hay AL-Jundy, Army Street, Azzarqa, Jordan
Phone: +962-779989944 | Email: Info@emdadgrp.com | Website: emdadgrp.com
Team: 160+ skilled professionals across design, manufacturing, installation, and project management
Three pillars: Design Innovation — Manufacturing Excellence — Smart Technology Integration

━━━ VISION & MISSION ━━━
Vision: Become a regional leader in smart furniture, intelligent environments, and exhibition infrastructure — recognised for innovation, quality, and reliability.
Mission: Deliver integrated solutions combining design creativity, engineering precision, and smart technologies — enabling clients to achieve impactful, efficient environments.
Values: Innovation (AI & modern tech integration), Quality (highest manufacturing standards), Reliability (on-time delivery), Flexibility (adapts to any project), Client-Centric (tailored solutions).

━━━ FURNITURE COLLECTIONS (123+ designs total) ━━━
1. Master Bedrooms — 27 luxury bedroom sets, classical to ultra-modern. Cover the full spectrum from minimalist platforms to ornate royal suites.
2. Single Bedrooms — 33 contemporary designs for youth rooms, guest rooms, hotel suites. Modern and compact-friendly.
3. Living Rooms — 17 reception and lounge collections. Grand reception sets to cozy modern lounges.
4. Kitchens — 13 designs from minimalist modern to warm traditional wood. Open-plan and closed layouts.
5. Dining Tables — 8 solid wood dining sets, 6-seat to 12-seat. Statement pieces for families.
6. Dressing Rooms — 7 fitted wardrobe and walk-in closet systems. Sliding-door and hinged options.
7. Outdoor & Landscape — 8 weather-resistant collections for terraces, gardens, and patios.
8. TV Units — 10 sleek entertainment centers, floating wall units to full media walls.

━━━ SMART FURNITURE TECHNOLOGY ━━━
EMDAD integrates cutting-edge technology into furniture:
• IoT-enabled environments — furniture connected to your smart home system
• Sensor-activated lighting — motion sensors trigger ambient lighting inside wardrobes, under beds, inside cabinets
• Wireless charging surfaces — built into desks, bedside tables, coffee tables
• Automated hidden compartments — motorized lift systems, TV lift mechanisms
• AI-driven space optimization — layouts designed using AI analysis
• Integration with Alexa, Google Home, and custom mobile apps

━━━ SERVICES BEYOND FURNITURE ━━━
Exhibition Booth Construction:
• Shell scheme and fully custom booths
• Modular, scalable stand systems
• Full branding integration and visual identity
• High-end finishing, on-site installation and dismantling
• Trusted by SOFEX Jordan, international trade shows

Event Infrastructure:
• Master floor planning and zone design
• Stage construction and temporary structures
• Decorative and thematic setups
• Full event execution and management

Electrical & Technical Services:
• Temporary power distribution systems
• Professional lighting design and installation
• Technical wiring and equipment setup
• Load calculations and circuit protection

Carpeting & Flooring:
• Full exhibition carpeting solutions
• Custom flooring layouts and protective systems
• Large venue coverage capability

━━━ PROJECT PROCESS (6 steps) ━━━
1. Consultation & Requirement Analysis — free initial meeting, understand full brief
2. Concept Design & Technical Development — 3D renders, shop drawings, material selection
3. Manufacturing & Fabrication — in-house production, CNC + handcraft
4. Logistics & Transportation — careful delivery to site
5. Installation & On-Site Execution — professional installation team
6. Testing, Handover & Dismantling — quality check, client sign-off, warranty issued

━━━ MAJOR CLIENTS ━━━
Jordan Armed Forces (Arab Army), SOFEX Jordan, KASOTC (King Abdullah Special Operations), European Union Delegation, U.S. Embassy Jordan, Royal Hashemite Court, Ministry of Political Affairs, Jordan River Foundation, Kulluna Jordan Foundation, Jordanian Geographic Center, University of Jordan, JK9 (National K9 Center), Civil Defense Directorate, Royal Medical Services, Royal Naval Force

━━━ WEBSITE TOOLS ━━━
• /collections — Browse all 123 furniture photos, filter by category, save to wishlist
• /analyze — AI Room Analyzer: upload a room photo → instant personalized furniture recommendations
• /quote — Free 4-step quote estimator: no price shown, generates a consultation brief
• /appointment — Book a showroom visit in Zarqa with date/time selection
• /portal — Client project tracking portal: see phase progress, documents, updates
• /wishlist — Save favorite pieces and send a WhatsApp inquiry
• /timeline — Estimate your project delivery timeline
• /ar — EMDAD AR app: visualize furniture in your space (coming soon, iOS & Android)

━━━ PRICING ━━━
EMDAD never provides standard price lists. Every project is priced based on: materials chosen, dimensions, finish quality, quantity, and project complexity. Guide clients to /quote (free estimator) or to contact us directly for a personalized consultation. Material tiers: Standard, Premium, Luxury.

━━━ SHOWROOM ━━━
Physical showroom and factory: Hay AL-Jundy, Army Street, Azzarqa, Jordan. Open Sat–Thu 9AM–6PM. Fridays by appointment. Clients can book visits at /appointment.

━━━ RESPONSE RULES ━━━
- CRITICAL: Keep every response to 2-3 sentences maximum. This is a VOICE conversation — short answers only.
- Match the user's language exactly. Arabic question → Arabic answer. English → English.
- Arabic: use clear Modern Standard Arabic (فصحى).
- Be warm, confident, knowledgeable — like a luxury brand consultant.
- Never quote specific prices. Always say "contact us for a personalized quote" or direct to /quote.
- When relevant, mention one website feature (e.g., "You can browse all our bedroom designs at the Collections page").
- End answers with a subtle helpful suggestion when natural.
- Never say you don't know — use your knowledge to give the best answer.`

// ── Room analyzer prompt ───────────────────────────────────────────────────────
const ROOM_PROMPT = `You are an expert interior design consultant for EMDAD Wooden & Smart Furniture, a premium manufacturer in Zarqa, Jordan.

Analyze this room photo and return personalized furniture recommendations from EMDAD's catalogue.

EMDAD categories:
• Master Bedrooms (ID: master-bedrooms) — 27 luxury bedroom sets
• Single Bedrooms (ID: single-bedrooms) — 33 youth & guest designs
• Living Rooms (ID: living-rooms) — 17 reception & lounge collections
• Kitchens (ID: kitchens) — 13 designs
• Dining Tables (ID: dining-table) — 8 solid wood sets
• Dressing Rooms (ID: dressing-room) — 7 wardrobe systems
• Outdoor (ID: landscape) — 8 outdoor collections
• TV Units (ID: tv-units) — 10 entertainment centers

Respond ONLY with valid JSON, no backticks:
{
  "roomType": "...", "style": "Modern|Classic|Minimalist|Luxury|Contemporary|Traditional",
  "colorPalette": ["#hex1","#hex2","#hex3"], "colorNames": ["name1","name2","name3"],
  "lightLevel": "Low|Medium|High", "roomSize": "Compact|Standard|Spacious",
  "existingStrengths": ["..."], "opportunities": ["..."],
  "recommendations": [{
    "categoryId": "...", "categoryName": "...",
    "reason": "...", "finishSuggestion": "...",
    "urgency": "essential|recommended|optional", "confidence": 0.9
  }],
  "designerNote": "2-3 sentence professional advice."
}`

// ── API call helper ────────────────────────────────────────────────────────────
async function callClaude(body) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': KEY, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify(body)
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error?.message || `API ${res.status}`)
  return data
}

// ── Server ─────────────────────────────────────────────────────────────────────
const server = http.createServer(async (req, res) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  }

  if (req.method === 'OPTIONS') { res.writeHead(200, headers); res.end(); return }
  if (req.method !== 'POST')    { res.writeHead(405, headers); res.end(JSON.stringify({error:'Method not allowed'})); return }

  let body = ''
  req.on('data', c => body += c)
  req.on('end', async () => {
    try {
      const payload = JSON.parse(body)

      // ── CHAT endpoint ──────────────────────────────────────────────────────
      if (req.url === '/chat') {
        const { messages } = payload
        if (!messages?.length) throw new Error('messages required')

        console.log(`💬 Chat: "${messages[messages.length-1].content.slice(0,60)}..."`)

        const data = await callClaude({
          model: 'claude-opus-4-6',
          max_tokens: 300,
          system: EMDAD_SYSTEM,
          messages,
        })
        const reply = data.content?.[0]?.text || ''
        console.log(`   → "${reply.slice(0,60)}..."`)

        res.writeHead(200, headers)
        res.end(JSON.stringify({ reply }))
        return
      }

      // ── ROOM ANALYZE endpoint ──────────────────────────────────────────────
      if (req.url === '/analyze-room') {
        const { imageBase64, mediaType = 'image/jpeg' } = payload
        if (!imageBase64) throw new Error('imageBase64 required')

        console.log('📸 Analyzing room image...')
        const data = await callClaude({
          model: 'claude-opus-4-6',
          max_tokens: 1500,
          messages: [{ role:'user', content: [
            { type:'image', source:{ type:'base64', media_type:mediaType, data:imageBase64 } },
            { type:'text', text: ROOM_PROMPT },
          ]}],
        })
        const text = data.content?.[0]?.text || ''
        const match = text.match(/\{[\s\S]*\}/)
        if (!match) throw new Error('Invalid AI response format')
        const analysis = JSON.parse(match[0])
        console.log(`   ✓ Room: ${analysis.roomType}, ${analysis.recommendations?.length} recommendations`)

        res.writeHead(200, headers)
        res.end(JSON.stringify(analysis))
        return
      }

      res.writeHead(404, headers)
      res.end(JSON.stringify({ error: 'Not found' }))

    } catch (err) {
      console.error('✗', err.message)
      res.writeHead(500, headers)
      res.end(JSON.stringify({ error: err.message }))
    }
  })
})

server.listen(PORT, () => {
  console.log('─────────────────────────────────────────')
  console.log('  EMDAD AI Proxy  →  http://localhost:' + PORT)
  console.log('  /chat           →  Voice Avatar (Claude)')
  console.log('  /analyze-room   →  Room Analyzer (Vision)')
  console.log('  API Key: ✓ Loaded')
  console.log('─────────────────────────────────────────')
  console.log('  Run in a second terminal: npm run dev\n')
})
