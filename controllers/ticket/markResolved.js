const { z } = require('zod')
const httpStatus = require('http-status')
const { PEZodBadRequest } = require('@lib/parcelError')
const Ticket = require('@models/Ticket')

module.exports = async (req, res, next) => {
  try {
    const { success, data, error } = await z
      .object({
        id: z.string()
      })
      .safeParseAsync(req.body)

    if (!success) {
      return PEZodBadRequest.handler(res, error)
    }

    await Ticket.findOneAndUpdate(
      {
        _id: data.id,
        state: 'pending',
        user: req.user._id
      },
      {
        state: 'resolved'
      }
    )

    return res.status(httpStatus.OK).json({})
  } catch (err) {
    return next(err)
  }
}
