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


/* GET home page. */
router.get('/', async function(req, res, next) {
    try {
        res.render(`${folderView}${mainName}`, {
            pageTitle,
            layout,
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



module.exports = router;


