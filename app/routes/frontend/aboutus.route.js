var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const layout	     = __path_views_frontend + 'frontend';
const { body, validationResult } = require('express-validator');


const mainName = "aboutus"
const pageTitle= 'Về Chúng Tôi'
const folderView = __path_views_frontend + `pages/${mainName}/`;
const FrontEndHelpers = require(__path_helpers + 'frontend');

/* GET home page. */
router.get('/', async function(req, res, next) {
    try {
    res.render(`${folderView}aboutus`, {
        pageTitle,
        layout,
     });        
    } catch (error) {
        console.log(error)
        res.redirect("/error")
    }
    
});

router.post('/', 
    body('name')
        .isLength({min: 2, max: 100}),
    body('email')
        .isEmail(),
    body('phonenumber')
        .isMobilePhone(),
    body('subject')
        .isLength({min: 5}),
    body('message')
        .isLength({min: 5}),
    async function(req, res, next) {
        try {
            let errors = validationResult(req)
            if(!errors.isEmpty()) {
                res.send({success: false})
            } else{
                let item = req.body
                item.status = 'inactive'
                item.ordering = '1'
                let sendMail = await FrontEndHelpers.sendMailContact(item)
                let saveData = await FrontEndHelpers.saveContact(item)
                res.send({success: true})
            }
        } catch (error) {
            console.log(error)
            res.send({success: false})
        }
  });

  router.post('/dang-ky-mail', 
    body('email')
        .isEmail(),
    async function(req, res, next) {
        try {
            let errors = validationResult(req)
            if(!errors.isEmpty()) {
                res.send({success: false})
            } else{
                let item = req.body
                item.status = 'active'
                item.ordering = '1'
                let sendMail = await FrontEndHelpers.sendMailLetter(item)
                let saveData = await FrontEndHelpers.saveNewsletter(item)
                res.send({success: true})
            }
        } catch (error) {
            console.log(error)
            res.send({success: false})
        }
  });

module.exports = router;


