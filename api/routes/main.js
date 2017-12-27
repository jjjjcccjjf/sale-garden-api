module.exports = function(app) {
  var users = require('../controllers/users');

  app.use(function (req, res, next) {
    console.log('Time:', Date.now())
    next()
  })

  app.route('/api/users')
  .get(users.all)
  .post(users.add);

  app.route('/api/users/:userId')
  .get(users.single)
  .post(users.update)
  .delete(users.delete);

  // 404
  app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + ' not found'})
  })
};
