const Email = require('@lib/email')
const { PEZodBadRequest } = require('@lib/parcelError')
const { generateToken } = require('@lib/utils')
const User = require('@models/User')
const { z } = require('zod')

module.exports = async (req, res, next) => {
  try {
    const { success, data, error } = await z
      .object({
        email: z.string().email('is not a valid email')
      })
      .safeParseAsync(req.body)

    if (!success) {
      return PEZodBadRequest.handler(res, error)
    }

    const user = await User.findOne({
      email: data.email
    })

    if (!user) {
      return res.status(200).end()
    }

    const token = generateToken()

    await User.updateOne(
      {
        email: data.email
      },
      {
        passwordResetToken: token,
        passwordResetTokenExpires: Date.now() + 3600000 // 1 hour
      }
    )

    await Email.sendPasswordResetEmail(user.email, token)

    return res.status(200).end()
  } catch (error) {
    return next(error)
  }
}
