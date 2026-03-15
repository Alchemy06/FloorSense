import express from 'express'
import axios from 'axios'
import FloorPlan from '../models/Listing.js'
import { analyzeFloorPlanWithClaude } from '../services/claudeAnalysis.js'
import { generateAudioNarrative } from '../services/texToSpeech.js'

const router = express.Router()

// Configuration for Playwright service
const PLAYWRIGHT_SERVICE_URL = process.env.PLAYWRIGHT_SERVICE_URL || 'http://192.248.158.35:3000'

// POST - Submit a Rightmove URL for analysis
router.post('/from-url', async (req, res) => {
  try {
    const { url, submittedBy } = req.body

    if (!url) {
      return res.status(400).json({ error: 'URL is required' })
    }

    // Validate it's a Rightmove URL
    if (!url.includes('rightmove.co.uk')) {
      return res.status(400).json({ error: 'Must be a valid Rightmove URL' })
    }

    console.log(`📄 Fetching floor plan data for: ${url}`)

    // Call the Playwright microservice
    const playwrightResponse = await axios.post(
      `${PLAYWRIGHT_SERVICE_URL}/get-floorplan`,
      { url },
      { timeout: 30000 } // 30 second timeout
    )

    const scraped = playwrightResponse.data
    
    // Handle nested response structure from Playwright service
    const floorPlanData = scraped.data || scraped
    console.log('🔍 Playwright Service Response:', JSON.stringify(floorPlanData, null, 2))

    // Extract floor plan URL (it's already correctly named in the response)
    const floorPlanUrl = floorPlanData.floorplanUrl

    if (!floorPlanUrl) {
      console.warn('⚠️ No floor plan URL found. Available keys:', Object.keys(floorPlanData))
      return res.status(400).json({
        error: 'No floor plan image found',
        details: 'The Playwright service could not extract a floor plan image from this property',
        availableData: Object.keys(floorPlanData),
      })
    }

    // Create floor plan document with pending status
    const floorPlan = new FloorPlan({
      address: floorPlanData.address || 'Unknown Address',
      primaryPrice: floorPlanData.primaryPrice || floorPlanData.price,
      secondaryPrice: floorPlanData.secondaryPrice,
      description: floorPlanData.description,
      keyFeatures: floorPlanData.keyFeatures || [],
      floorplanUrl: floorPlanUrl,
      status: 'pending', // Will be 'analyzed' after tactical analysis
      submittedBy: submittedBy || 'Anonymous',
      submittedAt: new Date(),
    })

    await floorPlan.save()

    console.log(`✓ Floor plan created with ID: ${floorPlan._id}`)

    // Trigger Gemini analysis in background (don't wait for it)
    analyzeFloorPlanAsync(floorPlan)

    res.status(201).json({
      message: 'Floor plan submitted for analysis',
      floorPlan,
      nextStep: 'Tactical analysis will be generated',
    })
  } catch (err) {
    console.error('Error fetching from Rightmove:', err.message)

    if (err.code === 'ECONNREFUSED') {
      return res.status(503).json({
        error: 'Playwright service unavailable',
        details: 'Cannot connect to floor plan extraction service',
      })
    }

    if (err.response?.status) {
      return res.status(err.response.status).json({
        error: 'Failed to extract floor plan',
        details: err.response.data?.error || err.message,
      })
    }

    res.status(500).json({
      error: 'Failed to process URL',
      details: err.message,
    })
  }
})

/**
 * Async function to analyze floor plan with Claude (runs in background)
 */
async function analyzeFloorPlanAsync(floorPlan) {
  try {
    console.log(`🔄 Starting Claude Vision analysis for ${floorPlan._id}...`)
    const tacticalAnalysis = await analyzeFloorPlanWithClaude(floorPlan.floorplanUrl, floorPlan.address)

    // Update floor plan with analysis and mark as analyzed
    floorPlan.tacticalAnalysis = tacticalAnalysis
    floorPlan.status = 'analyzed'
    await floorPlan.save()

    console.log(`🎉 Floor plan ${floorPlan._id} analysis complete! (Claude Vision)`)
    console.log('📊 Tactical Scores:', {
      overallDefenseGrade: tacticalAnalysis.overallDefenseGrade,
      chokePointScore: tacticalAnalysis.chokePointScore,
      lootSpawnScore: tacticalAnalysis.lootSpawnScore,
      flankVulnerabilityScore: tacticalAnalysis.flankVulnerabilityScore,
      sightlineScore: tacticalAnalysis.sightlineScore,
    })
  } catch (err) {
    console.error(`❌ Claude analysis failed for ${floorPlan._id}:`, err.message)
    // Keep the floor plan in 'pending' state even if analysis fails
  }
}

// POST - Submit a floor plan file for analysis
router.post('/from-file', async (req, res) => {
  try {
    const { address, fileUrl, submittedBy } = req.body

    if (!address) {
      return res.status(400).json({ error: 'Address is required' })
    }

    // Create floor plan document
    const floorPlan = new FloorPlan({
      address,
      floorplanUrl: fileUrl,
      status: 'pending',
      submittedBy: submittedBy || 'Anonymous',
      submittedAt: new Date(),
    })

    await floorPlan.save()

    res.status(201).json({
      message: 'Floor plan submitted for analysis',
      floorPlan,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST - Generate audio narration from narrative text using ElevenLabs
router.post('/text-to-speech', async (req, res) => {
  try {
    const { narrative } = req.body

    if (!narrative || narrative.trim().length === 0) {
      console.log('❌ Missing narrative text in request body')
      return res.status(400).json({ error: 'Narrative text is required' })
    }

    console.log('🎤 Generating audio for narrative (length:', narrative.length, 'chars)...')
    const audioResult = await generateAudioNarrative(narrative)

    console.log('✓ Audio generated successfully, sending to client...')
    res.status(200).json({
      success: true,
      audio: audioResult.audioDataUrl,
      format: audioResult.format,
    })
  } catch (err) {
    console.error('❌ Text-to-speech error:', {
      message: err.message,
      stack: err.stack,
    })
    res.status(500).json({
      error: 'Failed to generate audio',
      details: err.message,
    })
  }
})

export default router
