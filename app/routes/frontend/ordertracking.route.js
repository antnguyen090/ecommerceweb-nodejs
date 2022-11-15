var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const layout	     = __path_views_frontend + 'frontend';
const { body, validationResult } = require('express-validator');

const mainName = "ordertracking"
const pageTitle ='Tra Cứu Đơn Hàng'
const folderView = __path_views_frontend + `pages/${mainName}/`;
const FrontEndHelpers = require(__path_helpers + 'frontend');

router.get('/(:trackingCode)?', 
    async function(req, res, next) {
        try {
            if(req.params.trackingCode){
                let orderData = await FrontEndHelpers.getOrderByTrackingCode(req.params.trackingCode)
                res.render(`${folderView}ordertracking`, {
                    pageTitle,
                    layout,
                    orderData,
                 });     
            } else{
                throw new Error('Required')
            }
        } catch (error) {
            console.log(error)
        }
  });


module.exports = router;


