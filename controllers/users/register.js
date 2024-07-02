const bcrypt = require('bcryptjs')
const { z } = require('zod')
const User = require('@models/User')
const { verifyTurnstileCaptcha, generateToken } = require('@lib/utils')
const httpStatus = require('http-status')
const { PEInvalidCaptcha, PEZodBadRequest } = require('@lib/parcelError')
const Email = require('@lib/email')

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

    const existingUser = await User.findOne({ email: data.email })

    if (existingUser) {
      return res.status(httpStatus.CONFLICT).json({
        message: 'User with this email already exists.'
      })
    }

    const hashedPassword = await bcrypt.hash(data.password, 10)

    const emailVerificationToken = generateToken()

    const newUser = await new User({
      email: data.email,
      password: hashedPassword,
      emailVerificationToken
    }).save()

    await Email.sendVerificationEmail(
      newUser.email,
      newUser.emailVerificationToken
    )

    return res.status(httpStatus.CREATED).json({
      message: 'User registered successfully. Please verify your email.'
    })
  } catch (error) {
    return next(error)
  }
}
