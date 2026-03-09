const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const hpp = require('hpp')
require('dotenv').config()

const { RATE_LIMIT } = require('./config/constants')
const { logger } = require('./utils')

const app = express()

app.use(helmet())
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}))
app.use(hpp())
app.use(express.json({ limit: '10kb' }))

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

const limiter = rateLimit({
  windowMs: RATE_LIMIT.WINDOW_MS,
  max: RATE_LIMIT.MAX_REQUESTS,
  message: { success: false, message: 'Too many requests.' },
})
app.use('/api/', limiter)

app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/analytics', require('./routes/analytics.routes'))

app.get('/api/health', (req, res) => res.json({ success: true, message: 'Pulse API running' }))

app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }))

app.use(function errorHandler(err, req, res, next) {
  if (err.code === '23505') {
    return res.status(409).json({ success: false, message: 'Resource already exists.' })
  }

  const statusCode = err.statusCode || 500
  const message = err.isOperational ? err.message : 'Something went wrong'

  if (!err.isOperational) {
    logger.error('Programmer error:', err)
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
})

module.exports = app
