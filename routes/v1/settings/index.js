const express = require('express')
const passport = require('passport')

const router = express.Router()
const controllers = require('@controllers/settings')

router.use(passport.authenticate('jwt', { session: false }))
/* GET main */
router.post('/updatePassword', controllers.updatePassword)
router.post('/updateEmail', controllers.updateEmail)

module.exports = router
