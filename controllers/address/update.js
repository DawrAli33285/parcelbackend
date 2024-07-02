const { z } = require('zod')
const Address = require('@models/Address')
const httpStatus = require('http-status')
const { PEZodBadRequest } = require('@lib/parcelError')

module.exports = async (req, res, next) => {
  try {
    const { success, data, error } = await z
      .object({
        id: z.string(),
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

    const { id, ...payload } = data
    const address = await Address.findByIdAndUpdate(id, payload)

    return res.status(httpStatus.OK).json(address)
  } catch (err) {
    return next(err)
  }
}
