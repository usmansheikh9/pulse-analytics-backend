const jwt = require('jsonwebtoken')
const { query } = require('../config/db')
const { AppError } = require('../utils')

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
      return next(new AppError('Not authorized. No token.', 401))
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const { rows } = await query('SELECT id, name, email, role FROM users WHERE id = $1', [decoded.id])
    if (!rows.length) return next(new AppError('User no longer exists.', 401))

    req.user = rows[0]
    next()
  } catch {
    next(new AppError('Token invalid or expired.', 401))
  }
}

const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new AppError(`Role '${req.user.role}' is not authorized.`, 403))
  }
  next()
}

module.exports = { protect, authorize }
