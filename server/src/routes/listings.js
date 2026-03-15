import express from 'express'
import FloorPlan from '../models/Listing.js'

const router = express.Router()

// GET all floor plans with sorting & pagination
router.get('/', async (req, res) => {
  try {
    const { sortBy = 'recent', page = 1, limit = 6 } = req.query
    const skip = (page - 1) * limit

    let sortOptions = {}
    switch (sortBy) {
      case 'overall':
        sortOptions = { 'tacticalAnalysis.overallDefenseGrade': 1 }
        break
      case 'chokePoints':
        sortOptions = { 'tacticalAnalysis.chokePointScore': -1 }
        break
      case 'lootSpawns':
        sortOptions = { 'tacticalAnalysis.lootSpawnScore': -1 }
        break
      case 'flankVulnerability':
        sortOptions = { 'tacticalAnalysis.flankVulnerabilityScore': -1 }
        break
      case 'sightlineAnalysis':
        sortOptions = { 'tacticalAnalysis.sightlineScore': -1 }
        break
      case 'recent':
      default:
        sortOptions = { submittedAt: -1 }
    }

    // Only return floorplans with completed tactical analysis
    const floorPlans = await FloorPlan.find({ status: 'analyzed' })
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))

    const total = await FloorPlan.countDocuments({ status: 'analyzed' })

    res.json({
      floorPlans,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET floor plan by ID
router.get('/:id', async (req, res) => {
  try {
    const floorPlan = await FloorPlan.findById(req.params.id)
    if (!floorPlan) {
      return res.status(404).json({ error: 'Floor plan not found' })
    }
    res.json(floorPlan)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST create floor plan
router.post('/', async (req, res) => {
  try {
    const { address, primaryPrice, floorplanUrl, description, keyFeatures } = req.body

    if (!address || !floorplanUrl) {
      return res.status(400).json({ error: 'Address and floor plan URL required' })
    }

    const floorPlan = new FloorPlan({
      address,
      primaryPrice,
      floorplanUrl,
      description,
      keyFeatures: keyFeatures || [],
      status: 'pending', // Will be 'analyzed' after tactical analysis completes
    })

    await floorPlan.save()
    res.status(201).json(floorPlan)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// POST tactical analysis (would be called after analysis completes)
router.post('/:id/analysis', async (req, res) => {
  try {
    const { tacticalAnalysis } = req.body

    const floorPlan = await FloorPlan.findByIdAndUpdate(
      req.params.id,
      {
        tacticalAnalysis,
        status: 'analyzed',
      },
      { new: true }
    )

    if (!floorPlan) {
      return res.status(404).json({ error: 'Floor plan not found' })
    }

    res.json(floorPlan)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
