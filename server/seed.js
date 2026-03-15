import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

// Define the schema inline for this script
const tacticalAnalysisSchema = new mongoose.Schema({
  overallDefenseGrade: String,
  chokePointScore: Number,
  defensiblePositions: [String],
  lootSpawnScore: Number,
  keyLootZones: [String],
  flankVulnerabilityScore: Number,
  highRiskZones: [String],
  sightlineScore: Number,
  dominantVantagePoints: [String],
  combatSummary: String,
})

const floorPlanSchema = new mongoose.Schema({
  address: String,
  primaryPrice: String,
  secondaryPrice: String,
  description: String,
  keyFeatures: [String],
  floorplanUrl: String,
  status: String,
  tacticalAnalysis: tacticalAnalysisSchema,
  submittedBy: String,
  submittedAt: Date,
})

const FloorPlan = mongoose.model('FloorPlan', floorPlanSchema)

const sampleData = {
  address: '42 Tactical Lane, London UK',
  primaryPrice: '450000',
  secondaryPrice: '425000',
  description: 'Modern 2-bedroom apartment with excellent tactical positioning in central London. Open floor plan with multiple entry/exit points.',
  keyFeatures: ['2 Bedrooms', 'Open Kitchen', 'Balcony Access', 'Hallway Control', 'Multiple Windows'],
  floorplanUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
  status: 'analyzed',
  tacticalAnalysis: {
    overallDefenseGrade: 'B+',
    chokePointScore: 85,
    defensiblePositions: [
      'Kitchen counter for elevated position',
      'Bedroom corner for secondary defense',
      'Hallway junction for choke point control',
      'Balcony for external vantage'
    ],
    lootSpawnScore: 72,
    keyLootZones: [
      'Kitchen cabinets and drawers',
      'Bedroom wardrobes',
      'Living room shelving',
      'Bathroom storage'
    ],
    flankVulnerabilityScore: 68,
    highRiskZones: [
      'Living room (exposed windows)',
      'Balcony (exterior visibility)',
      'Main entrance corridor'
    ],
    sightlineScore: 82,
    dominantVantagePoints: [
      'Kitchen counter overlooking living area',
      'Master bedroom corner window',
      'Hallway intersection (central control)',
      'Balcony for external overview'
    ],
    combatSummary: 'This property offers strong defensive positioning with good choke point control. The open floor plan provides excellent sightlines while the segmented bedrooms offer retreat options. Moderate flank vulnerability due to multiple windows, but excellent tactical balance overall. Recommended for competitive analysis.'
  },
  submittedBy: 'SeedBot',
  submittedAt: new Date()
}

async function seed() {
  try {
    console.log('🔌 Connecting to MongoDB...')
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✓ Connected to MongoDB')

    // Clear existing data (optional - comment out to keep existing data)
    // await FloorPlan.deleteMany({})
    // console.log('✓ Cleared existing floor plans')

    // Add sample data
    const floorPlan = new FloorPlan(sampleData)
    await floorPlan.save()
    console.log('✓ Floor plan added successfully!')
    console.log(`  ID: ${floorPlan._id}`)
    console.log(`  Address: ${floorPlan.address}`)
    console.log(`  Grade: ${floorPlan.tacticalAnalysis.overallDefenseGrade}`)
    
    // Show a few more listings
    const count = await FloorPlan.countDocuments()
    console.log(`\n📊 Total floor plans in database: ${count}`)

    await mongoose.connection.close()
    console.log('✓ Database connection closed')
    process.exit(0)
  } catch (err) {
    console.error('❌ Error:', err.message)
    process.exit(1)
  }
}

seed()
