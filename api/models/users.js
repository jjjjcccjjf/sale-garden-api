'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema(
  {
    name:{
      first: String,
      last: String
    },
    email: String,
    username: String,
    password: String,
    addresses: [{ label: String, coord: String }],
    avatar: String,
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
      default:
      /**
      * Returns a random string
      * @url: https://stackoverflow.com/a/1349426/7800523
      * @return {string} random string
      */
      function(){
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 75; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
      }
    },
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Users', schema);
