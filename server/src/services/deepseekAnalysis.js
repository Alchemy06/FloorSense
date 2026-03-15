import axios from 'axios'

/**
 * Download an image from URL and convert to base64
 */
async function downloadImageAsBase64(imageUrl) {
  try {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer', timeout: 10000 })
    const buffer = Buffer.from(response.data, 'binary')
    return buffer.toString('base64')
  } catch (err) {
    console.error('Error downloading image:', err.message)
    throw new Error(`Failed to download floor plan image: ${err.message}`)
  }
}

/**
 * Analyze a floor plan image using DeepSeek Vision API (v3.2)
 * Uses raw API call with proper multimodal format
 * Returns tactical analysis scores and insights
 */
export async function analyzeFloorPlanWithDeepSeek(floorplanUrl, address) {
  try {
    if (!process.env.DEEPSEEK_API_KEY) {
      throw new Error('DEEPSEEK_API_KEY not configured in environment variables')
    }

    console.log(`🎮 Analyzing floor plan with DeepSeek for: ${address}`)

    // Download and encode image as base64
    console.log('📥 Downloading floor plan image...')
    const base64Image = await downloadImageAsBase64(floorplanUrl)

    const analysisPrompt = `You are analyzing a floor plan image of a property like a competitive gaming map. Provide a tactical analysis with the following structure:

Return ONLY valid JSON (no markdown, no extra text):
{
  "overallDefenseGrade": "A+/A/B+/B/C+/C/D/F",
  "chokePointScore": 75,
  "defensiblePositions": ["Living Room", "Master Bedroom"],
  "lootSpawnScore": 82,
  "keyLootZones": ["Kitchen", "Bathroom"],
  "flankVulnerabilityScore": 45,
  "highRiskZones": ["Windows facing street", "Single exit hallway"],
  "sightlineScore": 88,
  "dominantVantagePoints": ["Master Bedroom window", "Living room corner"],
  "combatSummary": "Brief 2-3 sentence assessment of the property's tactical value as a gaming map"
}

Analyze the floor plan and provide scores 0-100 for each metric. Be creative and tactical in your analysis.`

    // Make direct API call to DeepSeek with proper multimodal format
    const response = await axios.post(
      'https://api.deepseek.com/chat/completions',
      {
        model: 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`,
                },
              },
              {
                type: 'text',
                text: analysisPrompt,
              },
            ],
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    )

    const responseText = response.data.choices[0].message.content
    console.log('📊 DeepSeek Raw Response:', responseText)

    // Parse the JSON response
    const analysisData = parseDeepSeekResponse(responseText)

    console.log('✓ Tactical Analysis Complete (DeepSeek):', analysisData)

    return analysisData
  } catch (err) {
    console.error('❌ DeepSeek analysis error:', err.message)
    throw err
  }
}

/**
 * Parse DeepSeek's JSON response, handling markdown code blocks
 */
function parseDeepSeekResponse(text) {
  try {
    // Remove markdown code blocks if present
    let cleanedText = text
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim()

    // Parse JSON
    const analysis = JSON.parse(cleanedText)

    // Validate required fields
    const requiredFields = [
      'overallDefenseGrade',
      'chokePointScore',
      'defensiblePositions',
      'lootSpawnScore',
      'keyLootZones',
      'flankVulnerabilityScore',
      'highRiskZones',
      'sightlineScore',
      'dominantVantagePoints',
      'combatSummary',
    ]

    const missing = requiredFields.filter(f => !(f in analysis))
    if (missing.length > 0) {
      throw new Error(`Missing fields in DeepSeek response: ${missing.join(', ')}`)
    }

    return analysis
  } catch (err) {
    console.error('Error parsing DeepSeek response:', err.message)
    console.error('Raw response was:', text)
    throw new Error(`Failed to parse DeepSeek analysis: ${err.message}`)
  }
}
