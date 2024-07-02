const { PEZodBadRequest } = require('@lib/parcelError')
const User = require('@models/User')
const bcrypt = require('bcryptjs')
const { z } = require('zod')

module.exports = async (req, res, next) => {
  try {
    const { token } = req.params
    const user = await User.findOneAndUpdate({
      passwordResetToken: token
    })

    if (!user || user.passwordResetTokenExpires < Date.now()) {
      return res
        .status(400)
        .json({ message: 'Password reset token is invalid or has expired' })
    }

    const { success, data, error } = await z
      .object({
        password: z.string().min(8).max(100)
      })
      .safeParseAsync(req.body)

    if (!success) {
      return PEZodBadRequest.handler(res, error)
    }

    const hashedPassword = await bcrypt.hash(data.password, 10)

    await User.findOneAndUpdate(
      {
        _id: user._id
      },
      {
        password: hashedPassword,
        passwordResetToken: '',
        passwordResetTokenExpires: ''
      }
    )

    return res.status(200).json({ message: 'Password reset' })
  } catch (error) {
    return next(error)
  }
}
