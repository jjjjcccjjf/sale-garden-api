const passport = require('passport');
const router = require('express').Router();
const users = require('../../controllers/users');
const profile = require('../../controllers/profile');

router.get('/users', users.all);

router.post('/users', users.register);
router.get('/users/activate', users.activate);
router.post('/users/resend/code', users.resendCode);
// This route has to go first
router.post('/users/login', users.login);
router.get('/secret', passport.authenticate('jwt', { session: false }), function(req, res){
  res.json("Success you can see me");
});

router.get('/users/:id', users.single);
router.post('/users/:id', users.update);
router.delete('/users/:id', users.delete);

router.get('/profile', passport.authenticate('jwt', { session: false }), profile.get);
router.post('/profile', passport.authenticate('jwt', { session: false }), profile.update);

module.exports = router;
