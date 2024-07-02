const { z } = require('zod')
const User = require('@models/User')
const httpStatus = require('http-status')
const { PEZodBadRequest } = require('@lib/parcelError')

module.exports = async (req, res, next) => {
  try {
    const { success, data, error } = await z
      .object({
        currentEmail: z.string().email(),
        newEmail: z.string().email()
      })
      .safeParseAsync(req.body)

    if (!success) {
      return PEZodBadRequest.handler(res, error)
    }

    await User.findByIdAndUpdate(req.user._id, {
      email: data.newEmail
    })

    return res.status(httpStatus.OK).end()
  } catch (err) {
    return next(err)
  }
}
