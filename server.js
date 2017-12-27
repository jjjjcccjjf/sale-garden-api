require('dotenv').config();

var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Users = require('./api/models/users');

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/SaleApp');

// Use body parser
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

usersRoutes(app);

// 404
app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'})
})

/**********
* /routes *
**********/

app.listen(port);

console.log('Running on port: ' + port);
