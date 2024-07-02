const axios = require('axios')

const labelAPI = axios.create({
  baseURL: 'https://api.labelaxxess.com/api',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': process.env.LABELAXXESS_API_KEY
  }
})

module.exports = labelAPI
