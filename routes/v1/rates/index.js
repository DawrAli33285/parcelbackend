const express = require('express')

const router = express.Router()
const passport = require('passport')

const controllers = require('@controllers/rates')

// middleware
router.use(passport.authenticate('jwt', { session: false }))
// routes
router.post('/calculate', controllers.calculate)
router.get('/live', controllers.live)

module.exports = router
