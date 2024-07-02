const User = require('@models/User')

module.exports = async (req, res, next) => {
  try {
    const { token } = req.params
    const user = await User.findOneAndUpdate(
      { emailVerificationToken: token },
      { emailVerified: true, emailVerificationToken: '' }
    )

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    return res.redirect(`${process.env.FRONTEND_URL}/login`)
  } catch (error) {
    return next(error)
  }
}
