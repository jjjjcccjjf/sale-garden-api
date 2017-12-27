'use strict';

var mongoose = require('mongoose'),
Users = mongoose.model('Users');

exports.all = function(req, res) {
  Users.find({}, function(err, users) {
    if (err) res.send(err);
    res.json(users);
  });
};

exports.add = function(req, res) {
  var _new = new Users(formatFields(req.body))

  _new.save(function(err, users) {
    if (err) res.send(err);
    res.json(users);
  });
};

exports.single = function(req, res) {
  Users.findById(req.params.userId, function(err, users) {
    if (err) res.send(err);
    res.json(users);
  });
};

exports.update = function(req, res) {
  Users.findOneAndUpdate({_id: req.params.id}, formatFields(req.body), {new: true}, function(err, users) {
    if (err) res.send(err);
    res.json(users);
  });
};

exports.delete = function(req, res) {
  Users.remove({
    _id: req.params.userId
  }, function(err, users) {
    if (err) res.send(err);
    res.json({ message: 'Users successfully deleted' }); //Todo make 201
  });
};

var formatFields = function(unformatted){

  var formatted = {}
  formatted.name = {
    "first" : unformatted.fname,
    "last" : unformatted.lname
  };
  formatted.email = unformatted.email
  formatted.password = unformatted.password

  return formatted;
}
