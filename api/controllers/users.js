'use strict';

var mongoose = require('mongoose');
const nodemailer = require('nodemailer');
var Users = mongoose.model('Users');

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

    /**
    * email block goes here
    */

    nodemailer.createTestAccount((err, account) => {

      // create reusable transporter object using the default SMTP transport
      const transporter = nodemailer.createTransport({
        host: 'mail.smtp2go.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      // setup email data with unicode symbols
      let mailOptions = {
        from: 'lorenzosalamante@gmail.com', // sender address
        to: 'lorenzosalamante@gmail.com', // list of receivers
        subject: 'Activate your account ENV', // Subject line
        html: '<a href="http://localhost:3000/users/activate/?code=' + users.activationCode + '">Activate your account</a>' // html body
      };

      // send mail with defined transport object
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        }
      });
    });

    /**
    * email block goes here
    */

    res.json(users);
  });
};

exports.single = function(req, res) {
  Users.findById(req.params.id, function(err, users) {
    if (err) res.send(err);
    res.json(users);
  });
};

exports.delete = function(req, res) {
  Users.remove({
    _id: req.params.id
  }, function(err, users) {
    if (err) res.send(err);
    res.json({ message: 'Users successfully deleted' }); //Todo make 201
  });
};

exports.update = function(req, res) {
  Users.findOneAndUpdate({_id: req.params.id}, formatFields(req.body), {new: true}, function(err, users) {
    if (err) res.send(err);
    res.json(users);
  });
};


/**
* format the request body to appropriate format
* @param  {obj} unformatted raw req.body
* @return {obj}             [description]
*/
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
