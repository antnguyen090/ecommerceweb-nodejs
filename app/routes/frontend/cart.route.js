var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const layout	     = __path_views_frontend + 'frontend';
const { body, validationResult } = require('express-validator');
const notify = require(__path_configs + 'notify');
var util = require('util')
const passport = require('passport');
const { json } = require('express');

const StringHelpers 	= require(__path_helpers + 'string');
const TimeInRangeHelpers 	= require(__path_helpers + 'checktimeinrange');

const mainName = "cart"
const pageTitle= 'Giỏ Hàng'
const folderView = __path_views_frontend + `pages/${mainName}/`;
const FrontEndHelpers = require(__path_helpers + 'frontend');
const linkLogin		= StringHelpers.formatLink('/dang-nhap'); 
const linkIndex	= StringHelpers.formatLink('/'); 
const serviceDelivery = require(__path_services_backend + `delivery.service`);


/* GET home page. */
router.get('/', async function(req, res, next) {
    try {
        let deliveryList = await FrontEndHelpers.getDeliveryList()
        res.render(`${folderView}${mainName}`, {
            pageTitle,
            layout,
            deliveryList
         });     
    } catch (error) {
        console.log(error)
        res.redirect(linkIndex)
    }
});

router.post('/', async function(req, res, next) {
    try {
        let data = JSON.parse(req.body.data)
        let dataIds = data.map(item => {
            return item.id
        })
        let listProduct = await FrontEndHelpers.getProductByIds(dataIds)
        res.send({success:true, data: listProduct});     
    } catch (error) {
        console.log(error)
        res.send({success:false, data: []});     
    }
});

router.post('/ma-giam-gia', 
    body('couponCode')
     .isLength({min: 4 , max: 20})
     .withMessage(notify.ERROR_COUPON_CODE),
    body('totalPrice')
     .isInt({min: 1})
     .withMessage(notify.ERROR_COUPON_CODE_PRICE),
    async function(req, res, next) {
    try {
        let {couponCode, totalPrice} = req.body
        let timeNow                  = Date.now()
        let errors = validationResult(req)
        if(!errors.isEmpty()){
            res.send({success:false, data: null});
            return     
        }
        let findCode = await FrontEndHelpers.getCodeCoupon({status:"active", couponcode: couponCode})
        if(findCode) 
        {
            let minTotal = findCode.couponValue.minTotal
            if(totalPrice >= minTotal && TimeInRangeHelpers.checkTimeInRange(findCode.time)){
                res.send({success:true, data: findCode, totalPrice: totalPrice});     
                return 
            }

        }
        res.send({success:false, data: null});     
    } catch (error) {
        console.log(error)
        res.send({success:false, data: null});     
    }
});

router.post('/dat-hang', 
    body('name')
        .isLength({min: 2, max: 30})
        .withMessage(util.format(notify.ERROR_PROFILE_NAME,2,30)),
    body('infoAddress')
        .isLength({min: 10, max: 60})
        .withMessage(util.format(notify.ERROR_PROFILE_ADDRESS,10,60)),
    body('notes')
        .isLength({min: 0, max: 300})
        .withMessage(util.format(notify.ERROR_PROFILE_NOTES,0,300)),
    body('phoneNumber')
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
                    req.body.userId = req.user.id
                    req.body.email = req.user.email
                    let processOrder = await FrontEndHelpers.addOrder(req.body)
                    res.send(processOrder)
                }
            }else{
                res.send({success: false, errors:[{
                    msg:notify.PRESS_F5
                }]})
            }
        } catch (error) {
            console.log(error)
            res.send({success: false,errors:[{
                msg: notify.PRESS_F5
            }]})
        }
});

module.exports = router;


