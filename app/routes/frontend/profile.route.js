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


/* GET home page. */
router.get('/', async function(req, res, next) {
    try {
        let deliveryList = await FrontEndHelpers.getDeliveryList()
        if(req.isAuthenticated()) {
            res.render(`${folderView}profile`, {
                pageTitle,
                layout,
                deliveryList,
             });     
        }else{
            res.redirect(linkLogin)
        }
    } catch (error) {
        console.log(error)
        res.redirect(linkLogin)
    }
    
});



module.exports = router;


