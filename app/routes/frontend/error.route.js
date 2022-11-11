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
const mainName = "error"
const pageTitle= 'Không Tìm Thấy Trang'
const folderView = __path_views_frontend + `pages/${mainName}/`;
const FrontEndHelpers = require(__path_helpers + 'frontend');
const linkLogin		= StringHelpers.formatLink('/dang-nhap'); 
const linkIndex	= StringHelpers.formatLink('/'); 


/* GET home page. */
router.get('/', async function(req, res, next) {
    try {
        res.render(`${folderView}error`, {
            pageTitle,
            layout,
         });     
    } catch (error) {
        console.log(error)
        res.redirect(linkIndex)
    }
});


module.exports = router;


