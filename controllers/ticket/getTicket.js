const { PEZodBadRequest, PE } = require('@lib/parcelError')
const Ticket = require('@models/Ticket')
const httpStatus = require('http-status')
const { z } = require('zod')

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

    const ticket = await Ticket.findById(data.id)

    if (!ticket) {
      return PE.handler(res, 404)
    }

    return res.status(httpStatus.OK).json(ticket)
  } catch (err) {
    return next(err)
  }
}
