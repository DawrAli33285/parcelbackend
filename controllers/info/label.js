const { PEZodBadRequest } = require('@lib/parcelError')
const Label = require('@models/Label')
const httpStatus = require('http-status')
const { z } = require('zod')

module.exports = async (req, res, next) => {
  try {
    const { success, data, error } = await z
      .object({
        orderID: z.string()
      })
      .safeParseAsync(req.params)

    if (!success) {
      return PEZodBadRequest.handler(res, error)
    }

    const label = await Label.findOne({
      user: req.user._id,
      orderID: data.orderID
    })

    if (!label) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: 'Label not found' })
    }

    return res.status(httpStatus.OK).json({ url: label.publicURL })
  } catch (err) {
    return next(err)
  }
}
