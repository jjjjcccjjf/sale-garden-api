var jwt = require('jsonwebtoken');

var passport = require("passport");
var passportJWT = require("passport-jwt");

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

exports.jwt = jwt;
exports.passportJWT = passportJWT;
exports.ExtractJwt = ExtractJwt;
exports.JwtStrategy = JwtStrategy;


exports.jwtOptions = {
  jwtFromRequest : ExtractJwt.fromAuthHeaderWithScheme('jwt'),
  secretOrKey : 'tasmanianDevil'
};

var Users = require('../models/users'); // Only call this after everything else is done so YOU don't overwrite exports!!

exports.strategy = new JwtStrategy(this.jwtOptions, function(jwt_payload, next) {
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

passport.use(this.strategy);

exports.passport = passport;
