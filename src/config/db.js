const { Pool } = require('pg')
const { logger } = require('../utils')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
})

pool.on('error', err => {
  logger.error('Unexpected DB pool error:', err.message)
})

const query = (text, params) => pool.query(text, params)

module.exports = { pool, query }
