const bcrypt = require('bcryptjs')
const { z } = require('zod')
const User = require('@models/User')
const { signJWT, verifyTurnstileCaptcha } = require('@lib/utils')
const httpStatus = require('http-status')
const {
  PEInvalidCaptcha,
  PEZodBadRequest,
  PEInvalidCredentials,
  PEEmailNotVerified
} = require('@lib/parcelError')

module.exports = async (req, res, next) => {
  try {
    const { success, data, error } = await z
      .object({
        email: z.string().email('is not a valid email'),
        password: z.string().min(8),
        captchaToken: z.string().optional()
      })
      .safeParseAsync(req.body)

    if (!success) {
      return PEZodBadRequest.handler(res, error)
    }

    const isCaptchaValid = await verifyTurnstileCaptcha(data.captchaToken)
    if (!isCaptchaValid) {
      return PEInvalidCaptcha.handler(res)
    }

    const user = await User.findOne({
      email: data.email
    })

    if (!user) {
      return PEInvalidCredentials.handler(res)
    }

    if (!user.emailVerified) {
      return PEEmailNotVerified.handler(res)
    }

    const isPasswordValid = await bcrypt.compare(
      data.password,
      user.password || ''
    )

    if (!isPasswordValid) {
      return PEInvalidCredentials.handler(res)
    }

    const token = signJWT({
      id: user._id
    })

    return res.status(httpStatus.OK).json({
      token
    })
  } catch (err) {
    return next(err)
  }
}
