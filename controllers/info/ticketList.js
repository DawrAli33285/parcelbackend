const Ticket = require('@models/Ticket')
const httpStatus = require('http-status')

module.exports = async (req, res, next) => {
  try {
    const userTicketList = await Ticket.paginate(
      { user: req.user._id },
      {
        page: req.query.page || 1,
        limit: req.query.limit || 10,
        sort: { createdAt: -1 },
        projection: {
          title: 1,
          state: 1,
          description: { $arrayElemAt: ['$chat.message', 0] }
        }
      }
    )
    return res.status(httpStatus.OK).json(userTicketList)
  } catch (err) {
    return next(err)
  }
}
