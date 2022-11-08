var express = require('express');
var router = express.Router();

const middlewareAuthAdmin     = require(__path_middleware + 'auth-admin')
const middlewareGetUser    = require(__path_middleware + 'get-user-info')
const middlewareSettingPage= require(__path_middleware + 'get-setting-page')

router.use('/', middlewareSettingPage, middlewareGetUser, middlewareAuthAdmin, require('./dashboard.route'));
router.use('/dashboard', require('./dashboard.route'));
router.use('/category', require('./category.route'));
router.use('/product', require('./product.route'));
router.use('/menubar', require('./menubar.route'));
router.use('/setting', require('./setting.route'));
router.use('/wheather', require('./wheather.route'));
router.use('/contact', require('./contact.route'));
router.use('/manageuser', require('./manageuser.route'));
router.use('/managegroup', require('./managegroup.route'));
router.use('/blogarticle', require('.//blogarticle.route'));
router.use('/blogcategory', require('./blogcategory.route'));
router.use('/slider', require('./slider.route'));
router.use('/coupon', require('./coupon.route'));
router.use('/discount', require('./discount.route'));
router.use('/newsletter', require('./newsletter.route'));
router.use('/delivery', require('./delivery.route'));

module.exports = router;