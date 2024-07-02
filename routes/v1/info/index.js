const express = require('express')

const router = express.Router()
const passport = require('passport')

const controllers = require('@controllers/info')

// middleware
router.use(passport.authenticate('jwt', { session: false }))
// routes
router.get('/me', controllers.userInfo)
router.get('/addressList', controllers.addressList)
router.get('/ticketList', controllers.ticketList)
router.get('/statistics', controllers.statistics)
router.get('/orderList', controllers.orderList)
router.get('/label/:orderID', controllers.label)

module.exports = router
