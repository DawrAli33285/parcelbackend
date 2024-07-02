const Order = require('@models/Order')
const httpStatus = require('http-status')

module.exports = async (req, res, next) => {
  try {
    const orderList = await Order.paginate(
      {
        user: req.user._id,
        // in last 24 hours
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      },
      {
        page: req.query.page || 1,
        limit: req.query.limit || 10,
        sort: { createdAt: -1 },
        projection: {
          sender: 1,
          _id: 1,
          fulfilled: 1,
          createdAt: 1
        }
      }
    )
    return res.status(httpStatus.OK).json(orderList)
  } catch (err) {
    return next(err)
  }
}
