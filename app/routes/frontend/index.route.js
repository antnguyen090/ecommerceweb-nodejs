var express = require('express');
var router = express.Router();

const middlewareListProductionOption = require(__path_middleware + 'get-list-production-option')
const middlewareListCategory = require(__path_middleware + 'get-list-category')
const middlewareListMenu = require(__path_middleware + 'get-list-menu')
const middlewareSettingPage= require(__path_middleware + 'get-setting-page')
const middlewareListCoupon= require(__path_middleware + 'get-list-coupon')
const middlewareAuth     = require(__path_middleware + 'auth')

router.use('/', middlewareListProductionOption, 
                middlewareListCategory,
                middlewareListMenu,
                middlewareSettingPage,
                middlewareListCoupon,
                middlewareAuth,
                require('./home.route'));
router.use('/index', require('./home.route'));
router.use('/trang-chu', require('./home.route'));
router.use('/lien-he', require('./contact.route'));
router.use('/ve-chung-toi', require('./aboutus.route'));
router.use('/dang-ky', require('./register.route'));
router.use('/dang-nhap', require('./login.route'));

module.exports = router;