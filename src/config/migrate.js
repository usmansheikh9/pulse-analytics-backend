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

  await query(`
    CREATE TABLE IF NOT EXISTS events (
      id SERIAL PRIMARY KEY,
      type VARCHAR(20) NOT NULL,
      path VARCHAR(255) NOT NULL,
      status_code INT NOT NULL,
      response_time_ms INT NOT NULL,
      user_agent VARCHAR(255),
      created_at TIMESTAMP DEFAULT NOW()
    )
  `)

  await query(`
    CREATE TABLE IF NOT EXISTS metrics_snapshots (
      id SERIAL PRIMARY KEY,
      active_users INT NOT NULL,
      requests_per_min INT NOT NULL,
      avg_response_time INT NOT NULL,
      error_rate NUMERIC(5,2) NOT NULL,
      snapshot_at TIMESTAMP DEFAULT NOW()
    )
  `)

  await query(`CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at DESC)`)
  await query(`CREATE INDEX IF NOT EXISTS idx_events_type ON events(type)`)
  await query(`CREATE INDEX IF NOT EXISTS idx_metrics_snapshot_at ON metrics_snapshots(snapshot_at DESC)`)

  console.log('Migrations complete')
  process.exit(0)
}

migrate().catch(err => {
  console.error('Migration failed:', err.message)
  process.exit(1)
})
