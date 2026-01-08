require('dotenv').config()
const app = require('./app')

const PORT = process.env.PORT || 5001

app.listen(PORT, () => {
  console.log(`Pulse API running on port ${PORT}`)
})

process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err.message)
  process.exit(1)
})
