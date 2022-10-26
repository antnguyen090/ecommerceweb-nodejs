var express = require('express');
var router = express.Router();

router.use('/index', require('./home.route'));
router.use('/trang-chu', require('./home.route'));
router.use('/danh-muc', require('./category.route'));
router.use('/lien-he', require('./contact.route'));
router.use('/', require('./home.route'));

module.exports = router;