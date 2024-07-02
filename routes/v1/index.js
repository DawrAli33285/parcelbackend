const express = require('express')

const router = express.Router()
require('./passport')

// Routes
router.use('/info', require('./info'))
router.use('/users', require('./users'))
router.use('/google', require('./google'))
router.use('/settings', require('./settings'))
router.use('/address', require('./address'))
router.use('/ticket', require('./ticket'))
router.use('/rates', require('./rates'))
router.use('/checkout', require('./checkout'))

module.exports = router
