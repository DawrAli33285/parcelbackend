const express = require('express')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const path = require('path')
const mongoose = require('mongoose')
const debug = require('debug')('backend:db')
const connectDB = require('@lib/connectDBVercel')
const cors = require('cors')

const router = express.Router()

// Middlewares
if (process.env.VERCEL === 1) {
  router.use('/api/v1/*', async (req, res, next) => {
    try {
      await connectDB()
    } catch (error) {
      console.log(error)
      return res
        .status(500)
        .json({
          errors: [{ name: 'Error', message: 'Database connection error' }]
        })
    }
    return next()
  })
} else {
  mongoose.connect(process.env.MONGODB_URI).then(() => {
    debug('Connected to MongoDB')
  })
}
router.use(cors())
router.use(logger('dev'))
router.use(express.json())
router.use(express.urlencoded({ extended: false }))
router.use(cookieParser())
router.use(express.static(path.join(__dirname, 'public')))

module.exports = router
