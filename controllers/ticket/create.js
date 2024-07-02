const { z } = require('zod')
const Ticket = require('@models/Ticket')
const httpStatus = require('http-status')
const { PEZodBadRequest } = require('@lib/parcelError')

module.exports = async (req, res, next) => {
  try {
    const { success, data, error } = await z
      .object({
        priority: z.string().refine((v) => ['low', 'medium', 'high'].includes(v), {
          message: 'Invalid priority'
        }),
        title: z.string().min(1).max(100),
        message: z.string().min(1).max(500)
      })
      .safeParseAsync(req.body)

    if (!success) {
      return PEZodBadRequest.handler(res, error)
    }

    const { message, ...payload } = data

    const ticket = await new Ticket({
      ...payload,
      state: 'pending',
      chat: [{
        message,
        sender: 'user',
        sentAt: new Date()
      }],
      user: req.user._id
    }).save()

    return res.status(httpStatus.OK).json(ticket)
  } catch (err) {
    return next(err)
  }
}
