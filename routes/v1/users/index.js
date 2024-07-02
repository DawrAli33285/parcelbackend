const express = require('express')

const router = express.Router()
const controllers = require('@controllers/users')

/* GET main */
router.post('/register', controllers.register)
router.post('/login', controllers.login)
router.get('/verify-email/:token', controllers.verifyEmail)
router.post('/reset-password', controllers.resetPassword)
router.post('/set-password/:token', controllers.setPassword)

module.exports = router
