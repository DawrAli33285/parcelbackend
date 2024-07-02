const httpStatus = require('http-status')

module.exports = {
  PEZodBadRequest: {
    handler: (res, error) =>
      res.status(httpStatus.BAD_REQUEST).json({
        message: `${error.issues[0]?.path[0]?.toUpperCase() || ''} ${error.issues[0].message.toLowerCase()}`
      })
  },
  PEInvalidCaptcha: {
    handler: res =>
      res.status(httpStatus.BAD_REQUEST).json({
        message: `Invalid captcha token`
      })
  },
  PEInvalidCredentials: {
    handler: res =>
      res.status(httpStatus.UNAUTHORIZED).json({
        message: `Invalid credentials`
      })
  },
  PEEmailNotVerified: {
    handler: res =>
      res.status(httpStatus.UNAUTHORIZED).json({
        message: `Email not verified. Please, check your email for the verification link.`
      })
  },
  PE: {
    handler: (res, status) =>
      res.status(status).json({
        message: httpStatus[status]
      })
  }
}
