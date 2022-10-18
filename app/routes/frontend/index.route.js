var express = require('express');
var router = express.Router();

router.use('/index', require('./home.route'));
router.use('/', require('./home.route'));



module.exports = router;