'use strict'

const mongoose = require('mongoose')
const Users = mongoose.model('Users')

exports.all = function (req, res) {
  Users.find({}, function (err, doc) {
    if (err) { res.send(err) }
    res.json(doc)
  })
}

exports.register = function (req, res) {
  var user = new Users(req.body)

  const hash = Users.hashPassword(user.password)
  const activationCode = Users.generateActivationCode()

  Promise.all([activationCode, hash])
  .then(function ([activationCode, hash]) {
    user.activationCode = activationCode
    user.password = hash
    save()
  })
  .catch((err) => {
    if (err) {
      res.status(400).json({message: err.message})
    }
  })

  function save () {
    user.save(function (err, doc) {
      if (err) {
        res.status(400).json(err)
      } else {
        user.sendActivationCode()
        res.status(201).json(doc)
      }
    })
  }
}

exports.single = function (req, res) {
  Users.findById(req.params.id, function (err, doc) {
    if (err) {
      res.status(400).json(err)
    } else {
      res.json(doc)
    }
  })
}

exports.delete = function (req, res) {
  Users.remove({
    _id: req.params.id
  }, function (err, doc) {
    if (err) {
      res.status(400).json(err)
    } else {
      res.status(204).json()
    }
  })
}

exports.update = function (req, res) {
  const params = req.body
  const hashPromise = Users.hashPassword(params.password)

  hashPromise.then(function (hash) {
    params.password = hash
    Users.findOneAndUpdate({ _id: req.params.id }, { $set: params }, { new: true, runValidators: true, context: 'query' }, function (err, doc) {
      if (err) { res.send(err) }
      res.json(doc)
    })
  })
}

exports.activate = function (req, res) {
  Users.findOneAndUpdate(
    { activationCode: req.query.code }, // get the `code` query string
    { $set: { accountStatus: 'active' }, $unset: { activationCode: 1 } }, // We unset activation code from the document
    { new: true },
    function (err, doc) {
      if (err) { res.send(err) }

      if (!doc) { // If there are no documents matching our activation code
        res.send('Not found') // TODO: Add appropriate response headers
      } else {
        res.send('Account activated')
      }
    }
  )
}

exports.resendCode = function (req, res) { // TODO: Make limit 10 min per email
  Users.findOne({email: req.body.email}, function (err, doc) { // @link: https://stackoverflow.com/questions/18214635/what-is-returned-from-mongoose-query-that-finds-no-matches
    if (!doc || doc.activationCode === undefined || err) {
      res.send('Not found') // FIXME
    } else {
      doc.sendActivationCode()
      res.send('Activation code resent')
    }
  })
}

exports.login = function (req, res) {
  Users.findOne({email: req.body.email}, function (err, doc) {
    if (err) { res.send(err) }

    if (!doc) {
      return res.status(401).json({message: 'User doesn\'t exist'})
    }

    const validatePromise = doc.validatePassword(req.body.password)
    validatePromise.then(function (passwordMatch) {
      if (passwordMatch) {
        var token = doc.generateJWT()

        res.json({message: 'ok', token: token})
      } else {
        res.status(401).json({message: 'passwords did not match'})
      }
    })
  })
}
