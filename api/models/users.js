'use strict';
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var schema = mongoose.Schema(
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

schema.plugin(uniqueValidator);
module.exports = mongoose.model('Users', schema);
