module.exports = function(app){
  var users = require('../controllers/users');

  app.route('/api/users')
  .get(users.all);

  app.route('/api/users/register')
  .post(users.add);

  app.route('/api/users/:id')
  .get(users.single)
  .post(users.update)
  .delete(users.delete);
}
