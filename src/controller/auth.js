const { ExtractJwt, Strategy } = require('passport-jwt');
const passport = require('passport');

const { getUser } = require('./users');

// Create our strategy
const jwtStrategy = opts =>
  new Strategy(opts, (jwtPayload, done) =>
    getUser(jwtPayload)
      .then(user => {
        if (user) {
          done(null, user);
        } else {
          done(null, false);
        }
        return null;
      })
      .catch(err => done(err, false))
  );

// Init passport with our jwt strategy
const initAuth = () => {
  const opts = {};
  opts.secretOrKey = process.env.JWT_SECRET;
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
  passport.use(jwtStrategy(opts));
};

// Create a middleware to check authentication
const isAuthenticated = (req, res, next) =>
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(new Error('UNAUTHORIZED USER'));
    }
    req.user = user;
    return next();
  })(req, res, next);

module.exports = {
  isAuthenticated,
  initAuth,
};
