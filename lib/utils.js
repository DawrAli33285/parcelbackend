const axios = require('axios')
const jwt = require('jsonwebtoken')
const uuid = require('uuid')

function signJWT(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' })
}

async function verifyTurnstileCaptcha(token) {
  // Skip captcha verification in development
  if (process.env.NODE_ENV === 'development') return true
  return true

  // const formData = new FormData()
  // formData.append('secret', process.env.TURNSTILE_SECRET)
  // formData.append('response', token)

  // const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
  // const response = await axios.post(url, formData)
  // return response.data.success
}

function convertToOz(weight, unit) {
  switch (unit) {
    case 'kg':
      return (weight * 35.274).toFixed(0) || 1
    case 'lb':
      return (weight * 16).toFixed(0) || 1
    case 'gr':
      return (weight * 0.035274).toFixed(0) || 1
    default:
      return weight
  }
}

function generateToken() {
  return uuid.v4()
}

function getTodaysDate() {
  const date = new Date()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const year = date.getFullYear()
  return `${month}/${day}/${year}`
}

function convertOzToLb(oz) {
  return (oz / 16).toFixed(0)
}

module.exports = {
  signJWT,
  verifyTurnstileCaptcha,
  convertToOz,
  generateToken,
  getTodaysDate,
  convertOzToLb
}
