var router = require('express').Router();

router.use('/v1', require('./api'));

module.exports = router;
