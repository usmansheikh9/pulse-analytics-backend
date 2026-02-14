const analytics = require('../services/analytics.service')
const { asyncHandler, sendResponse } = require('../utils')

exports.overview       = asyncHandler(async (req, res) => sendResponse(res, 200, await analytics.getOverview()))
exports.timeSeries     = asyncHandler(async (req, res) => sendResponse(res, 200, await analytics.getTimeSeries(req.query.hours || 24)))
exports.topPages       = asyncHandler(async (req, res) => sendResponse(res, 200, await analytics.getTopPages(req.query.limit || 10)))
exports.recentEvents   = asyncHandler(async (req, res) => sendResponse(res, 200, await analytics.getRecentEvents(req.query.limit || 50)))
exports.trafficByPage  = asyncHandler(async (req, res) => sendResponse(res, 200, await analytics.getTrafficByPage(req.query.hours || 24)))
exports.metricsHistory = asyncHandler(async (req, res) => sendResponse(res, 200, await analytics.getMetricsHistory(req.query.minutes || 30)))
