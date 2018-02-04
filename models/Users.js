'use strict'
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: 'mail.smtp2go.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

const schema = mongoose.Schema(
  {
    name: {
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
        validator: function (v) {
          return /^[a-zA-Z0-9_]*$/.test(v) // @link: https://stackoverflow.com/a/336220/7800523
        },
        message: 'The username field only allows alphanumeric characters and undescores'
      }
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
      type: String
    }
  },
  {
    timestamps: true
  }
)

schema.statics.hashPassword = function (password) { // @link: https://stackoverflow.com/questions/29664499/mongoose-static-methods-vs-instance-methods
  return new Promise(
    (resolve, reject) => {
      if (password === undefined) {
        resolve('') // return empty string upon blank password field
      } else if (password.length < 8) {
        reject(new Error('Path `password` should be at least 8 characters'))
      } else {
        resolve(bcrypt.hash(password, 10))
      }
    }
  )
}

schema.methods.validatePassword = function (password) {
  return bcrypt.compare(password, this.password)
}

schema.statics.generateActivationCode = function () {
  const code = crypto.randomBytes(30).toString('hex')
  return Promise.resolve(code)
}

schema.methods.generateJWT = function () {
  return jwt.sign(
    {
      id: this._id,
      iat: Date.now()
      // exp: Math.floor(Date.now() / 1000) + (60 * 60) // Make expiration 1 hour TODO: Add expiration to tokens
    },
    process.env.SECRET_OR_KEY
  ) // REVIEW: JWT Standards
}

schema.methods.sendActivationCode = function () {
  let mailOptions = { // setup email data with unicode symbols
    from: process.env.FROM_EMAIL, // sender address FIXME
    to: this.email, // list of receivers
    subject: 'Activate your account', // Subject line
    html: '<a href="http://localhost:3000/v1/users/activate/?code=' + this.activationCode + '">Activate your account</a>' // html body FIXME: Base url
  }
  transporter.sendMail(mailOptions, (error, info) => { if (error) { console.error(error) } }) // send mail with defined transport object
}

schema.plugin(uniqueValidator)
mongoose.model('Users', schema)
