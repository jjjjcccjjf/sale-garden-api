var jwt = require('jsonwebtoken');
var passport = require("passport");
var passportJWT = require("passport-jwt");
var mongoose = require('mongoose');
var Users = mongoose.model('Users');

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

const jwtOptions = {
  jwtFromRequest : ExtractJwt.fromAuthHeaderWithScheme('bearer'),
  secretOrKey : process.env.SECRET_OR_KEY
};

const strategy = new JwtStrategy(jwtOptions, function(jwtPayload, next) {
  console.log('payload received', jwtPayload);
  Users.findById(jwtPayload.id, function(err, doc) {
    if (err) { res.send(err); }
    if (doc) {
      next(null, doc);
    } else {
      next(null, false);
    }
  });
});

passport.use(strategy);
