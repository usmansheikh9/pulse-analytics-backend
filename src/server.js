const http = require('http')
const { Server } = require('socket.io')
const app = require('./app')
const { logger } = require('./utils')
const { startSimulator } = require('./workers/simulator')

const PORT = process.env.PORT || 5001

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
})

io.on('connection', (socket) => {
  logger.info(`Socket connected: ${socket.id}`)
  socket.on('disconnect', () => logger.info(`Socket disconnected: ${socket.id}`))
})

server.listen(PORT, () => {
  logger.info(`Pulse API running on port ${PORT}`)
  startSimulator(io)
})

process.on('unhandledRejection', (err) => {
  logger.error('Unhandled rejection:', err.message)
  server.close(() => process.exit(1))
})
