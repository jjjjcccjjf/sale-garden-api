require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const config = require('./api/config');
const passport = config.passport;

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/SaleApp');

// Passport Strategy

// Inits: Use body parser, Initialize Passport
app.use(passport.initialize());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

/**********
* routes *
**********/

var usersRoutes = require('./api/routes/users.js')

app.use(function (req, res, next) {
  console.log('Time:', Date.now())
  next()
})

usersRoutes(app, passport);

// 404
app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'})
})

/**********
* /routes *
**********/

app.listen(port);

console.log('Running on port: ' + port);
