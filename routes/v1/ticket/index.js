const express = require('express')
const passport = require('passport')

const router = express.Router()
const controllers = require('@controllers/ticket')

// middleware
router.use(passport.authenticate('jwt', { session: false }))
// routes
router.post('/create', controllers.create)
router.post('/mark-resolved', controllers.markResolved)
router.post('/message', controllers.message)
router.post('/getTicket', controllers.getTicket)

module.exports = router
