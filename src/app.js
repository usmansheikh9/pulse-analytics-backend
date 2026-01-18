const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
require('dotenv').config()

const app = express()

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }))
app.use(express.json({ limit: '10kb' }))
app.use(morgan('dev'))

app.use('/api/auth', require('./routes/auth.routes'))

app.get('/api/health', (req, res) => res.json({ success: true, message: 'Pulse API running' }))

app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }))

app.use((err, req, res, next) => {
  const status = err.statusCode || 500
  const message = err.isOperational ? err.message : 'Something went wrong'
  res.status(status).json({ success: false, message })
})

module.exports = app
