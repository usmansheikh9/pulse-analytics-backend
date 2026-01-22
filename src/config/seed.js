require('dotenv').config()
const bcrypt = require('bcryptjs')
const { query } = require('./db')
const { EVENT_TYPES, PAGES, USER_AGENTS } = require('./constants')

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const pick = arr => arr[Math.floor(Math.random() * arr.length)]

const seed = async () => {
  console.log('Seeding database...')

  await query('DELETE FROM metrics_snapshots')
  await query('DELETE FROM events')
  await query('DELETE FROM users')

  const hash = await bcrypt.hash('admin123', 12)
  await query(
    'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4)',
    ['Usman Sheikh', 'admin@pulse.io', hash, 'admin']
  )

  const types = Object.values(EVENT_TYPES)
  const now = Date.now()
  const week = 7 * 24 * 60 * 60 * 1000

  for (let i = 0; i < 500; i++) {
    const type = pick(types)
    const path = pick(PAGES)
    const isError = type === 'error'
    const statusCode = isError ? pick([400, 401, 404, 500]) : pick([200, 200, 200, 201, 204])
    const responseTime = isError ? rand(800, 3000) : rand(40, 400)

    await query(
      'INSERT INTO events (type, path, status_code, response_time_ms, user_agent, created_at) VALUES ($1,$2,$3,$4,$5,$6)',
      [type, path, statusCode, responseTime, pick(USER_AGENTS), new Date(now - rand(0, week))]
    )
  }

  for (let i = 0; i < 200; i++) {
    await query(
      'INSERT INTO metrics_snapshots (active_users, requests_per_min, avg_response_time, error_rate, snapshot_at) VALUES ($1,$2,$3,$4,$5)',
      [rand(10, 180), rand(20, 300), rand(50, 500), (rand(0, 800) / 100).toFixed(2), new Date(now - rand(0, 24 * 60 * 60 * 1000))]
    )
  }

  console.log('Seeded 1 user, 500 events, 200 metric snapshots')
  process.exit(0)
}

seed().catch(err => {
  console.error('Seed failed:', err.message)
  process.exit(1)
})
