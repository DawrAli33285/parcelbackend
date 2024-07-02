const httpStatus = require('http-status')
const Ticket = require('@models/Ticket')
const Address = require('@models/Address')
const Label = require('@models/Label')

module.exports = async (req, res, next) => {
  try {
    const labelMonthlyStats = []
    for (let i = 1; i <= 12; i += 1) {
      labelMonthlyStats.push(
        Label.countDocuments({
          user: req.user._id,
          createdAt: {
            $gte: new Date(new Date().getFullYear(), i - 1, 1),
            $lt: new Date(new Date().getFullYear(), i, 1)
          }
        })
      )
    }

    const stats = {
      addresses: await Address.countDocuments({ user: req.user._id }),
      labels: await Label.countDocuments({ user: req.user._id }),
      tickets: await Ticket.countDocuments({
        user: req.user._id,
        state: 'pending'
      }),
      labelsChart: await Promise.all(labelMonthlyStats)
    }

    return res.status(httpStatus.OK).json(stats)
  } catch (err) {
    return next(err)
  }
}
