const httpStatus = require('http-status')

const errorHandler = (err, req, res, next) => {
  if (err) {
    console.error(err)

    if (err.name === 'MongoServerError') {
      if (err.code === 11000) {
        return res.status(httpStatus.BAD_REQUEST).json({
          message: `${Object.keys(err.keyValue)} already exists.`
        })
      }
    }

    return res.status(httpStatus.INTERNAL_SERVER_ERROR).end()
  }

  return next()
}

module.exports = errorHandler
