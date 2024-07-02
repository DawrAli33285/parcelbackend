const Address = require('@models/Address')
const httpStatus = require('http-status')

module.exports = async (req, res, next) => {
  try {
    const userAddressList = await Address.paginate(
      { user: req.user._id },
      {
        page: req.query.page || 1,
        limit: req.query.limit || 10,
        sort: { createdAt: -1 }
      }
    )
    return res.status(httpStatus.OK).json(userAddressList)
  } catch (err) {
    return next(err)
  }
}
