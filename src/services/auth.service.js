const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { query } = require('../config/db')
const { AppError } = require('../utils')
const { JWT_DEFAULT_EXPIRY } = require('../config/constants')

function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || JWT_DEFAULT_EXPIRY,
  })
}

const loginUser = async (email, password) => {
  const { rows } = await query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()])
  const user = rows[0]

  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    throw new AppError('Invalid credentials.', 401)
  }

  const token = signToken(user.id)
  const { password_hash, ...safeUser } = user
  return { token, user: safeUser }
}

const updatePassword = async (userId, currentPassword, newPassword) => {
  const { rows } = await query('SELECT password_hash FROM users WHERE id = $1', [userId])
  if (!rows.length) throw new AppError('User not found.', 404)

  const valid = await bcrypt.compare(currentPassword, rows[0].password_hash)
  if (!valid) throw new AppError('Current password is incorrect.', 400)

  const hash = await bcrypt.hash(newPassword, 12)
  await query('UPDATE users SET password_hash = $1 WHERE id = $2', [hash, userId])
}

module.exports = { loginUser, updatePassword }
