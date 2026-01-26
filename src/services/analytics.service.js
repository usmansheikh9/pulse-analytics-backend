const { query } = require('../config/db')

const getOverview = async () => {
  const { rows: snap } = await query(`
    SELECT active_users, requests_per_min, avg_response_time, error_rate
    FROM metrics_snapshots
    ORDER BY snapshot_at DESC
    LIMIT 1
  `)

  const { rows: total } = await query(`
    SELECT COUNT(*) AS total FROM events
    WHERE created_at >= NOW() - INTERVAL '24 hours'
  `)

  const { rows: errors } = await query(`
    SELECT COUNT(*) AS total FROM events
    WHERE type = 'error' AND created_at >= NOW() - INTERVAL '24 hours'
  `)

  return {
    ...(snap[0] || { active_users: 0, requests_per_min: 0, avg_response_time: 0, error_rate: 0 }),
    total_events_24h: parseInt(total[0]?.total || 0),
    errors_24h: parseInt(errors[0]?.total || 0),
  }
}

const getTimeSeries = async (hours = 24) => {
  const { rows } = await query(`
    SELECT
      DATE_TRUNC('hour', created_at) AS hour,
      COUNT(*) AS requests,
      AVG(response_time_ms)::INT AS avg_response,
      COUNT(*) FILTER (WHERE type = 'error') AS errors
    FROM events
    WHERE created_at >= NOW() - ($1 || ' hours')::INTERVAL
    GROUP BY hour
    ORDER BY hour ASC
  `, [hours])
  return rows
}

const getTopPages = async (limit = 10) => {
  const { rows } = await query(`
    SELECT
      path,
      COUNT(*) AS visits,
      AVG(response_time_ms)::INT AS avg_response_time,
      COUNT(*) FILTER (WHERE type = 'error') AS errors
    FROM events
    WHERE created_at >= NOW() - INTERVAL '24 hours'
    GROUP BY path
    ORDER BY visits DESC
    LIMIT $1
  `, [limit])
  return rows
}

const getRecentEvents = async (limit = 50) => {
  const { rows } = await query(`
    SELECT id, type, path, status_code, response_time_ms, created_at
    FROM events
    ORDER BY created_at DESC
    LIMIT $1
  `, [limit])
  return rows
}

const getTrafficByPage = async (hours = 24) => {
  const { rows } = await query(`
    SELECT path, COUNT(*) AS visits
    FROM events
    WHERE created_at >= NOW() - ($1 || ' hours')::INTERVAL
    GROUP BY path
    ORDER BY visits DESC
    LIMIT 8
  `, [hours])
  return rows
}

const getMetricsHistory = async (minutes = 30) => {
  const { rows } = await query(`
    SELECT active_users, requests_per_min, avg_response_time, error_rate, snapshot_at
    FROM metrics_snapshots
    WHERE snapshot_at >= NOW() - ($1 || ' minutes')::INTERVAL
    ORDER BY snapshot_at ASC
  `, [minutes])
  return rows
}

module.exports = { getOverview, getTimeSeries, getTopPages, getRecentEvents, getTrafficByPage, getMetricsHistory }
