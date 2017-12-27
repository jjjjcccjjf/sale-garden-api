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
      enum: ['active', 'deactivated', 'awaiting confirmation'],
      default: 'awaiting confirmation'
    },
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Users', schema);
