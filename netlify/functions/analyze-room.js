// EMDAD AI Room Analyzer — Netlify Serverless Function
// Securely proxies image to Claude Vision API — API key never exposed to browser

const ANALYSIS_PROMPT = `You are an expert interior design consultant for EMDAD Wooden & Smart Furniture, a premium manufacturer in Zarqa, Jordan specializing in wooden and smart furniture.

Carefully analyze this room photo and provide personalized furniture recommendations from EMDAD's catalogue.

EMDAD's available furniture categories:
• Master Bedrooms — 27 luxury bedroom sets (classic to ultra-modern, ID: master-bedrooms)
• Single Bedrooms — 33 contemporary youth and guest room designs (ID: single-bedrooms)
• Living Rooms — 17 reception and lounge collections (ID: living-rooms)
• Kitchens — 13 designs from minimalist modern to traditional wood (ID: kitchens)
• Dining Tables — 8 solid wood dining sets, 6-seat to 12-seat (ID: dining-table)
• Dressing Rooms — 7 fitted wardrobe and walk-in storage systems (ID: dressing-room)
• Outdoor & Landscape — 8 weather-resistant outdoor collections (ID: landscape)
• TV Units — 10 sleek entertainment center designs (ID: tv-units)

Analyze the room for: room type, dominant style, approximate color palette, natural light level, room scale, existing strengths, and specific furniture improvement opportunities.

CRITICAL: Respond ONLY with valid JSON — no markdown backticks, no explanation text, no preamble. Exactly this structure:
{
  "roomType": "Master Bedroom",
  "style": "Modern",
  "colorPalette": ["#F5F0E8", "#C8A96E", "#2C2C2A"],
  "colorNames": ["Warm Ivory", "Oak Tone", "Charcoal"],
  "lightLevel": "High",
  "roomSize": "Spacious",
  "existingStrengths": ["Good natural light from windows", "High ceiling creates grandeur"],
  "opportunities": ["No dedicated dressing storage", "TV wall area underutilized", "Bedside lighting absent"],
  "recommendations": [
    {
      "categoryId": "master-bedrooms",
      "categoryName": "Master Bedrooms",
      "reason": "The room proportions and ceiling height suit our king-size platform bed series. Natural oak finish mirrors your existing warm tones.",
      "finishSuggestion": "Natural Oak with brushed gold hardware",
      "urgency": "essential",
      "confidence": 0.93
    }
  ],
  "designerNote": "2-3 sentences of warm, specific professional advice on how EMDAD can complete this space."
}

urgency values: essential | recommended | optional
confidence: 0.0 to 1.0
style values: Modern | Classic | Minimalist | Luxury | Contemporary | Traditional | Eclectic
lightLevel: Low | Medium | High
roomSize: Compact | Standard | Spacious

If image is not a room interior, set roomType to "Not a Room" and recommendations to [].`

exports.handler = async (event) => {
  // CORS headers for local dev
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) }
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'ANTHROPIC_API_KEY not configured on server' }) }
  }

  let body
  try {
    body = JSON.parse(event.body)
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid request body' }) }
  }

  const { imageBase64, mediaType = 'image/jpeg' } = body
  if (!imageBase64) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'imageBase64 is required' }) }
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-6',
        max_tokens: 1500,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: mediaType, data: imageBase64 },
            },
            { type: 'text', text: ANALYSIS_PROMPT },
          ],
        }],
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('Anthropic API error:', response.status, err)
      return { statusCode: response.status, headers, body: JSON.stringify({ error: `API error: ${response.status}` }) }
    }

    const data = await response.json()
    const rawText = data.content?.[0]?.text || ''

    // Extract JSON robustly
    const jsonMatch = rawText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.error('No JSON in response:', rawText)
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'Invalid response format from AI' }) }
    }

    const analysis = JSON.parse(jsonMatch[0])
    return { statusCode: 200, headers, body: JSON.stringify(analysis) }

  } catch (err) {
    console.error('Function error:', err)
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message || 'Internal error' }) }
  }
}
