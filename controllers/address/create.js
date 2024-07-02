const { z } = require('zod')
const Address = require('@models/Address')
const httpStatus = require('http-status')
const { PEZodBadRequest } = require('@lib/parcelError')

module.exports = async (req, res, next) => {
  try {
    const { success, data, error } = await z
      .object({
        country: z.string(),
        address: z.string(),
        city: z.string(),
        zip: z.string(),
        state: z.string()
      })
      .safeParseAsync(req.body)

    if (!success) {
      return PEZodBadRequest.handler(res, error)
    }

    const address = await new Address({
      ...data,
      user: req.user._id
    }).save()

    return res.status(httpStatus.OK).json({ address })
  } catch (err) {
    return next(err)
  }
}
