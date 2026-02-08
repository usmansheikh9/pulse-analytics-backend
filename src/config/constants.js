const EVENT_TYPES = {
  PAGEVIEW: 'pageview',
  API_CALL: 'api_call',
  ERROR: 'error',
}

const ROLES = {
  ADMIN: 'admin',
  VIEWER: 'viewer',
}

const SIMULATOR_INTERVAL_MS = 3000

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

module.exports = { EVENT_TYPES, ROLES, SIMULATOR_INTERVAL_MS, PAGES, USER_AGENTS }
