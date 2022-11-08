var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const layout	     = __path_views_frontend + 'frontend';
const { body, validationResult } = require('express-validator');
const notify = require(__path_configs + 'notify');
var util = require('util')
const passport = require('passport')

const serviceManageUser = require(__path_services_backend + `manageuser.service`);
const StringHelpers 	= require(__path_helpers + 'string');
const mainName = "forgotpassword"
const pageTitle= 'Lấy Lại Mật Khẩu'
const folderView = __path_views_frontend + `pages/${mainName}/`;
const folderViewLogin = __path_views_frontend + `pages/login/`;

const FrontEndHelpers = require(__path_helpers + 'frontend');
const linkIndex		= StringHelpers.formatLink('/');
const linkLogin		= StringHelpers.formatLink('/dang-nhap'); 
const linkPersonal		= StringHelpers.formatLink('/trang-ca-nhan');
const linkForgotPassword		= StringHelpers.formatLink('/lay-lai-mat-khau');

/* GET home page. */
router.get('/', async function(req, res, next) {
    try {
    if(req.isAuthenticated()) {
        res.redirect(linkPersonal);
        return
    } else{
        let error = []
        let userLogin = {}
        res.render(`${folderView}forgotpassword`, {
            pageTitle,
            layout,
            userLogin,
            error: error,
         });
    }        
    } catch (error) {
        console.log(error)
        res.redirect(linkLogin)
    }
    
});

router.post('/gui-ma-otp',
        body('email')
            .isEmail()
            .normalizeEmail()
            .withMessage(notify.ERROR_REGISTER_EMAIL),
        async function(req, res, next) {
            try {
            if(req.isAuthenticated()) res.redirect(linkIndex);
            let userLogin = req.body
            let errors = validationResult(req)
            let checkExitEmail = await serviceManageUser.checkExitEmail(userLogin.email)
            if(checkExitEmail.hasOwnProperty('error') && errors.errors.length == 0){
                errors.errors.push({
                        msg: checkExitEmail.error,
                        param: 'loginuser'
                    })
            }
            if(!errors.isEmpty()) {
                res.render(`${folderView}forgotpassword`, {
                userLogin,
                pageTitle,
                layout,
                error: errors.errors,
                }); 
                return
            } else {
                userLogin = checkExitEmail.user
                res.render(`${folderView}confirmOTP`, {
                    userLogin,
                    pageTitle,
                    layout,
                    error: errors.errors,
                    }); 
                    return
            }
            } catch (error) {
                console.log(error)
                res.redirect(linkForgotPassword)
            }
});

router.post('/doi-mat-khau',
            body('email')
                .isEmail()
                .normalizeEmail()
                .withMessage(notify.ERROR_REGISTER_EMAIL),
            body('otpCode')
                .not()
                .isEmpty()
                .withMessage(notify.ERROR_OTP_CODE),
            body('password')
                .custom((value, { req })=>{
                    let {confirmpassword, password} = req.body
    
                    if (!confirmpassword || !password) {
                        return Promise.reject(notify.ERROR_REGISTER_PASS_INPUT)
                    }
                    if((confirmpassword.length<8 || confirmpassword.length>18)|| (password.length<8 || password.length>18)
                    ){
                        return Promise.reject(util.format(notify.ERROR_REGISTER_PASS,8,18))
                    }
                    if(password != confirmpassword){
                        return Promise.reject(notify.ERROR_REGISTER_PASSCONFIRM)
                    }
                    return Promise.resolve()
            }),
 async function(req, res, next) {
	try {
		if(req.isAuthenticated()) res.redirect(linkPersonal);
		let {email, otp, password, confirmpassword} = req.body
		if(req.isAuthenticated()) res.redirect(linkIndex);
            let userLogin = req.body
            let errors = validationResult(req)
            if(!errors.isEmpty()) {
                res.render(`${folderView}confirmOTP`, {
                userLogin,
                pageTitle,
                layout,
                error: errors.errors,
                }); 
                return
            } else {
                let reset = await serviceManageUser.finalResetPassword(userLogin.email, userLogin.otpCode, userLogin.password)
                if(reset.hasOwnProperty('error')){
                    if(reset.error == notify.ERROR_OTP_OUTTIME){
                        errors.errors.push({
                            msg: reset.error,
                            param: 'otpouttime'
                    })
                    }else{
                        errors.errors.push({
                            msg: reset.error,
                            param: 'otpwrong'
                        })
                    }
                    console.log(reset)
                    res.render(`${folderView}confirmOTP`, {
                        userLogin,
                        pageTitle,
                        layout,
                        error: errors.errors,
                        }); 
                        return
                } else if(reset.hasOwnProperty('success')){
                    errors.errors.push({
                        msg: reset.success,
                        param: 'success'
                    })
                    res.render(`${folderViewLogin}login`, {
                        userLogin,
                        pageTitle,
                        layout,
                        error: errors.errors,
                        }); 
                        return
                }   
            }
	} catch (error) {
		console.log(error)
        res.redirect(linkLogin)
	}
})

module.exports = router;


