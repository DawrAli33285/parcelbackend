const express = require('express')

const router = express.Router()
const controllers = require('@controllers/webhook')

// stripe
router.post(
  '/stripe',
  express.raw({ type: 'application/json' }),
  controllers.stripe
)
// cryptomus
router.post(
  '/cryptomus',
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf.toString()
    }
  }),
  controllers.cryptomus
)

module.exports = router
