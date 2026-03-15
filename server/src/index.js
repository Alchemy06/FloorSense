import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import path from 'path'
import { fileURLToPath } from 'url'

import listingsRouter from './routes/listings.js'
import uploadRouter from './routes/upload.js'
import submitRouter from './routes/submit.js'

dotenv.config()

const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✓ MongoDB connected')
  } catch (err) {
    console.error('✗ MongoDB connection error:', err)
    process.exit(1)
  }
}

connectDB()

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// Routes
app.use('/api/floorplans', listingsRouter)
app.use('/api/submit', submitRouter)
app.use('/api/upload', uploadRouter)

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Internal Server Error' })
})

// Start Server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`)
})
