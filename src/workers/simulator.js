const { query } = require('../config/db')
const { EVENT_TYPES, PAGES, USER_AGENTS, SIMULATOR_INTERVAL_MS } = require('../config/constants')
const { logger } = require('../utils')

const pick = arr => arr[Math.floor(Math.random() * arr.length)]
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

let activeUsers = rand(20, 80)
let io = null

async function generateEvent() {
  // errors are rare — ~8% of traffic
  const type = Math.random() < 0.08 ? EVENT_TYPES.ERROR : pick([EVENT_TYPES.PAGEVIEW, EVENT_TYPES.API_CALL])
  const path = pick(PAGES)
  const isError = type === EVENT_TYPES.ERROR
  const statusCode = isError ? pick([400, 404, 500, 503]) : pick([200, 200, 201, 204])
  const responseTime = isError ? rand(600, 3000) : rand(30, 350)

  const { rows } = await query(
    'INSERT INTO events (type, path, status_code, response_time_ms, user_agent) VALUES ($1,$2,$3,$4,$5) RETURNING *',
    [type, path, statusCode, responseTime, pick(USER_AGENTS)]
  )

  return rows[0]
}

async function generateMetricsSnapshot(requestsThisCycle) {
  activeUsers = Math.max(5, Math.min(200, activeUsers + rand(-5, 5)))

  const { rows: recent } = await query(`
    SELECT
      COUNT(*) AS total,
      COUNT(*) FILTER (WHERE type = 'error') AS errors,
      AVG(response_time_ms)::INT AS avg_rt
    FROM events
    WHERE created_at >= NOW() - INTERVAL '1 minute'
  `)

  const total = parseInt(recent[0]?.total || 0)
  const errors = parseInt(recent[0]?.errors || 0)
  const errorRate = total > 0 ? ((errors / total) * 100).toFixed(2) : '0.00'

  const { rows } = await query(
    'INSERT INTO metrics_snapshots (active_users, requests_per_min, avg_response_time, error_rate) VALUES ($1,$2,$3,$4) RETURNING *',
    [activeUsers, requestsThisCycle * 20, recent[0]?.avg_rt || 120, errorRate]
  )

  return rows[0]
}

function startSimulator(socketIo) {
  io = socketIo
  logger.info('Simulator started')

  let cycleCount = 0

  setInterval(async () => {
    try {
      const count = rand(1, 3)
      const events = []
      for (let i = 0; i < count; i++) {
        events.push(await generateEvent())
      }
      cycleCount += count

      let snapshot = null
      // snapshot every ~3 ticks (≈9 seconds) to avoid hammering the db
      if (cycleCount >= 3) {
        snapshot = await generateMetricsSnapshot(cycleCount)
        cycleCount = 0
      }

      if (io) {
        io.emit('new_events', events)
        if (snapshot) io.emit('metrics_update', snapshot)
      }
    } catch (err) {
      logger.error('Simulator error:', err.message)
    }
  }, SIMULATOR_INTERVAL_MS)
}

module.exports = { startSimulator }
