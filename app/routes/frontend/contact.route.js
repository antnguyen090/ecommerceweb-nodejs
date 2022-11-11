var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const layout	     = __path_views_frontend + 'frontend';
const { body, validationResult } = require('express-validator');

const mainName = "contact"
const pageTitle ='Liên Hệ'
const folderView = __path_views_frontend + `pages/${mainName}/`;
const FrontEndHelpers = require(__path_helpers + 'frontend');

/* GET home page. */
router.get('/', async function(req, res, next) {
    try {
        res.render(`${folderView}contact`, {
            pageTitle,
            layout,
        });        
    } catch (error) {
        console.log(error)
    }
    
});

router.post('/', 
    body('name')
        .isLength({min: 1, max: 100}),
    body('email')
        .isEmail(),
    body('phonenumber')
        .isMobilePhone(),
    body('subject')
        .isLength({min: 1}),
    body('message')
        .isLength({min: 1}),
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


