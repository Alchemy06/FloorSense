import { GoogleGenerativeAI } from '@google/generative-ai'
import axios from 'axios'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

/**
 * Analyze a floor plan image using Gemini Vision API
 * Returns tactical analysis scores and insights
 */
export async function analyzeFloorPlan(floorplanUrl, address) {
  try {
    console.log(`🎮 Analyzing floor plan for: ${address}`)
    
    // Download the image as base64
    const imageData = await downloadImageAsBase64(floorplanUrl)
    
    // Try latest model first (gemini-2.0-flash), fall back to 1.5-flash
    let model
    try {
      model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
      console.log('📱 Using Gemini 2.0 Flash model')
    } catch {
      console.log('📱 Falling back to Gemini 1.5 Flash model')
      model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    }
    
    // Create the prompt for tactical analysis
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

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: 'image/jpeg',
          data: imageData,
        },
      },
      analysisPrompt,
    ])

    const responseText = result.response.text()
    console.log('📊 Gemini Raw Response:', responseText)

    // Parse the JSON response
    const analysisData = parseGeminiResponse(responseText)
    
    console.log('✓ Tactical Analysis Complete:', analysisData)
    
    return analysisData
  } catch (err) {
    console.error('❌ Gemini analysis error:', err.message)
    throw err
  }
}

/**
 * Download an image from URL and convert to base64
 */
async function downloadImageAsBase64(imageUrl) {
  try {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' })
    const buffer = Buffer.from(response.data, 'binary')
    return buffer.toString('base64')
  } catch (err) {
    console.error('Error downloading image:', err.message)
    throw new Error(`Failed to download floor plan image: ${err.message}`)
  }
}

/**
 * Parse Gemini's JSON response, handling markdown code blocks
 */
function parseGeminiResponse(text) {
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
      throw new Error(`Missing fields in Gemini response: ${missing.join(', ')}`)
    }

    return analysis
  } catch (err) {
    console.error('Error parsing Gemini response:', err.message)
    console.error('Raw response was:', text)
    throw new Error(`Failed to parse Gemini analysis: ${err.message}`)
  }
}
