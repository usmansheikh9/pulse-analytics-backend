require('dotenv').config()
const bcrypt = require('bcryptjs')
const { query } = require('./db')
const { EVENT_TYPES, PAGES, USER_AGENTS } = require('./constants')
const { logger } = require('../utils')

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const pick = arr => arr[Math.floor(Math.random() * arr.length)]

// square distribution so events cluster toward the present, tapering off over 7 days
function recentTimestamp(maxAgeMs) {
  const u = Math.random()
  return new Date(Date.now() - maxAgeMs * u * u)
}

async function seed() {
  logger.info('Seeding database...')

  await query('DELETE FROM metrics_snapshots')
  await query('DELETE FROM events')
  await query('DELETE FROM users')

  const hash = await bcrypt.hash('admin123', 12)
  await query(
    'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4)',
    ['Usman Sheikh', 'admin@pulse.io', hash, 'admin']
  )

  // pageviews dominate; errors are rare
  const typeWeights = [
    ...Array(12).fill(EVENT_TYPES.PAGEVIEW),
    ...Array(6).fill(EVENT_TYPES.API_CALL),
    ...Array(2).fill(EVENT_TYPES.ERROR),
  ]

  const weekMs = 7 * 24 * 60 * 60 * 1000

  for (let i = 0; i < 500; i++) {
    const type = pick(typeWeights)
    const path = pick(PAGES)
    const isError = type === EVENT_TYPES.ERROR
    const statusCode = isError ? pick([400, 401, 404, 500]) : pick([200, 200, 200, 201, 204])
    const responseTime = isError ? rand(800, 3000) : rand(40, 400)

    await query(
      'INSERT INTO events (type, path, status_code, response_time_ms, user_agent, created_at) VALUES ($1,$2,$3,$4,$5,$6)',
      [type, path, statusCode, responseTime, pick(USER_AGENTS), recentTimestamp(weekMs)]
    )
  }

  const dayMs = 24 * 60 * 60 * 1000

  for (let i = 0; i < 200; i++) {
    await query(
      'INSERT INTO metrics_snapshots (active_users, requests_per_min, avg_response_time, error_rate, snapshot_at) VALUES ($1,$2,$3,$4,$5)',
      [rand(10, 180), rand(20, 300), rand(50, 500), (rand(0, 800) / 100).toFixed(2), recentTimestamp(dayMs)]
    )
  }

  logger.info('Seeded 1 user, 500 events, 200 metric snapshots')
  logger.info('Demo login: admin@pulse.io / admin123')
  process.exit(0)
}

seed().catch(err => {
  logger.error('Seed failed:', err.message)
  process.exit(1)
})
