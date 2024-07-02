const express = require('express')

const router = express.Router()
const passport = require('passport')

const controllers = require('@controllers/checkout')

// middleware
router.use(passport.authenticate('jwt', { session: false }))
// routes
router.post('/stripe', controllers.stripe)
router.post('/cryptomus', controllers.cryptomus)

module.exports = router
