'use strict'

// Require the dev-dependencies
const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../app')

const mongoose = require('mongoose')
const Users = mongoose.model('Users')

chai.should()

chai.use(chaiHttp)

describe('Users', () => {
  before(function (done) {
    Users.remove({}, (err) => {
      if (err) console.error(err)
      done()
    })
  })

  describe('/GET users', () => {
    it('it should GET all the users', (done) => {
      chai.request(app)
      .get('/v1/users')
      .end((err, res) => {
        if (err) { console.error(err) }
        res.should.have.status(200)
        res.body.should.be.a('array')
        // res.body.length.should.be.eql(0)
        done()
      })
    })
  })

  describe('/POST users', () => {
    it('it should register a user', (done) => {
      chai.request(app)
      .post('/v1/users')
      .type('form')
      .send({ email: 'test@gmail.com', password: 'password', name: 'Jason Bourne' })
      .end((err, res) => {
        if (err) { console.error(err) }
        res.should.have.status(201)
        res.body.should.be.a('object')
        // res.body.length.should.be.eql(0)
        done()
      })
    })

    it('it should NOT register a duplicate user', (done) => {
      chai.request(app)
      .post('/v1/users')
      .type('form')
      .send({ email: 'test@gmail.com', password: 'password', name: 'Jason Bourne' })
      .end((err, res) => {
        if (err) {
          res.should.have.status(400)
          res.body.should.be.a('object')
          res.body.should.have.property('message').to.include('expected `email` to be unique')
          // res.body.length.should.be.eql(0)
          done()
        }
      })
    })

    it('it should NOT allow a password of less than 8 characters', (done) => {
      chai.request(app)
      .post('/v1/users')
      .type('form')
      .send({ email: 'test@gmail.com', password: 'passwor', name: 'Jason Bourne' })
      .end((err, res) => {
        if (err) {
          res.should.have.status(400)
          res.body.should.be.a('object')
          res.body.should.have.property('message').to.include('at least 8 characters')
          done()
        }
      })
    })

    it('it should NOT allow empty required fields', (done) => {
      chai.request(app)
      .post('/v1/users')
      .end((err, res) => {
        if (err) {
          res.should.have.status(400)
          res.body.should.be.a('object')
          res.body.should.have.property('message').to.include('Path `email` is required')
          res.body.should.have.property('message').to.include('Path `name` is required')
          res.body.should.have.property('message').to.include('Path `password` is required')
          done()
        }
      })
    })
  })
})
