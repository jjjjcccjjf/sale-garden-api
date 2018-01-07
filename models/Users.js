'use strict';
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const crypto = require('crypto');
const bcrypt = require('bcrypt-nodejs');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

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

const schema = mongoose.Schema(
  {
    name:  {
      type: String,
      trim: true,
      required: true
    },
    email: {
      type: String,
      trim: true,
      required: true,
      lowercase: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    username: {
      type: String,
      trim: true,
      unique: true,
      sparse: true, // @link: https://stackoverflow.com/questions/24430220/e11000-duplicate-key-error-index-in-mongodb-mongoose
      validate: {
        validator: function(v) {
          return /^[a-zA-Z0-9_]*$/.test(v); // @link: https://stackoverflow.com/a/336220/7800523
        },
        message: 'The username field only allows alphanumeric characters and undescores'
      },
    },
    addresses: [{ label: String, coord: String }],
    avatar: String, // TODO: Gravatar
    accountStatus: {
      type: String,
      enum: [
        'active', // OK
        'inactive', // Banned or smthng
        'pending' // Needs to activate via email A.K.A. Newly registered
      ],
      default: 'pending'
    },
    activationCode: {
      type: String,
    },
  },
  {
    timestamps: true
  }
);

schema.statics.hashPassword = function(password) { // @link: https://stackoverflow.com/questions/29664499/mongoose-static-methods-vs-instance-methods
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

schema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

schema.methods.generateActivationCode = function(code) {
  return crypto.randomBytes(30).toString('hex');
};

schema.methods.generateJWT = function() {
  return jwt.sign({id: this._id}, process.env.SECRETORKEY); //REVIEW: JWT Standards
};

schema.methods.sendActivationCode = function() {
  let mailOptions = { // setup email data with unicode symbols
    from: 'lorenzosalamante@gmail.com', // sender address FIXME
    to: this.email, // list of receivers
    subject: 'Activate your account', // Subject line
    html: '<a href="http://localhost:3000/v1/users/activate/?code=' + this.activationCode + '">Activate your account</a>' // html body FIXME
  };
  transporter.sendMail(mailOptions, (error, info) => { if (error) { console.log(error); } }); // send mail with defined transport object
};

schema.plugin(uniqueValidator);
mongoose.model('Users', schema);
