const express = require('express')
const passport = require('passport')

const router = express.Router()
const controllers  = require('@controllers/address')

// middleware
router.use(passport.authenticate('jwt', { session: false }))
// routes
router.post('/create', controllers.create)
router.post('/update', controllers.update)
router.post('/delete', controllers.deleteAddress)

module.exports = router
