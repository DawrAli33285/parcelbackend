const cloudinary = require('cloudinary')

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
})

const uploadAPI = cloudinary.v2.uploader

module.exports = uploadAPI
