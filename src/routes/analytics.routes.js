const express = require('express')
const router = express.Router()
const ctrl = require('../controllers/analytics.controller')
const { protect } = require('../middleware/auth.middleware')

router.use(protect)

router.get('/overview',        ctrl.overview)
router.get('/timeseries',      ctrl.timeSeries)
router.get('/top-pages',       ctrl.topPages)
router.get('/recent-events',   ctrl.recentEvents)
router.get('/traffic-by-page', ctrl.trafficByPage)
router.get('/metrics-history', ctrl.metricsHistory)

module.exports = router
