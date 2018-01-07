var jwt = require('jsonwebtoken');
var passport = require("passport");
var passportJWT = require("passport-jwt");
var mongoose = require('mongoose');
var Users = mongoose.model('Users');

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

const jwtOptions = {
  jwtFromRequest : ExtractJwt.fromAuthHeaderWithScheme('bearer'),
  secretOrKey : process.env.SECRETORKEY
};

const strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
  console.log('payload received', jwt_payload);
  Users.findById(jwt_payload.id, function(err, doc) {
    if (err) { res.send(err); }
    if (doc) {
      next(null, doc);
    } else {
      next(null, false);
    }
  });
});

passport.use(strategy);

// module.exports = passport;
