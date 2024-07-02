const mongoose = require('mongoose')

const { MONGODB_URI } = process.env

if (!MONGODB_URI) {
  throw new Error('Missing environment variable: "MONGODB_URI"')
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose

if (!cached) {
  // eslint-disable-next-line no-multi-assign
  cached = global.mongoose = { conn: null, promise: null }
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then(mng => mng)
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

module.exports = connectDB
