module.exports = function(app, passport){

  var users = require('../controllers/users');

  app.route('/api/users')
  .get(users.all);

  app.route('/api/users/register')
  .post(users.register);

  app.route('/api/users/activate')
  .get(users.activate);

  app.route('/api/users/resend/code')
  .post(users.resendCode);

  // This route has to go first
  app.route('/api/users/login')
  .post(users.login);

  app.route('/secret')
  .get(passport.authenticate('jwt', { session: false }), function(req, res){
    res.json("Success you can see me");
  });

  app.route('/api/users/:id')
  .get(users.single)
  .post(users.update)
  .delete(users.delete);


}
