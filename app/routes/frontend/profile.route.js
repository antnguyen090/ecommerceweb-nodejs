var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const layout	     = __path_views_frontend + 'frontend';
const { body, validationResult } = require('express-validator');
const notify = require(__path_configs + 'notify');
var util = require('util')
const passport = require('passport')

const StringHelpers 	= require(__path_helpers + 'string');
const mainName = "profile"
const pageTitle= 'Trang Cá Nhân'
const folderView = __path_views_frontend + `pages/${mainName}/`;
const FrontEndHelpers = require(__path_helpers + 'frontend');
const linkLogin		= StringHelpers.formatLink('/dang-nhap'); 
const serviceDelivery = require(__path_services_backend + `delivery.service`);

/* GET home page. */
router.get('/', async function(req, res, next) {
    try {
        if(req.isAuthenticated()) {
            let deliveryList = await FrontEndHelpers.getDeliveryList()
            res.render(`${folderView}profile`, {
                pageTitle,
                layout,
                deliveryList,
             }); 
             return 
        }else{
            res.redirect(linkLogin)
        }
    } catch (error) {
        console.log(error)
        res.redirect(linkLogin)
    }
    
});

router.post('/cap-nhat-thong-tin',
        body('name')
                .isLength({min: 2, max: 30})
                .withMessage(util.format(notify.ERROR_PROFILE_NAME,2,30)),
        body('addressInfo')
                .isLength({min: 10, max: 60})
                .withMessage(util.format(notify.ERROR_PROFILE_ADDRESS,10,60)),
        body('phonenumber')
                .isMobilePhone()
                .withMessage(notify.ERROR_PHONENUMBER_INVALID),
        body('province')
             .custom(async (val, {req}) => {
			if ( val == undefined) {
				return Promise.reject(notify.ERROR_PROVINCE)
			} else {
				try {
					let data = await serviceDelivery.getItemByID(val)
					return data;
				} catch (error) {
					return Promise.reject(notify.ERROR_PROVINCE_INVALID)
				}
		}}),
        async function(req, res, next) {
            try {
                let errors = validationResult(req)
                if(req.isAuthenticated()) {
                    if(!errors.isEmpty()){
                        res.send({success: false, errors: errors.errors})
                        return
                    } else{
                        let email = req.user.email
                        req.body.email = email
                        let updateUser = await FrontEndHelpers.updateInfoUser(req.body)
                        res.send({success: true})
                    }
                }else{
                    res.send({success: false, errors:[{
                        msg:"Có lỗi xảy ra vui lòng F5 trang"
                    }]})
                }
            } catch (error) {
                res.send({success: false,errors:[{
                    msg:"Có lỗi xảy ra vui lòng F5 trang"
                }]})
            }
            
});

router.post('/doi-mat-khau',
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
                let errors = validationResult(req)
                if(req.isAuthenticated()) {
                    if(!errors.isEmpty()){
                        res.send({success: false, errors: errors.errors})
                        return
                    } else{
                        let email = req.user.email
                        req.body.email = email
                        let updateUser = await FrontEndHelpers.updatePasswordUser(req.body)
                        res.send(updateUser)
                    }
                }else{
                    res.send({success: false, errors:[{
                        msg:"Có lỗi xảy ra vui lòng F5 trang"
                    }]})
                }
            } catch (error) {
                console.log(error)
                res.send({success: false,errors:[{
                    msg:"Có lỗi xảy ra vui lòng F5 trang"
                }]})
            }
            
});


module.exports = router;


