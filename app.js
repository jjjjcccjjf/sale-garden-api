require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const app = express()

mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/SaleApp')

// Inits: Use body parser, Initialize Passport
// app.use(passport.initialize())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

require('./models/Users')
require('./config/passport')

app.use(function (req, res, next) {
  // console.log('Time:', Date.now())
  next()
})

app.use(require('./routes'))

app.use(function (req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'})
})

// finally, let's start our server...
app.listen(process.env.PORT || 3000, function () {
  // console.log('Listening on port ' + server.address().port)
})

module.exports = app
