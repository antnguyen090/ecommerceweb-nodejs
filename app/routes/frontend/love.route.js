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
const mainName = "love"
const pageTitle= 'Sản Phẩm Yêu Thích'
const folderView = __path_views_frontend + `pages/${mainName}/`;
const FrontEndHelpers = require(__path_helpers + 'frontend');
const linkLogin		= StringHelpers.formatLink('/dang-nhap'); 
const linkIndex	= StringHelpers.formatLink('/'); 


/* GET home page. */
router.get('/', async function(req, res, next) {
    try {
        res.render(`${folderView}love`, {
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
        let listProduct = await FrontEndHelpers.getProductByIds(data)
        res.send({success:true, data: listProduct});     
    } catch (error) {
        console.log(error)
        res.send({success:false, data: []});     
    }
});



module.exports = router;


