const register = require('./register')
const login = require('./login')
const me = require('../info/user')
const verifyEmail = require('./verifyEmail')
const setPassword = require('./setPassword')
const resetPassword = require('./resetPassword')

module.exports = {
  register,
  login,
  me,
  verifyEmail,
  setPassword,
  resetPassword
}
