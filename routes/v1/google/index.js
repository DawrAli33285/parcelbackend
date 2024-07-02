const express = require('express')
const passport = require('passport')
const { signJWT } = require('@lib/utils')

const router = express.Router()

// Initiate the google authentication process
router.get(
  '/auth',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login`
  })
)

// Last step of the google authentication process
router.get(
  '/login',
  passport.authenticate('google', {
    session: false
  }),
  (req, res) => {
    const token = signJWT({ id: req.user._id })
    res.json({ token })
  }
)

module.exports = router
