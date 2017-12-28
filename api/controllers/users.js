'use strict';

var crypto = require('crypto');
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
var Users = mongoose.model('Users');

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

exports.all = function(req, res) {
  Users.find({}, function(err, doc) {
    if (err) { res.send(err); }
    res.json(doc);
  });
};

exports.register = function(req, res) {
  var _new = new Users(req.body)

  _new.activationCode = crypto.randomBytes(30).toString('hex'); // Generate activation code here, not on the schema!!

  _new.save(function(err, doc) {
    if (err){
      res.send(err);
    }
    else {
      /** email block goes here */

      // setup email data with unicode symbols
      let mailOptions = {
        from: 'lorenzosalamante@gmail.com', // sender address
        to: doc.email, // list of receivers
        subject: 'Activate your account', // Subject line
        html: '<a href="http://localhost:3000/api/users/activate/?code=' + doc.activationCode + '">Activate your account</a>' // html body FIXME
      };

      // send mail with defined transport object
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          // REVIEW: Delete if fail???
        }
      });

      /** email block goes here */
    }

    res.json(doc);
  });
};

exports.single = function(req, res) {
  Users.findById(req.params.id, function(err, doc) {
    if (err) { res.send(err); }
    res.json(doc);
  });
};

exports.delete = function(req, res) {
  Users.remove({
    _id: req.params.id
  }, function(err, doc) {
    if (err) { res.send(err); }
    res.json({ message: 'User successfully deleted' }); //Todo make 201
  });
};

exports.update = function(req, res) {
  Users.findOneAndUpdate({ _id: req.params.id }, { $set: req.body }, { new: true, runValidators: true, context: 'query' }, function(err, doc) {
    if (err) { res.send(err); }
    res.json(doc);
  });
};

exports.activate = function(req, res) {
  Users.findOneAndUpdate(
    {
      activationCode: req.query.code // get the `code` query string
    },
    {
      $set: { accountStatus: 'active' },
      $unset: { activationCode: 1 } // We unset activation code from the document
    },
    {
      new: true
    },
    function(err, doc) {
      if (err){ res.send(err); }

      if(doc === null){ // If there are no documents matching our activation code
        res.send('Not found'); //TODO: Add appropriate response headers
      }else{
        res.send('Account activated');
      }
    }
  );
};

exports.resendCode = function(req, res){ // TODO: Make limit 10 min per email
  Users.findOne({email: req.body.email}, function(err, doc) { // @link: https://stackoverflow.com/questions/18214635/what-is-returned-from-mongoose-query-that-finds-no-matches
    if (!doc || doc.activationCode === undefined ){ res.send("Not found"); } //FIXME
    else{
      /** email block goes here */
      // setup email data with unicode symbols
      let mailOptions = {
        from: 'lorenzosalamante@gmail.com', // sender address
        to: doc.email, // list of receivers
        subject: 'Activate your account', // Subject line
        html: '<a href="http://localhost:3000/api/users/activate/?code=' + doc.activationCode + '">Activate your account</a>' // html body FIXME
      };

      // send mail with defined transport object
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          // REVIEW: Delete if fail???
        }
      });

      /** email block goes here */
      res.send("Activation code resent");
    }

  });
};
