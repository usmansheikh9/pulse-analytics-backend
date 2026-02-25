const express = require('express')
const router = express.Router()
const ctrl = require('../controllers/auth.controller')
const { protect } = require('../middleware/auth.middleware')
const { loginRules, changePasswordRules } = require('../middleware/validate.middleware')

router.post('/login', loginRules, ctrl.login)
router.get('/me', protect, ctrl.getMe)
router.patch('/password', protect, changePasswordRules, ctrl.changePassword)

module.exports = router
