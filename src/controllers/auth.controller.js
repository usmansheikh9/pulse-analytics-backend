const { loginUser, updatePassword } = require('../services/auth.service')
const { asyncHandler, sendResponse } = require('../utils')

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  const result = await loginUser(email, password)
  sendResponse(res, 200, result, 'Login successful')
})

exports.getMe = asyncHandler(async (req, res) => {
  sendResponse(res, 200, req.user)
})

exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body
  await updatePassword(req.user.id, currentPassword, newPassword)
  sendResponse(res, 200, null, 'Password updated successfully')
})
