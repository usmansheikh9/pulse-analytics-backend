class AppError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true
    Error.captureStackTrace(this, this.constructor)
  }
}

const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)

const logger = {
  info:  (...args) => console.log(`[${new Date().toISOString()}] INFO:`, ...args),
  error: (...args) => console.error(`[${new Date().toISOString()}] ERROR:`, ...args),
  warn:  (...args) => console.warn(`[${new Date().toISOString()}] WARN:`, ...args),
}

const sendResponse = (res, statusCode, data, message = 'OK', meta = null) => {
  const payload = { success: true, message, data }
  if (meta) payload.meta = meta
  return res.status(statusCode).json(payload)
}

module.exports = { AppError, asyncHandler, logger, sendResponse }
