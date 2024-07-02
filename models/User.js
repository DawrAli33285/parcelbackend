const mongoose = require('mongoose')

const { Schema } = mongoose

const UserSchema = new Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  emailVerificationToken: {
    type: String
  },
  passwordResetToken: {
    type: String
  },
  passwordResetTokenExpires: {
    type: Date
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  password: {
    type: String
  },
  googleId: {
    type: String
  },
  name: {
    type: String
  },
  picture: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('User', UserSchema)
