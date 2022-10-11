var express = require('express');
var router = express.Router();

router.use('/dashboard', require('./dashboard.route'));
router.use('/category', require('./category.route'));
router.use('/product', require('./product.route'));
// router.use('/menubar', require('./menubar'));
// router.use('/setting', require('./setting'));
// router.use('/wheather', require('./wheather'));
// router.use('/contact', require('./contact'));
// router.use('/manageuser', require('./manageuser'));
// router.use('/managegroup', require('./managegroup'));
router.use('/', require('./dashboard.route'));

module.exports = router;