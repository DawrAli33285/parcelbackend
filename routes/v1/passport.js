const passport = require('passport')
const passportJWT = require('passport-jwt')

const JwtStrategy = passportJWT.Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy

const { ExtractJwt } = passportJWT
const User = require('@models/User')

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET
    },
    async (jwtPayload, done) => {
      try {
        const user = await User.findById(jwtPayload.id)
        if (!user) {
          return done(null, false)
        }
        return done(null, user)
      } catch (err) {
        return done(err, false)
      }
    }
  )
)

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.G_AUTH_CLIENT_ID,
      clientSecret: process.env.G_AUTH_CLIENT_SECRET,
      callbackURL: `${process.env.FRONTEND_URL}/google/redirect`,
      scope: ['profile', 'email']
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        const currentUser = await User.findOne({ googleId: profile.id })
        if (currentUser) {
          return cb(null, currentUser)
        }
        const existingUser = await User.findOne({
          email: profile.emails[0].value
        })
        if (existingUser) {
          // merge google account with existing account
          existingUser.googleId = profile.id
          existingUser.picture = profile.photos[0].value
          existingUser.name = profile.displayName
          existingUser.emailVerified = true
          await existingUser.save()
          return cb(null, existingUser)
        }
        const newUser = await new User({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          picture: profile.photos[0].value,
          emailVerified: true
        }).save()
        return cb(null, newUser)
      } catch (err) {
        console.error(err)
        return cb(err, false)
      }
    }
  )
)
