'use strict';

const mongoose = require('mongoose');
const Users = mongoose.model('Users');


exports.get = function(req, res) {
  res.json(req.user); // Format the fields
};

exports.update = function(req, res) {
  var params = req.body;
  params.password = Users.hashPassword(params.password);

  Users.findOneAndUpdate({ _id: req.user.id }, { $set: params }, { new: true, runValidators: true, context: 'query' }, function(err, doc) {
    if (err) { res.send(err); }
    res.json(doc);
  });
};
