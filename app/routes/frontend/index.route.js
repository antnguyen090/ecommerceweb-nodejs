var express = require('express');
var router = express.Router();

const middlewareListProductionOption = require(__path_middleware + 'get-list-production-option')
const middlewareListCategory = require(__path_middleware + 'get-list-category')
const middlewareListMenu = require(__path_middleware + 'get-list-menu')
const middlewareSettingPage= require(__path_middleware + 'get-setting-page')
const middlewareListCoupon= require(__path_middleware + 'get-list-coupon')
const middlewareAuth     = require(__path_middleware + 'auth')
const middlewareGetUser    = require(__path_middleware + 'get-user-info')

router.use('/', middlewareListProductionOption, 
                middlewareListCategory,
                middlewareListMenu,
                middlewareSettingPage,
                middlewareListCoupon,
                middlewareGetUser,
                require('./home.route'));
router.use('/tat-ca-cay', require('./allproduct.route'));
router.use('/xem-nhanh', require('./viewproduct.route'));
router.use('/trang-loi', require('./error.route'));
router.use('/yeu-thich', require('./love.route'));
router.use('/gio-hang', require('./cart.route'));
router.use('/lien-he', require('./contact.route'));
router.use('/ve-chung-toi', require('./aboutus.route'));
router.use('/dang-ky', require('./register.route'));
router.use('/dang-nhap', require('./login.route'));
router.use('/lay-lai-mat-khau', require('./forgotpassword.route'));
router.use('/trang-ca-nhan',middlewareAuth, require('./profile.route'));
router.use('/dang-xuat', require('./logout.route'));

module.exports = router;