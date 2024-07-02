const { z } = require('zod')
const httpStatus = require('http-status')
const { PEZodBadRequest } = require('@lib/parcelError')
const Ticket = require('@models/Ticket')

module.exports = async (req, res, next) => {
  try {
    const { success, data, error } = await z
      .object({
        id: z.string(), // ticket id
        message: z.string()
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
        $push: {
          chat: {
            message: data.message,
            sender: 'user',
            sentAt: new Date()
          }
        }
      }
    )

    return res.status(httpStatus.OK).json({})
  } catch (err) {
    return next(err)
  }
}
