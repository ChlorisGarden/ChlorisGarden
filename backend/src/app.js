require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')
const rateLimit = require('express-rate-limit')

const authRoutes = require('./routes/auth')
const classifyRoutes = require('./routes/classify')
const diseaseRoutes = require('./routes/disease')
const dashboardRoutes = require('./routes/dashboard')

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(express.json())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))

// Rate Limiting
// General endpoint
// Max: 100 req / 15 Minutes
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Terlalu banyak request. Coba lagi dalam 15 menit.' },
  standardHeaders: true,
  legacyHeaders: false,
})

// Classification Endpoint
// Max: 20 req / 1 Minute / IP
const classifyLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { message: 'Terlalu banyak request klasifikasi. Coba lagi dalam 1 menit.' },
  standardHeaders: true,
  legacyHeaders: false,
})

// Auth Endpoint
// Max: 20 req / 15 Minutes / IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: 'Terlalu banyak percobaan. Coba lagi dalam 15 menit.' },
  standardHeaders: true,
  legacyHeaders: false,
})

app.use(generalLimiter)
app.use('/auth', authLimiter)
app.use('/api/classify', classifyLimiter)

// Routes
app.use('/auth', authRoutes)
app.use('/api/classify', classifyRoutes)
app.use('/api/diseases', diseaseRoutes)
app.use('/api/dashboard', dashboardRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'WORKED!' })
})

// Multer error handler
app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'Ukuran file terlalu besar. Maksimal 5MB.' })
  }
  if (err.message?.includes('Format file tidak didukung')) {
    return res.status(400).json({ message: err.message })
  }
  console.error(err.stack)
  return res.status(500).json({ message: 'Terjadi kesalahan server.' })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})