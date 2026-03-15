import mongoose from 'mongoose'

// Schema for position/zone items that can be either strings or objects with reasoning
const positionItemSchema = new mongoose.Schema({
  _id: false,
  name: String,
  reasoning: String,
})

const tacticalAnalysisSchema = new mongoose.Schema({
  overallDefenseGrade: String,
  overallDefenseReasoning: String,
  
  chokePointScore: {
    type: Number,
    min: 0,
    max: 100,
  },
  chokePointExplanation: String,
  defensiblePositions: [
    new mongoose.Schema({
      _id: false,
      name: String,
      reasoning: String,
    }, { strict: false })
  ],
  
  lootSpawnScore: {
    type: Number,
    min: 0,
    max: 100,
  },
  lootSpawnExplanation: String,
  keyLootZones: [
    new mongoose.Schema({
      _id: false,
      name: String,
      reasoning: String,
    }, { strict: false })
  ],
  
  flankVulnerabilityScore: {
    type: Number,
    min: 0,
    max: 100,
  },
  flankExplanation: String,
  highRiskZones: [
    new mongoose.Schema({
      _id: false,
      name: String,
      reasoning: String,
    }, { strict: false })
  ],
  
  sightlineScore: {
    type: Number,
    min: 0,
    max: 100,
  },
  sightlineExplanation: String,
  dominantVantagePoints: [
    new mongoose.Schema({
      _id: false,
      name: String,
      reasoning: String,
    }, { strict: false })
  ],
  
  combatSummary: String,
  gameifiedNarrative: String,
})

const floorPlanSchema = new mongoose.Schema(
  {
    address: String,
    primaryPrice: String,
    secondaryPrice: String,
    description: String,
    keyFeatures: [String],
    floorplanUrl: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'analyzed', 'archived'],
      default: 'pending',
    },
    tacticalAnalysis: tacticalAnalysisSchema,
    submittedBy: String,
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
)

export default mongoose.model('FloorPlan', floorPlanSchema)
