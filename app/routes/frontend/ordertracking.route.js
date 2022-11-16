var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const layout	     = __path_views_frontend + 'frontend';
const { body, validationResult } = require('express-validator');

const mainName = "ordertracking"
const pageTitle ='Tra Cứu Đơn Hàng'
const folderView = __path_views_frontend + `pages/${mainName}/`;
const FrontEndHelpers = require(__path_helpers + 'frontend');

router.get('/', 
    async function(req, res, next) {
        try {
                let orderData = {}
                if(req.query.trackingCode){
                    orderData = await FrontEndHelpers.getOrderByTrackingCode(req.query.trackingCode)
                    res.send({success: true, data: orderData})
                } else{
                    res.render(`${folderView}ordertracking`, {
                        pageTitle,
                        layout,
                        orderData,
                    }); 
                }
        } catch (error) {
            res.send({success: false, data: null})
            console.log(error)
        }
  });

module.exports = router;


