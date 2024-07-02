const { z } = require('zod')
const bcrypt = require('bcryptjs')
const User = require('@models/User')
const httpStatus = require('http-status')
const { PEZodBadRequest, PEInvalidPassword } = require('@lib/parcelError')

module.exports = async (req, res, next) => {
  try {
    const { success, data, error } = await z
      .object({
        currentPassword: z.string().min(8),
        newPassword: z.string().min(8)
      })
      .safeParseAsync(req.body)

    if (!success) {
      return PEZodBadRequest.handler(res, error)
    }

    const isMatch = await bcrypt.compare(data.currentPassword, req.user.password)
    if (!isMatch) {
      return PEInvalidPassword.handler(res)
    }

    const hashedPassword = await bcrypt.hash(data.newPassword, 10)

    await User.findByIdAndUpdate(req.user._id, {
      password: hashedPassword
    })

    return res.status(httpStatus.OK).end()
  } catch (err) {
    return next(err)
  }
}
