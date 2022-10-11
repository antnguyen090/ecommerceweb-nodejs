var express = require('express');
var router = express.Router();

router.use('/', require('./home.route'));


module.exports = router;