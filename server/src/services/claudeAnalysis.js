import Anthropic from '@anthropic-ai/sdk'
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
 * Analyze a floor plan image using Claude Vision API
 * Returns tactical analysis scores and insights
 */
export async function analyzeFloorPlanWithClaude(floorplanUrl, address) {
  try {
    if (!process.env.CLAUDE_API_KEY) {
      throw new Error('CLAUDE_API_KEY not configured in environment variables')
    }

    console.log(`🎮 Analyzing floor plan with Claude Vision for: ${address}`)

    // Download and encode image as base64
    console.log('📥 Downloading floor plan image...')
    const base64Image = await downloadImageAsBase64(floorplanUrl)

    // Initialize Claude client
    const client = new Anthropic({
      apiKey: process.env.CLAUDE_API_KEY,
    })

    const analysisPrompt = `You are analyzing a floor plan image of a property like a competitive gaming map. Provide a comprehensive tactical analysis with detailed reasoning for each metric.

Return ONLY valid JSON (no markdown, no extra text):
{
  "overallDefenseGrade": "A+/A/B+/B/C+/C/D/F",
  "overallDefenseReasoning": "Detailed explanation of why this property received this grade",
  
  "chokePointScore": 75,
  "chokePointExplanation": "Detailed explanation of chokepoint effectiveness and narrow corridors/bottlenecks",
  "defensiblePositions": [
    { "name": "Living Room", "reasoning": "Why this is defensible - sightlines, access points, cover available" },
    { "name": "Master Bedroom", "reasoning": "Why this is defensible" }
  ],
  
  "lootSpawnScore": 82,
  "lootSpawnExplanation": "Detailed explanation of valuable asset zones and their accessibility/security",
  "keyLootZones": [
    { "name": "Kitchen", "reasoning": "Why this is valuable - access to amenities, central location, etc." },
    { "name": "Bathroom", "reasoning": "Why this is valuable" }
  ],
  
  "flankVulnerabilityScore": 45,
  "flankExplanation": "Detailed explanation of flank vulnerabilities and potential bypass routes",
  "highRiskZones": [
    { "name": "Windows facing street", "reasoning": "Why this is high-risk - exposure, visibility from outside, entry points" },
    { "name": "Single exit hallway", "reasoning": "Why this is high-risk" }
  ],
  
  "sightlineScore": 88,
  "sightlineExplanation": "Detailed explanation of surveillance potential and visibility across the property",
  "dominantVantagePoints": [
    { "name": "Master Bedroom window", "reasoning": "Why this provides dominant control - overlooks key areas, good sightlines" },
    { "name": "Living room corner", "reasoning": "Why this is strategically important" }
  ],
  
  "combatSummary": "4-5 sentence comprehensive assessment of the property's tactical value, defensive strengths, vulnerabilities, and overall strategic positioning for gaming purposes",
  
  "gameifiedNarrative": "An engaging 2-3 minute audio briefing script (400-600 words) written in a compelling narrative style. This should appeal to gaming/tactical enthusiasts. Structure it as: (1) Hook - intrigue about this property as a battle location (2) Defensibility overview - stance and positioning potential (3) Key strengths - highlight best defensive positions and tactical advantages (4) Critical vulnerabilities - warn about weak points and flank risks (5) Resource control - where to hold key positions (6) Strategy recommendations - how to win on this map. Make it exciting, use vivid tactical language, and sound natural when read aloud by AI voice. This narrative will be converted to audio for lazy listeners who don't want to read the full report."
}

Analyze the floor plan and provide scores 0-100 for each metric. Include detailed tactical reasoning for every point. For each list item, explain WHY it matters strategically. The explanations will be read by users reviewing the property, so make them informative and tactical. The report should be longer and more detailed to provide full context. The gameifiedNarrative should be compelling, exciting, and appeal to competitive gaming enthusiasts - make them WANT to listen to it and feel like they're getting insider tactical secrets.`

    // Make API call to Claude with vision
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: 'image/jpeg',
                data: base64Image,
              },
            },
            {
              type: 'text',
              text: analysisPrompt,
            },
          ],
        },
      ],
    })

    const responseText = response.content[0].type === 'text' ? response.content[0].text : ''
    console.log('📊 Claude Raw Response:', responseText)

    // Parse the JSON response
    const analysisData = parseClaudeResponse(responseText)

    console.log('✓ Tactical Analysis Complete (Claude Vision):', analysisData)

    return analysisData
  } catch (err) {
    console.error('❌ Claude analysis error:', err.message)
    throw err
  }
}

/**
 * Parse Claude's JSON response, handling markdown code blocks
 */
function parseClaudeResponse(text) {
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
      throw new Error(`Missing fields in Claude response: ${missing.join(', ')}`)
    }

    return analysis
  } catch (err) {
    console.error('Error parsing Claude response:', err.message)
    console.error('Raw response was:', text)
    throw new Error(`Failed to parse Claude analysis: ${err.message}`)
  }
}
