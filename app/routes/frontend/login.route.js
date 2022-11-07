var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const layout	     = __path_views_frontend + 'frontend';
const { body, validationResult } = require('express-validator');
const notify = require(__path_configs + 'notify');
var util = require('util')
const passport = require('passport')

const StringHelpers 	= require(__path_helpers + 'string');
const mainName = "login"
const pageTitle= 'Đăng Nhập'
const folderView = __path_views_frontend + `pages/${mainName}/`;
const FrontEndHelpers = require(__path_helpers + 'frontend');
const linkIndex		= StringHelpers.formatLink('/');
const linkLogin		= StringHelpers.formatLink('/dang-nhap'); 

/* GET home page. */
router.get('/', async function(req, res, next) {
    if(req.isAuthenticated()) res.redirect(linkIndex);
    let error = []
    if(req.flash().hasOwnProperty('error')){
        if(req.flash().error === notify.ERROR_LOGIN_PASS){
            error.push({
                msg: req.flash().error,
                param: 'loginpass'
            })
        } else if(req.flash().error === notify.ERROR_LOGIN_CHECKUSER){
            error.push({
                msg: req.flash().error,
                param: 'loginuser'
            })
        }
    }
    let userLogin = {}
    try {
    res.render(`${folderView}login`, {
        pageTitle,
        layout,
        userLogin,
        error: error,
     });        
    } catch (error) {
        console.log(error)
        res.redirect(linkLogin)
    }
    
});

router.post('/',
        body('email')
            .isEmail()
            .normalizeEmail()
            .withMessage(notify.ERROR_REGISTER_EMAIL),
        body('password')
            .isLength({min:8, max:18})
            .withMessage(util.format(notify.ERROR_REGISTER_PASS,8,18)),
            // .withMessage(util.format(notify.ERROR_REGISTER_PASS,8,18)),
        async function(req, res, next) {
            try {
            if(req.isAuthenticated()) res.redirect(linkIndex);
            let userLogin = req.body
            let errors = validationResult(req)
            if(!errors.isEmpty()) {
                res.render(`${folderView}login`, {
                userLogin,
                pageTitle,
                layout,
                error: errors.errors,
                }); 
                return
            } else{
                passport.authenticate('local.login', { 
                    successRedirect: linkIndex,
                    failureRedirect: linkLogin,
                    failureFlash: true
                })(req, res, next)
                return
            }
            } catch (error) {
                res.redirect(linkLogin)
            }
});


module.exports = router;


