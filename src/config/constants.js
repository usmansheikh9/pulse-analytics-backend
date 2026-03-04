const EVENT_TYPES = {
  PAGEVIEW: 'pageview',
  API_CALL: 'api_call',
  ERROR: 'error',
}

const ROLES = {
  ADMIN: 'admin',
  VIEWER: 'viewer',
}

const RATE_LIMIT = {
  WINDOW_MS: 15 * 60 * 1000,
  MAX_REQUESTS: 200,
}

const SIMULATOR_INTERVAL_MS = 3000

const JWT_DEFAULT_EXPIRY = '7d'

const PAGES = [
  '/dashboard', '/analytics', '/settings', '/login',
  '/api/users', '/api/clients', '/api/stats', '/api/events',
  '/api/auth/login', '/api/auth/register',
]

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/537',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0) Mobile Safari/604',
  'Mozilla/5.0 (Linux; Android 13) Chrome/120 Mobile',
]

module.exports = { EVENT_TYPES, ROLES, RATE_LIMIT, SIMULATOR_INTERVAL_MS, JWT_DEFAULT_EXPIRY, PAGES, USER_AGENTS }
