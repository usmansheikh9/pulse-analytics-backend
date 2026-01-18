const express = require('express')
const router = express.Router()
const ctrl = require('../controllers/auth.controller')
const { protect } = require('../middleware/auth.middleware')

router.post('/login', ctrl.login)
router.get('/me', protect, ctrl.getMe)
router.patch('/password', protect, ctrl.changePassword)

module.exports = router
