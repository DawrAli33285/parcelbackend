const httpStatus = require('http-status')

module.exports = async (req, res, next) => {
  try {
    return res.status(httpStatus.OK).json({
      id: req.user._id,
      role: req.user.role,
      email: req.user.email,
      name: req.user.name,
      picture: req.user.picture
    })
  } catch (err) {
    return next(err)
  }
}
