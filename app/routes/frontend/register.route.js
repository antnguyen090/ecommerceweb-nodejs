var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const layout	     = __path_views_frontend + 'frontend';
const { body, validationResult } = require('express-validator');
const notify = require(__path_configs + 'notify');
var util = require('util')
const passport = require('passport')

const StringHelpers 	= require(__path_helpers + 'string');
const mainName = "register"
const pageTitle= 'Đăng Ký'
const folderView = __path_views_frontend + `pages/${mainName}/`;
const FrontEndHelpers = require(__path_helpers + 'frontend');
const linkIndex		    = StringHelpers.formatLink('/');
const linkRegister		= StringHelpers.formatLink('/dang-ky'); 

/* GET home page. */
router.get('/', async function(req, res, next) {
    if(req.isAuthenticated()) res.redirect(linkIndex);
    let error = []
    if(req.flash().hasOwnProperty('error')){
        error.push({
            msg: req.flash().error,
            param: 'emailexits'
        })
    }
    let userRegister = {}
    try {
    res.render(`${folderView}register`, {
        pageTitle,
        layout,
        userRegister,
        error: error,
     });        
    } catch (error) {
        console.log(error)
        res.redirect(linkRegister)
    }
    
});

router.post('/',
        body('email')
            .isEmail()
            .normalizeEmail()
            .withMessage(notify.ERROR_REGISTER_EMAIL),
        body('name')
            .isLength({min: 2, max: 15})
            .withMessage(util.format(notify.ERROR_REGISTER_NAME,2,15)),
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
            // .withMessage(util.format(notify.ERROR_REGISTER_PASS,8,18)),
        body('policy')
            .not()
            .isEmpty()
            .withMessage(notify.ERROR_REGISTER_POLICY),
        async function(req, res, next) {
            try {
            if(req.isAuthenticated()) res.redirect(linkIndex);
            let userRegister = req.body
            let errors = validationResult(req)
            if(!errors.isEmpty()) {
                res.render(`${folderView}register`, {
                userRegister,
                pageTitle,
                layout,
                error: errors.errors,
                }); 
                return
            } else{
                passport.authenticate('local.register', { 
                    successRedirect: linkIndex,
                    failureRedirect: linkRegister,
                    failureFlash: true
                })(req, res, next)
                return
            }
            } catch (error) {
                console.log(error)
                res.redirect(linkRegister)
            }
});


module.exports = router;


