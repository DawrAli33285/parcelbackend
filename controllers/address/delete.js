const { z } = require('zod')
const Address = require('@models/Address')
const httpStatus = require('http-status')
const { PEZodBadRequest } = require('@lib/parcelError')

module.exports = async (req, res, next) => {
  try {
    const { success, data, error } = await z
      .object({
        id: z.string().length(24)
      })
      .safeParseAsync(req.body)

    if (!success) {
      return PEZodBadRequest.handler(res, error)
    }

    await Address.findOneAndDelete({ _id: data.id, user: req.user._id });

    return res.status(httpStatus.OK).end();
  } catch (err) {
    return next(err)
  }
}
