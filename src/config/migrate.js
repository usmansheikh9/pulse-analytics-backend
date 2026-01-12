require('dotenv').config()
const { query } = require('./db')

const migrate = async () => {
  console.log('Running migrations...')

  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(20) DEFAULT 'viewer',
      created_at TIMESTAMP DEFAULT NOW()
    )
  `)

  console.log('Migrations complete')
  process.exit(0)
}

migrate().catch(err => {
  console.error('Migration failed:', err.message)
  process.exit(1)
})
